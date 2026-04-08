

const express = require('express');
const { sheets, spreadsheetId, drive } = require('../config/googleSheet');
const router = express.Router();
const { Readable } = require('stream');


const SHEET_NAME = 'Client_Payment_In_Data';

// ─────────────────────────────────────────────────────────────
// Helper: Convert any date format to DD/MM/YYYY
// ─────────────────────────────────────────────────────────────
function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';

  const trimmed = dateStr.trim();
  if (!trimmed) return '';

  // Already in DD/MM/YYYY format
  const ddmmyyyy = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) return trimmed;

  // DD-MM-YYYY format
  const ddmmyyyyDash = trimmed.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (ddmmyyyyDash) return `${ddmmyyyyDash[1]}/${ddmmyyyyDash[2]}/${ddmmyyyyDash[3]}`;

  // YYYY-MM-DD format (ISO / HTML date input)
  const yyyymmdd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (yyyymmdd) return `${yyyymmdd[3]}/${yyyymmdd[2]}/${yyyymmdd[1]}`;

  // YYYY/MM/DD format
  const yyyymmddSlash = trimmed.match(/^(\d{4})\/(\d{2})\/(\d{2})$/);
  if (yyyymmddSlash) return `${yyyymmddSlash[3]}/${yyyymmddSlash[2]}/${yyyymmddSlash[1]}`;

  // Fallback: JS Date parse karo
  const parsed = new Date(trimmed);
  if (!isNaN(parsed)) {
    return `${String(parsed.getDate()).padStart(2, '0')}/${String(parsed.getMonth() + 1).padStart(2, '0')}/${parsed.getFullYear()}`;
  }

  return trimmed; // kuch bhi na ho to as-is return
}


// ─────────────────────────────────────────────────────────────
// Helper: Buffer from base64
// ─────────────────────────────────────────────────────────────
function bufferFromBase64(base64String) {
  const match = base64String.match(/^data:([a-zA-Z0-9\/\-\+\.]+);base64,(.+)$/);
  if (!match) return null;
  return Buffer.from(match[2], 'base64');
}


// ─────────────────────────────────────────────────────────────
// Google Drive Upload Function
// ─────────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────
// ✅ FIXED IST Timestamp Helper (UTC + 5:30 manually)
// ─────────────────────────────────────────────────────────────
function getISTTimestamp() {
  const now = new Date();

  // IST = UTC + 5 hours 30 minutes
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + istOffset);

  const dd  = String(istDate.getUTCDate()).padStart(2, '0');
  const mm  = String(istDate.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = istDate.getUTCFullYear();
  const hh  = String(istDate.getUTCHours()).padStart(2, '0');
  const min = String(istDate.getUTCMinutes()).padStart(2, '0');
  const ss  = String(istDate.getUTCSeconds()).padStart(2, '0');

  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
}


