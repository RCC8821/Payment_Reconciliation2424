const express = require('express');
const { sheets, SPREADSHEET_ID_OFFICE_EXPENSES } = require('../config/googleSheet');
const router = express.Router();


router.get('/GET-Office-Expenses-Data-Approved2', async (req, res) => {
  try {
    if (!SPREADSHEET_ID_OFFICE_EXPENSES) {
      return res.status(500).json({
        success: false,
        error: 'SPREADSHEET_ID_OFFICE_EXPENSES is not configured',
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'RCC_OFFICE_PAYMANT!A7:R',   // Adjust if your data starts from different row/column
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, message: 'No data found', data: [] });
    }

    // Mapping only the columns you asked for
    // Column index starts from 0 → A=0, B=1, C=2, ...
    const filteredData = rows
    .filter(row => row[16] && !row[17])
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
      PLANNED_3   : (row[16] || '').toString().trim(),   // K (most common position for amount)
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


// router.post('/update-RCC-OFFICE-Expenses-Data-Approved2', async (req, res) => {
//   console.log('Received body:', req.body); // Debug

//   try {
//     const { uid, STATUS_3, FINAL_AMOUNT_3,PAYMENT_MODE_3, REMARK_3 } = req.body;

//     if (!uid) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'UID is required' 
//       });
//     }

//     const trimmedUid = uid.toString().trim();

//     // FIX 1: Yahan SPREADSHEET_ID_OFFICE_EXPENSES use karo
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
//       range: 'RCC_OFFICE_PAYMANT!B7:B',
//     });

//     const values = response.data.values || [];

//     const rowIndex = values.findIndex(row => {
//       if (row.length === 0) return false;
//       const sheetValue = row[0] ? row[0].toString().trim() : '';
//       return sheetValue === trimmedUid;
//     });

//     if (rowIndex === -1) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Row not found with this UID',
//         searchedFor: uid 
//       });
//     }

//     const sheetRowNumber = 7 + rowIndex;

//     // FIX 2: Yahan bhi SPREADSHEET_ID_OFFICE_EXPENSES
//     await sheets.spreadsheets.values.batchUpdate({
//       spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
//       resource: {
//         valueInputOption: 'USER_ENTERED',
//         data: [
//           { range: `RCC_OFFICE_PAYMANT!S${sheetRowNumber}`, values: [[STATUS_3 || '']] },
//           { range: `RCC_OFFICE_PAYMANT!U${sheetRowNumber}`, values: [[FINAL_AMOUNT_3 || '']] },
//           { range: `RCC_OFFICE_PAYMANT!V${sheetRowNumber}`, values: [[PAYMENT_MODE_3 || '']] },
//           { range: `RCC_OFFICE_PAYMANT!W${sheetRowNumber}`, values: [[REMARK_3 || '']] },
         
//         ]
//       }
//     });

//     res.json({ 
//       success: true, 
//       message: 'Data updated successfully'
//     });
//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Server error', 
//       error: error.message 
//     });
//   }
// });



router.post('/update-RCC-OFFICE-Expenses-Data-Approved2', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { uid, STATUS_3, FINAL_AMOUNT_3, PAYMENT_MODE_3, REMARK_3 } = req.body;

    if (!uid) {
      return res.status(400).json({ 
        success: false, 
        message: 'UID is required' 
      });
    }

    const trimmedUid = String(uid).trim();
    console.log('Trimmed UID being searched:', trimmedUid);

    // Get column B values (Bill No) from row 7 downwards
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      range: 'RCC_OFFICE_PAYMANT!B7:B',  // Increased range - adjust if needed
    });

    const values = getResponse.data.values || [];
    console.log(`Total rows found in column B: ${values.length}`);

    // Find row index where UID matches
    const rowIndex = values.findIndex((row) => {
      const cell = row && row[0] ? String(row[0]).trim() : '';
      return cell === trimmedUid;
    });

    if (rowIndex === -1) {
      // Debug: show first 10 UIDs to compare
      console.log('No match found. First 10 UIDs in sheet:');
      const sampleUids = values.slice(0, 10).map((row, i) => ({
        row: 7 + i,
        uid: row && row[0] ? String(row[0]).trim() : 'EMPTY'
      }));
      console.log(sampleUids);

      return res.status(404).json({ 
        success: false, 
        message: 'Row not found with this UID',
        searchedFor: trimmedUid,
        rowsChecked: values.length
      });
    }

    const sheetRowNumber = 7 + rowIndex;
    console.log(`Match found → Updating row: ${sheetRowNumber}`);

    // Update the columns
    // Adjust column letters if different in your sheet!
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID_OFFICE_EXPENSES,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: [
          { range: `RCC_OFFICE_PAYMANT!S${sheetRowNumber}`, values: [[STATUS_3 || '']] },
          { range: `RCC_OFFICE_PAYMANT!V${sheetRowNumber}`, values: [[PAYMENT_MODE_3 || '']] },
          { range: `RCC_OFFICE_PAYMANT!U${sheetRowNumber}`, values: [[FINAL_AMOUNT_3 !== null && FINAL_AMOUNT_3 !== '' ? FINAL_AMOUNT_3 : '']] },
          { range: `RCC_OFFICE_PAYMANT!W${sheetRowNumber}`, values: [[REMARK_3 || '']] },
        ]
      }
    });

    console.log(`Update successful for row ${sheetRowNumber}`);

    res.json({ 
      success: true, 
      message: 'Data updated successfully',
      updatedRow: sheetRowNumber
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating sheet',
      error: error.message,
      stack: error.stack 
    });
  }
});


module.exports = router;