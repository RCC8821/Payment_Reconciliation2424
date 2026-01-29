const express = require('express');
const { sheets, SPREADSHEET_ID_OFFICE_EXPENSES } = require('../config/googleSheet');
const router = express.Router();



router.get('/Get-VRN-Payment', async (req, res) => {
  try {
    if (!SPREADSHEET_ID_OFFICE_EXPENSES) {
      return res.status(500).json({
        success: false,
        error: 'SPREADSHEET_ID_OFFICE_EXPENSES is not configured',
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'VRN_INC_OFFICE_PAYMENT!A7:Y',   
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, message: 'No data found', data: [] });
    }

   
    const filteredData = rows
    .filter(row => row[23] && !row[24])
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
      // Total_Amount   : (row[10] || '').toString().trim(), 
      FINAL_AMOUNT_3 : (row[19] || '').toString().trim(), 
      PAYMENT_MODE_3 : (row[20] || '').toString().trim(), 
      REMARK_3       : (row[21] || '').toString().trim(),
      PLANNED_4   : (row[23] || '').toString().trim(),   // K (most common position for amount)
    }));

    res.json({
      success: true,
      totalRecords: filteredData.length,
      data: filteredData,
    });

  } catch (error) {
    console.error('Error in /GET-Office-Expenses-Data-Approved2:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch office expenses data',
      details: error.message,
    });
  }
});



router.post('/update-VRN-OFFICE-Payment', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const {
      uid,
      STATUS_4,
      TOTAL_PAID_AMOUNT_4,
      BASIC_AMOUNT_4,                    
      CGST_4,
      SGST_4,
      NET_AMOUNT_4,
      PAYMENT_MODE_17,
      BANK_DETAILS_17,
      PAYMENT_DETAILS_17,
       PAYMENT_DATE_17, 
      Remark_Blank,                      
    } = req.body;

    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'UID is required',
      });
    }

    const trimmedUid = String(uid).trim();
    console.log('Trimmed UID being searched:', trimmedUid);

    // Get column B values (assuming UID / Bill No is in column B starting row 7)
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'VRN_INC_OFFICE_PAYMENT!B7:B', // adjust sheet name / range if needed
    });

    const values = getResponse.data.values || [];
    console.log(`Total rows found in column B: ${values.length}`);

    // Find matching row
    const rowIndex = values.findIndex((row) => {
      const cell = row && row[0] ? String(row[0]).trim() : '';
      return cell === trimmedUid;
    });

    if (rowIndex === -1) {
      // Debug helper: show some sample UIDs
      console.log('No match. First 10 UIDs in sheet:');
      const sample = values.slice(0, 10).map((row, i) => ({
        row: 7 + i,
        uid: row?.[0] ? String(row[0]).trim() : 'EMPTY',
      }));
      console.log(sample);

      return res.status(404).json({
        success: false,
        message: 'Row not found with this UID',
        searchedFor: trimmedUid,
        rowsChecked: values.length,
      });
    }

    const sheetRowNumber = 7 + rowIndex;
    console.log(`Match found → Updating row: ${sheetRowNumber}`);

    // Prepare updates – adjust column letters according to your actual sheet!
    // Example mapping (change these letters to match your Google Sheet columns):
    const updates = [
          { range: `VRN_INC_OFFICE_PAYMENT!Z${sheetRowNumber}`, values: [[STATUS_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AB${sheetRowNumber}`, values: [[TOTAL_PAID_AMOUNT_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AC${sheetRowNumber}`, values: [[BASIC_AMOUNT_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AD${sheetRowNumber}`, values: [[CGST_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AE${sheetRowNumber}`, values: [[SGST_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AF${sheetRowNumber}`, values: [[NET_AMOUNT_4 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AG${sheetRowNumber}`, values: [[PAYMENT_MODE_17 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AH${sheetRowNumber}`, values: [[BANK_DETAILS_17 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AI${sheetRowNumber}`, values: [[PAYMENT_DETAILS_17 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AJ${sheetRowNumber}`, values: [[PAYMENT_DATE_17 || '']] },
      { range: `VRN_INC_OFFICE_PAYMENT!AK${sheetRowNumber}`, values: [[Remark_Blank || '']] },
    ];

    // Only send non-empty updates (optional – but cleaner)
    const validUpdates = updates.filter(update => update.values[0][0] !== '');

    if (validUpdates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update',
      });
    }

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      resource: {
        valueInputOption: 'USER_ENTERED', // or 'RAW' depending on your needs
        data: validUpdates,
      },
    });

    console.log(`Update successful for row ${sheetRowNumber} — ${validUpdates.length} fields updated`);

    res.json({
      success: true,
      message: 'Payment data updated successfully',
      updatedRow: sheetRowNumber,
      updatedFields: validUpdates.map(u => u.range.split('!')[1]),
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating sheet',
      error: error.message,
      // stack: error.stack    // remove in production if you don't want to expose stack
    });
  }
});


module.exports = router;