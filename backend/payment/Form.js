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

    // Timestamp - Exact format: 29/12/2025 11:31:54
    const now = new Date();
    const Timestamp = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;

    // Force as plain string to prevent Google Sheets from adding '
    const cleanTimestamp = Timestamp.toString().trim();

    // Row data - Column B (UID) ke liye empty string daal rahe hain taaki formula safe rahe
    const row = [
      cleanTimestamp,             // A - Timestamp (clean - no leading ')
      '',                         // B - UID → empty chhod rahe hain (sheet ka formula apne aap fill karega)
      SiteName,                   // C - SiteName
      Amount || 0,                // D - Amount
      CGST || 0,                  // E - CGST
      SGST || 0,                  // F - SGST
      NetAmount || 0,             // G - NetAmount
      RccCreditAccountName || '', // H
      PaymentMode || '',          // I
      ChequeNo || '',             // J
      ChequeDate || '',           // K
      chequePhotoUrl              // L - Photo URL
    ];

    // Append to sheet - USER_ENTERED mode use kar rahe hain taaki quote nahi aaye
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'USER_ENTERED',  // ← Yeh line add ki hai (important)
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    // Success response - UID bilkul nahi bhej rahe (na generate, na send)
    res.json({
      status: 'success',
      message: 'Payment data added successfully',
      timestamp: cleanTimestamp,  // clean timestamp bhej rahe hain
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


//////// transfer form Api 
async function generateUniqueUID() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A/C To A/C Transfer!B7:B',
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      return 'TRF001';
    }

    const lastUID = values[values.length - 1][0];

    if (!lastUID || !lastUID.startsWith('TRF')) {
      return 'TRF001';
    }

    const lastNumber = parseInt(lastUID.replace('TRF', ''), 10);
    const nextNumber = lastNumber + 1;
    return `TRF${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating UID:', error);
    return 'TRF001';
  }
}

router.post('/Bank_Transfer_form', async (req, res) => {
  try {
    const {
      Transfer_A_C_Name,
      Transfer_Received_A_C_Name,
      Amount,
      PAYMENT_MODE,
      PAYMENT_DETAILS,
      PAYMENT_DATE,
      Remark
    } = req.body;

    if (
      !Transfer_A_C_Name ||
      !Transfer_Received_A_C_Name ||
      !Amount ||
      !PAYMENT_MODE ||
      !PAYMENT_DATE
    ) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Generate UID
    const UID = await generateUniqueUID();

    // Exact timestamp format: 29/12/2025 11:31:54
    const now = new Date();
    const Timestamp = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Force as plain string to prevent Google Sheets from adding '
    const cleanTimestamp = Timestamp.toString().trim();

    const rowData = [
      cleanTimestamp,             // A - Timestamp → 29/12/2025 11:31:54 (clean)
      UID,                        // B - UID
      Transfer_A_C_Name,          // C
      Transfer_Received_A_C_Name, // D
      Amount,                     // E
      PAYMENT_MODE,               // F
      PAYMENT_DETAILS || '',      // G
      PAYMENT_DATE,               // H
      Remark || ''                // I
    ];

    // Yeh line sabse important hai → USER_ENTERED mode use karo
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A/C To A/C Transfer!A7:I',
      valueInputOption: 'USER_ENTERED',  // ← Isse quote nahi aayega
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData]
      }
    });

    res.status(200).json({
      success: true,
      message: 'Bank transfer data saved successfully',
      data: {
        UID,
        Timestamp: cleanTimestamp,
        ...req.body
      }
    });

  } catch (error) {
    console.error('Error saving to Google Sheet:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data',
      error: error.message
    });
  }
});

module.exports = router;