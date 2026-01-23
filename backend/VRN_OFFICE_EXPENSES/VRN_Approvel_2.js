const express = require('express');
const { sheets, SPREADSHEET_ID_OFFICE_EXPENSES } = require('../config/googleSheet');
const router = express.Router();

// NEW ROUTE: Office Expenses Sheet (SPREADSHEET_ID_OFFICE_EXPENSES) se data fetch
router.get('/GET-VRN-Expenses-Data-Approved2', async (req, res) => {
  try {
    // Safety check
    if (!SPREADSHEET_ID_OFFICE_EXPENSES) {
      return res.status(500).json({
        success: false,
        error: 'SPREADSHEET_ID_OFFICE_EXPENSES is not configured',
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,  
      range: 'VRN_INC_OFFICE_PAYMENT!A7:R', 
      
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, message: 'No data found', data: [] });
    }

    const filteredData = rows
      .filter(row => row[15] && !row[16])   // Pending approval wale only (optional)
      .map(row => ({
      Timestamp      : (row[0]  || '').toString().trim(),   // A
      Office_Bill_No : (row[1]  || '').toString().trim(),   // B
      OFFICE_NAME_1  : (row[2]  || '').toString().trim(),   // C
      PAYEE_NAME_1   : (row[3]  || '').toString().trim(),   // D
      EXPENSES_HEAD_1: (row[4]  || '').toString().trim(),   // E
      EXPENSES_SUBHEAD_1: (row[5]  || '').toString().trim(), // F
      DEPARTMENT_1   : (row[6] || '').toString().trim(),   // L (very important – confirm this column)
      APPROVAL_DOER  : (row[7] || '').toString().trim(),   // M
      RAISED_BY_1    : (row[8] || '').toString().trim(),   // N
      Bill_Photo_1   : (row[9] || '').toString().trim(),   // P
      Total_Amount   : (row[10] || '').toString().trim(),   // K (most common position for amount)
      PLANNED_3   : (row[15] || '').toString().trim(),   // 
      }));

    res.json({
      success: true,
      totalRecords: filteredData.length,
      data: filteredData,
    });
  } catch (error) {
    console.error('Error in /GET-Office-Expenses-Data:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch office expenses data',
      details: error.message,
    });
  }
});


router.post('/update-VRN-OFFICE-Expenses-Data-Approved2', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { uid, STATUS_3, FINAL_AMOUNT_3, REMARK_3 } = req.body;

    if (!uid) {
      return res.status(400).json({ success: false, message: 'Bill No (uid) is required' });
    }

    const trimmedBillNo = String(uid).trim();

    // Get all values from the Bill No column (change C7:C → your actual column)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'VRN_INC_OFFICE_PAYMENT!B7:B',   //  ←←← Change to correct Bill No column
    });

    const values = response.data.values || [];

    const rowIndex = values.findIndex(row => {
      if (!row || row.length === 0) return false;
      const sheetValue = String(row[0]).trim();
      return sheetValue === trimmedBillNo;
    });

    if (rowIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'No matching Bill No found',
        searchedFor: trimmedBillNo,
      });
    }

    const sheetRowNumber = 7 + rowIndex;

    // Update STATUS_3 → column R, FINAL_AMOUNT_3 → T, REMARK_3 → U
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: `VRN_INC_OFFICE_PAYMENT!R${sheetRowNumber}`, values: [[STATUS_3 ?? '']] },
          { range: `VRN_INC_OFFICE_PAYMENT!T${sheetRowNumber}`, values: [[FINAL_AMOUNT_3 ?? '']] },
          { range: `VRN_INC_OFFICE_PAYMENT!U${sheetRowNumber}`, values: [[REMARK_3 ?? '']] },
        ]
      }
    });

    res.json({ success: true, message: 'Final approval updated', row: sheetRowNumber });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;