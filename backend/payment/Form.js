const express = require('express');
const { sheets, spreadsheetId, drive } = require('../config/googleSheet');
const router = express.Router();
const { Readable } = require('stream');


const SHEET_NAME = 'Client_Payment_In_Data';

// Helper: Buffer from base64
function bufferFromBase64(base64String) {
  const match = base64String.match(/^data:([a-zA-Z0-9\/\-\+\.]+);base64,(.+)$/);
  if (!match) return null;
  return Buffer.from(match[2], 'base64');
}

// Google Drive Upload Function
async function uploadToGoogleDrive(base64Data, fileName) {
  console.log(`[DRIVE UPLOAD START] ${fileName}`);

  if (!base64Data || typeof base64Data !== 'string') {
    console.warn(`[DRIVE FAILED] ${fileName} → No data`);
    return '';
  }

  const buffer = bufferFromBase64(base64Data);
  if (!buffer) {
    console.warn(`[DRIVE FAILED] ${fileName} → Invalid base64`);
    return '';
  }

  const mimeType = base64Data.match(/^data:([a-zA-Z0-9\/\-\+\.]+);base64,/)?.[1] || 'image/jpeg';

  try {
    const fileStream = new Readable();
    fileStream.push(buffer);
    fileStream.push(null);

    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = { mimeType, body: fileStream };

    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      supportsAllDrives: true,
    });

    const fileId = res.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: 'reader', type: 'anyone' },
      supportsAllDrives: true,
    });

    const viewUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    console.log(`[DRIVE SUCCESS] ${fileName} → ${viewUrl}`);
    return viewUrl;

  } catch (error) {
    console.error(`[DRIVE ERROR] ${fileName}:`, error.message);
    return '';
  }
}

// // Helper: Next UID generate (Pay001, Pay002...)
// async function getNextUID() {
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: `${SHEET_NAME}!B:B`,
//     });

//     const values = response.data.values || [];

//     if (values.length <= 1) return 'IN001'; // khali sheet ya sirf header

//     const payUIDs = values
//       .slice(1)
//       .flat()
//       .filter(uid => typeof uid === 'string' && uid.trim().startsWith('Pay'))
//       .map(uid => uid.trim());

//     if (payUIDs.length === 0) return 'IN001';

//     const numbers = payUIDs.map(uid => parseInt(uid.replace('Pay', ''), 10));
//     const maxNum = Math.max(...numbers);
//     const nextNum = maxNum + 1;

//     return `Pay${String(nextNum).padStart(3, '0')}`;

//   } catch (error) {
//     console.error('Error generating UID:', error);
//     throw new Error('Failed to generate UID');
//   }
// }

// POST Route
// router.post('/add-payment', async (req, res) => {
//   try {
//     const {
      
//       SiteName,
//       Amount,
//       CGST,
//       SGST,
//       NetAmount,
//       RccCreditAccountName,
//       PaymentMode,
//       ChequeNo,
//       ChequeDate,
//       ChequePhoto
//       // UID yaha se bilkul nahi liya ja raha → backend generate karega
//     } = req.body;

//     // Required fields check
//     if (!SiteName || Amount === undefined) {
//       return res.status(400).json({
//         status: 'error',
//         message: 'SiteName and Amount are required'
//       });
//     }

//     // Step 1: Backend mein UID generate karo
//     const finalUID = await getNextUID();

//     // Step 2: Duplicate safety ke liye ek baar aur check (though getNextUID safe hai)
//     const checkRes = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: `${SHEET_NAME}!B:B`,
//     });

//     const existingUIDs = (checkRes.data.values || [])
//                           .slice(1)
//                           .flat()
//                           .map(uid => uid?.toString().trim());

//     if (existingUIDs.includes(finalUID)) {
//       // Rare case, but safe
//       return res.status(400).json({
//         status: 'error',
//         message: 'Generated UID already exists (try again)',
//         uid: finalUID
//       });
//     }