// ─────────────────────────────────────────────────────────────
// UID Generator: Client_Payment_In_Data → IN-XXXX
// ─────────────────────────────────────────────────────────────
async function generateUniqueUIDINDATA() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Client_Payment_In_Data!B7:B10000',
    });

    const values = response.data.values || [];

    if (values.length === 0) {
      return 'IN-0001';
    }

    let maxNumber = 0;

    values.forEach(row => {
      const uid = row[0]?.toString().trim();
      if (uid && uid.startsWith('IN-')) {
        const numPart = uid.substring(3);
        const cleaned = numPart.replace(/^0+/, '');
        const num = parseInt(cleaned, 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const nextNumber = maxNumber + 1;
    return `IN-${String(nextNumber).padStart(4, '0')}`;

  } catch (error) {
    console.error('Error generating UID:', error);
    return 'IN-0001';
  }
}


// ─────────────────────────────────────────────────────────────
// UID Generator: A/C To A/C Transfer → TRFXXX
// ─────────────────────────────────────────────────────────────
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


// ─────────────────────────────────────────────────────────────
// UID Generator: Capital_Movement_Form → CAPXXX
// ─────────────────────────────────────────────────────────────
async function generateUniqueCapitalUID() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Capital_Movement_Form!B7:B',
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      return 'CAP001';
    }

    const lastUID = values[values.length - 1][0];

    if (!lastUID || !lastUID.startsWith('CAP')) {
      return 'CAP001';
    }

    const lastNumber = parseInt(lastUID.replace('CAP', ''), 10);
    const nextNumber = lastNumber + 1;
    return `CAP${String(nextNumber).padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating UID:', error);
    return 'CAP001';
  }
}


// ─────────────────────────────────────────────────────────────
// POST /add-payment → Form 1: Client Payment In Data
// ─────────────────────────────────────────────────────────────
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

    // Photo upload
    let chequePhotoUrl = '';
    if (ChequePhoto && ChequePhoto.startsWith('data:')) {
      const uniqueId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      const fileName = `cheque_${uniqueId}.jpg`;
      chequePhotoUrl = await uploadToGoogleDrive(ChequePhoto, fileName);
    }

    const UID = await generateUniqueUIDINDATA();

    const cleanTimestamp = getISTTimestamp();

    const row = [
      cleanTimestamp,                       // A - Timestamp
      UID,                                  // B - UID
      SiteName,                             // C - SiteName
      Amount || 0,                          // D - Amount
      CGST || 0,                            // E - CGST
      SGST || 0,                            // F - SGST
      NetAmount || 0,                       // G - NetAmount
      RccCreditAccountName || '',           // H
      PaymentMode || '',                    // I
      ChequeNo || '',                       // J
      formatDateToDDMMYYYY(ChequeDate),     // K - ChequeDate → DD/MM/YYYY
      chequePhotoUrl                        // L - Photo URL
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${SHEET_NAME}!A:M`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });

    res.json({
      status: 'success',
      message: 'Payment data added successfully',
      timestamp: cleanTimestamp,
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


// ─────────────────────────────────────────────────────────────
// POST /Bank_Transfer_form → Form 2: A/C To A/C Transfer
// ─────────────────────────────────────────────────────────────
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

    const UID = await generateUniqueUID();

    const cleanTimestamp = getISTTimestamp();

    const rowData = [
      cleanTimestamp,                        // A - Timestamp
      UID,                                   // B - UID
      Transfer_A_C_Name,                     // C
      Transfer_Received_A_C_Name,            // D
      Amount,                                // E
      PAYMENT_MODE,                          // F
      PAYMENT_DETAILS || '',                 // G
      formatDateToDDMMYYYY(PAYMENT_DATE),    // H - Payment Date → DD/MM/YYYY
      Remark || ''                           // I
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A/C To A/C Transfer!A7:I',
      valueInputOption: 'USER_ENTERED',
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


// ─────────────────────────────────────────────────────────────
// GET /Dropdown-Data → Project_Data se dropdown options
// ─────────────────────────────────────────────────────────────
router.get('/Dropdown-Data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Project_Data!A2:C',
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        projects: [],
        accounts: [],
        capitalMovements: []
      });
    }

    // Projects → Column A (unique, non-empty)
    const projectSet = new Set();
    rows.forEach(row => {
      const val = row[0]?.toString().trim();
      if (val) projectSet.add(val);
    });
    const projects = [...projectSet].sort();

    // Accounts → Column B (unique, non-empty)
    const accountSet = new Set();
    rows.forEach(row => {
      const val = row[1]?.toString().trim();
      if (val) accountSet.add(val);
    });
    const accounts = [...accountSet].sort();

    // Capital Movement Options → Column C (unique, non-empty)
    const movementSet = new Set();
    rows.forEach(row => {
      const val = row[2]?.toString().trim();
      if (val) movementSet.add(val);
    });
    const capitalMovements = [...movementSet].sort();

    res.json({
      success: true,
      projects,
      accounts,
      capitalMovements
    });

  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dropdown data',
      error: error.message
    });
  }
});


// ─────────────────────────────────────────────────────────────
// POST /Captial-A/C → Form 3: Capital Movement Form
// ─────────────────────────────────────────────────────────────
router.post('/Captial-A/C', async (req, res) => {
  try {
    const {
      Capital_Movment,
      Received_Account,
      Amount,
      PAYMENT_MODE,
      PAYMENT_DETAILS = '',
      PAYMENT_DATE = '',
      Remark = ''
    } = req.body;

    // Required fields
    if (!Capital_Movment || !Received_Account || !Amount || !PAYMENT_MODE) {
      return res.status(400).json({
        success: false,
        message: 'Capital Movement, Received Account, Amount aur Payment Mode dena zaroori hai'
      });
    }

    // Payment mode Cash nahi hai to PAYMENT_DATE check karo
    const needsTransactionDetails = ['Cheque', 'NEFT', 'RTGS', 'UPI'].includes(PAYMENT_MODE);

    if (needsTransactionDetails) {
      if (!PAYMENT_DATE.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Payment Date dena zaroori hai jab mode Cash nahi hai'
        });
      }
    }

    const UID = await generateUniqueCapitalUID();

    const cleanTimestamp = getISTTimestamp();

    const rowData = [
      cleanTimestamp,                        // A - Timestamp
      UID,                                   // B - UID
      Capital_Movment,                       // C
      Received_Account,                      // D
      Amount,                                // E
      PAYMENT_MODE,                          // F
      PAYMENT_DETAILS,                       // G
      formatDateToDDMMYYYY(PAYMENT_DATE),    // H - Payment Date → DD/MM/YYYY
      Remark                                 // I
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Capital_Movement_Form!A7:I',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowData]
      }
    });

    res.status(200).json({
      success: true,
      message: 'Capital movement saved successfully',
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