//     // Photo upload
//     let chequePhotoUrl = '';
//     if (ChequePhoto && ChequePhoto.startsWith('data:')) {
//       const fileName = `cheque_${finalUID}_${Date.now()}.jpg`;
//       chequePhotoUrl = await uploadToGoogleDrive(ChequePhoto, fileName);
//     }

//     // Timestamp
//     const now = new Date();
//     const timestamp = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

//     // Row data
//     const row = [
//       timestamp,
//       // finalUID,  
//       '',         
//       SiteName,
//       Amount || 0,
//       CGST || 0,
//       SGST || 0,
//       NetAmount || 0,
//       RccCreditAccountName || '',
//       PaymentMode || '',
//       ChequeNo || '',
//       ChequeDate || '',
//       chequePhotoUrl
//     ];

//     // Append to sheet
//     await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range: `${SHEET_NAME}!A:M`,
//       valueInputOption: 'RAW',
//       insertDataOption: 'INSERT_ROWS',
//       requestBody: { values: [row] },
//     });

//     // Success response (UID bhi bata do frontend ko)
//     res.json({
//       status: 'success',
//       message: 'Payment data added successfully',
//       uid: finalUID,
//       timestamp,
//       chequePhotoUrl
//     });

//   } catch (error) {
//     console.error('Add payment error:', error);
//     res.status(500).json({
//       status: 'error',
//       message: error.message || 'Server error'
//     });
//   }
// });




// POST Route - UID bilkul nahi generate ya store kar rahe backend se
router.post('/add-payment', async (req, res) => {
  try {
    const {
      SiteName,
      Amount,
      CGST,
      SGST,
      NetAmount,
      RccCreditAccountName,
      PaymentMode,
      ChequeNo,
      ChequeDate,
      ChequePhoto
    } = req.body;

    // Required fields check
    if (!SiteName || Amount === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'SiteName and Amount are required'
      });
    }

    // Photo upload - UID nahi hai to unique filename ke liye timestamp + random number use kar rahe hain
    let chequePhotoUrl = '';
    if (ChequePhoto && ChequePhoto.startsWith('data:')) {
      const uniqueId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const fileName = `cheque_${uniqueId}.jpg`;
      chequePhotoUrl = await uploadToGoogleDrive(ChequePhoto, fileName);
    }

    // Timestamp
    const now = new Date();
    const timestamp = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    // Row data - Column B (UID) ke liye empty string daal rahe hain taaki formula safe rahe
    const row = [
      timestamp,          // A - Timestamp
      '',                 // B - UID → empty chhod rahe hain (sheet ka formula apne aap fill karega)
      SiteName,           // C - SiteName
      Amount || 0,        // D - Amount
      CGST || 0,          // E - CGST
      SGST || 0,          // F - SGST
      NetAmount || 0,     // G - NetAmount
      RccCreditAccountName || '', // H
      PaymentMode || '',          // I
      ChequeNo || '',             // J
      ChequeDate || '',           // K
      chequePhotoUrl              // L - Photo URL
    ];

    // Append to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    // Success response - UID bilkul nahi bhej rahe (na generate, na send)
    res.json({
      status: 'success',
      message: 'Payment data added successfully',
      timestamp,
      chequePhotoUrl
    });

  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Server error'
    });
  }
});

router.get('/Dropdown-Data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Project_Data!A2:B',  // A2 se end tak (B column tak)
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, projects: [], accounts: [] });
    }

    // Column A: Project Names (saare, blank nahi hone chahiye normally)
    const projects = rows
      .map(row => row[0]?.trim())          // A column
      .filter(name => name);               // blank remove kar do agar ho

    // Column B: Account Names (unique aur blank remove)
    const accountsSet = new Set();
    rows.forEach(row => {
      if (row[1]?.trim()) {
        accountsSet.add(row[1].trim());
      }
    });
    const accounts = Array.from(accountsSet);

    // Optional: alphabetically sort kar sakte ho
    projects.sort();
    accounts.sort();

    res.json({
      success: true,
      projects: projects,
      accounts: accounts
    });

  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch data' });
  }
});


module.exports = router;