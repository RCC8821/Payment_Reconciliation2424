// const express = require('express');
// const router = express.Router();
// const { sheets, OfficeExpenseID } = require('../config/googleSheet'); // path adjust karo

// // GET route
// router.get('/Get-Expenses-Entry', async (req, res) => {
//   try {
//     if (!OfficeExpenseID) {
//       return res.status(500).json({
//         success: false,
//         error: 'spreadsheetId is not configured',
//       });
//     }

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: OfficeExpenseID,
//       range: 'RCC_OFFICE_FMS!A8:AK',
//     });

//     let rows = response.data.values || [];

//     if (rows.length === 0) {
//       return res.json({
//         success: true,
//         message: 'No data found',
//         data: [],
//       });
//     }

//     const filteredData = rows
//       .filter((row) => row[35] && !row[36])
//       .map((row) => ({
//         OFFBILLUID: (row[1] || '').toString().trim(),
//         uid: (row[2] || '').toString().trim(),
//         OFFICE_NAME_1: (row[3] || '').toString().trim(),
//         PAYEE_NAME_1: (row[4] || '').toString().trim(),
//         EXPENSES_HEAD_1: (row[5] || '').toString().trim(),
//         EXPENSES_SUBHEAD_1: (row[6] || '').toString().trim(),
//         ITEM_NAME_1: (row[7] || '').toString().trim(),
//         UNIT_1: (row[8] || '').toString().trim(),
//         SKU_CODE_1: (row[9] || '').toString().trim(),
//         Qty_1: (row[10] || '').toString().trim(),
//         Amount: (row[24] || '').toString().trim(),
//         DEPARTMENT_1: (row[12] || '').toString().trim(),
//         APPROVAL_DOER: (row[13] || '').toString().trim(),
//         RAISED_BY_1: (row[14] || '').toString().trim(),
//         Bill_Photo: (row[15] || '').toString().trim(),
//         PAYMENT_MODE_3: (row[31] || '').toString().trim(),
//         REMARK_3: (row[32] || '').toString().trim(),
//         PLANNED_4: (row[35] || '').toString().trim(),
//         ACTUAL_4: (row[36] || '').toString().trim(),
//       }));

//     return res.json({
//       success: true,
//       totalRecords: filteredData.length,
//       data: filteredData,
//     });
//   } catch (error) {
//     console.error('Expenses Entry GET Error:', error.message);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch office expenses data',
//       details: error.message,
//     });
//   }
// });



// // POST route
// // router.post('/Post-Expenses-Entry', async (req, res) => {
// //   try {
// //     const {
// //       uid,
// //       STATUS_4,
// //       Vendor_Name_4,
// //       BILL_NO_4,
// //       BILL_DATE_4,
// //       BASIC_AMOUNT_4,
// //       CGST_4,
// //       SGST_4,
// //       IGST_4,
// //       TOTAL_AMOUNT_4,
// //       TRASNPORT_CHARGES_4,
// //       Transport_Gst_4,
// //       NET_AMOUNT_4,
// //       Remark_4,
// //     } = req.body;

// //     console.log('Received body:', req.body);

// //     if (!uid) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'uid (Bill No) is required',
// //       });
// //     }

// //     const trimmedBillNo = String(uid).trim();

// //     const response = await sheets.spreadsheets.values.get({
// //       spreadsheetId: OfficeExpenseID,
// //       range: 'RCC_OFFICE_FMS!B7:B',
// //     });

// //     const rows = response.data.values || [];

// //     if (rows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No data in sheet',
// //       });
// //     }

// //     // Sab matching rows collect karo
// //     const matchingRows = [];
// //     rows.forEach((row, index) => {
// //       if (row && row[0]) {
// //         const cellValue = String(row[0]).trim();
// //         if (cellValue === trimmedBillNo) {
// //           matchingRows.push({
// //             rowIndex: index,
// //             rowNumber: 7 + index,
// //           });
// //         }
// //       }
// //     });

// //     if (matchingRows.length === 0) {
// //       return res.status(404).json({
// //         success: false,
// //         message: 'No matching Bill No found',
// //         searchedFor: trimmedBillNo,
// //       });
// //     }

// //     // Last row
// //     const lastRow = matchingRows[matchingRows.length - 1];
// //     const lastRowNumber = lastRow.rowNumber;

// //     console.log(`Found ${matchingRows.length} matches → last row: ${lastRowNumber}`);

// //     const requests = [];

// //     // 1. SABHI matching rows mein STATUS_4 update kar do
// //     if (STATUS_4 !== undefined && STATUS_4 !== null && STATUS_4 !== '') {
// //       matchingRows.forEach(({ rowNumber }) => {
// //         requests.push({
// //           range: `RCC_OFFICE_FMS!AL${rowNumber}`,
// //           values: [[STATUS_4]],
// //         });
// //       });
// //     }

// //     // 2. Sirf LAST row mein baaki fields update kar do
// //     const addLastOnly = (colLetter, value) => {
// //       if (value !== undefined && value !== null && value !== '') {
// //         requests.push({
// //           range: `RCC_OFFICE_FMS!${colLetter}${lastRowNumber}`,
// //           values: [[value]],
// //         });
// //       }
// //     };

// //     addLastOnly('AN', Vendor_Name_4);
// //     addLastOnly('AO', BILL_NO_4);
// //     addLastOnly('AP', BILL_DATE_4);
// //     addLastOnly('AQ', BASIC_AMOUNT_4);
// //     addLastOnly('AR', CGST_4);
// //     addLastOnly('AS', SGST_4);
// //     addLastOnly('AT', IGST_4);
// //     addLastOnly('AU', TOTAL_AMOUNT_4);
// //     addLastOnly('AV', TRASNPORT_CHARGES_4);
// //     addLastOnly('AW', Transport_Gst_4);
// //     addLastOnly('AX', NET_AMOUNT_4);
// //     addLastOnly('AY', Remark_4);

// //     if (requests.length === 0) {
// //       return res.status(400).json({
// //         success: false,
// //         message: 'No fields to update',
// //       });
// //     }

// //     await sheets.spreadsheets.values.batchUpdate({
// //       spreadsheetId: OfficeExpenseID,
// //       resource: {
// //         valueInputOption: 'USER_ENTERED',
// //         data: requests,
// //       },
// //     });

// //     return res.json({
// //       success: true,
// //       message: 'Data updated: STATUS_4 sabhi rows mein, baaki sirf last row mein',
// //       updatedRows: matchingRows.length,
// //       lastRow: lastRowNumber,
// //       statusValueUsed: STATUS_4 || '(not provided)',
// //     });
// //   } catch (error) {
// //     console.error('Expenses Entry POST Error:', error);
// //     return res.status(500).json({
// //       success: false,
// //       message: 'Server error',
// //       error: error.message,
// //     });
// //   }
// // });




// router.post('/Post-Expenses-Entry', async (req, res) => {
//   try {
//     const {
//       uid,
//       STATUS_4,
//       Vendor_Name_4,
//       BILL_NO_4,
//       BILL_DATE_4,
//       BASIC_AMOUNT_4,
//       CGST_4,
//       SGST_4,
//       IGST_4,
//       TOTAL_AMOUNT_4,
//       TRASNPORT_CHARGES_4,
//       Transport_Gst_4,
//       NET_AMOUNT_4,
//       Remark_4,
//     } = req.body;

//     console.log('Received body:', req.body);

//     if (!uid) {
//       return res.status(400).json({
//         success: false,
//         message: 'uid is required',
//       });
//     }

//     const trimmedUid = String(uid).trim();

//     // ✅ अब B की जगह C column से uid match होगा
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: OfficeExpenseID,
//       range: 'RCC_OFFICE_FMS!C7:C',
//     });

//     const rows = response.data.values || [];

//     if (rows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No data in sheet',
//       });
//     }

//     // ✅ C column me uid search karo
//     const matchingRows = [];
//     rows.forEach((row, index) => {
//       if (row && row[0]) {
//         const cellValue = String(row[0]).trim();
//         if (cellValue === trimmedUid) {
//           matchingRows.push({
//             rowIndex: index,
//             rowNumber: 7 + index,
//           });
//         }
//       }
//     });

//     if (matchingRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'No matching uid found in C column',
//         searchedFor: trimmedUid,
//       });
//     }

//     // ✅ Agar C column me uid unique hai to same row update hogi
//     // Best practice: duplicate uid na ho
//     if (matchingRows.length > 1) {
//       return res.status(409).json({
//         success: false,
//         message: 'Duplicate uid found in C column. uid should be unique.',
//         searchedFor: trimmedUid,
//         matchingRows: matchingRows.map(r => r.rowNumber),
//       });
//     }

//     const targetRowNumber = matchingRows[0].rowNumber;

//     console.log(`Matched uid "${trimmedUid}" in C column at row ${targetRowNumber}`);

//     const requests = [];

//     const addToTarget = (colLetter, value) => {
//       if (value !== undefined && value !== null && value !== '') {
//         requests.push({
//           range: `RCC_OFFICE_FMS!${colLetter}${targetRowNumber}`,
//           values: [[value]],
//         });
//       }
//     };

//     // ✅ Sab data sirf matched row me jayega
//     addToTarget('AL', STATUS_4);
//     addToTarget('AN', Vendor_Name_4);
//     addToTarget('AO', BILL_NO_4);
//     addToTarget('AP', BILL_DATE_4);
//     addToTarget('AQ', BASIC_AMOUNT_4);
//     addToTarget('AR', CGST_4);
//     addToTarget('AS', SGST_4);
//     addToTarget('AT', IGST_4);
//     addToTarget('AU', TOTAL_AMOUNT_4);
//     addToTarget('AV', TRASNPORT_CHARGES_4);
//     addToTarget('AW', Transport_Gst_4);
//     addToTarget('AX', NET_AMOUNT_4);
//     addToTarget('AY', Remark_4);

//     if (requests.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: 'No fields to update',
//       });
//     }

//     await sheets.spreadsheets.values.batchUpdate({
//       spreadsheetId: OfficeExpenseID,
//       resource: {
//         valueInputOption: 'USER_ENTERED',
//         data: requests,
//       },
//     });

//     return res.json({
//       success: true,
//       message: `Data updated successfully on matched uid row`,
//       uid: trimmedUid,
//       updatedRow: targetRowNumber,
//     });

//   } catch (error) {
//     console.error('Expenses Entry POST Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error',
//       error: error.message,
//     });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const { sheets, OfficeExpenseID } = require('../config/googleSheet');

// GET route
router.get('/Get-Expenses-Entry', async (req, res) => {
  try {
    if (!OfficeExpenseID) {
      return res.status(500).json({
        success: false,
        error: 'spreadsheetId is not configured',
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: OfficeExpenseID,
      range: 'RCC_OFFICE_FMS!A8:AK',
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: 'No data found',
        data: [],
      });
    }

    const filteredData = rows
      .filter((row) => row[35] && !row[36])
      .map((row) => ({
        OFFBILLUID: (row[1] || '').toString().trim(),
        uid: (row[2] || '').toString().trim(),
        OFFICE_NAME_1: (row[3] || '').toString().trim(),
        PAYEE_NAME_1: (row[4] || '').toString().trim(),
        EXPENSES_HEAD_1: (row[5] || '').toString().trim(),
        EXPENSES_SUBHEAD_1: (row[6] || '').toString().trim(),
        ITEM_NAME_1: (row[7] || '').toString().trim(),
        UNIT_1: (row[8] || '').toString().trim(),
        SKU_CODE_1: (row[9] || '').toString().trim(),
        Qty_1: (row[10] || '').toString().trim(),
        Amount: (row[24] || '').toString().trim(),
        DEPARTMENT_1: (row[12] || '').toString().trim(),
        APPROVAL_DOER: (row[13] || '').toString().trim(),
        RAISED_BY_1: (row[14] || '').toString().trim(),
        Bill_Photo: (row[15] || '').toString().trim(),
        PAYMENT_MODE_3: (row[31] || '').toString().trim(),
        REMARK_3: (row[32] || '').toString().trim(),
        PLANNED_4: (row[35] || '').toString().trim(),
        ACTUAL_4: (row[36] || '').toString().trim(),
      }));

    return res.json({
      success: true,
      totalRecords: filteredData.length,
      data: filteredData,
    });
  } catch (error) {
    console.error('Expenses Entry GET Error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch office expenses data',
      details: error.message,
    });
  }
});


// POST route - ✅ C column ki uid se match karke data update karo
router.post('/Post-Expenses-Entry', async (req, res) => {
  try {
    const {
      uid,           // ← OFFBILLUID (bill group)
      STATUS_4,
      Vendor_Name_4,
      BILL_NO_4,
      BILL_DATE_4,
      TRASNPORT_CHARGES_4,
      Transport_Gst_4,
      NET_AMOUNT_4,
      Remark_4,
      items,         // ← Array of per-item data with itemUid
    } = req.body;

    console.log('Received body:', req.body);

    // ✅ Validation
    if (!uid) {
      return res.status(400).json({
        success: false,
        message: 'uid (OFFBILLUID) is required',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'items array is required',
      });
    }

    // ✅ Sheet से C column की सारी values लाओ
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: OfficeExpenseID,
      range: 'RCC_OFFICE_FMS!C7:C',
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data in sheet',
      });
    }

    // ✅ C column में हर uid का row number map बनाओ
    const uidToRowNumber = {};
    rows.forEach((row, index) => {
      if (row && row[0]) {
        const cellValue = String(row[0]).trim();
        // C column में unique uid है
        uidToRowNumber[cellValue] = 7 + index; // row 7 से start
      }
    });

    console.log('UID to Row Map:', uidToRowNumber);

    const requests = [];

    // ✅ हर item के लिए उसकी uid से row ढूंढो और data update करो
    const notFoundUids = [];

    items.forEach((item) => {
      const itemUid = String(item.itemUid || '').trim();

      if (!itemUid) return;

      const targetRowNumber = uidToRowNumber[itemUid];

      if (!targetRowNumber) {
        notFoundUids.push(itemUid);
        return;
      }

      console.log(`Item uid "${itemUid}" → Row ${targetRowNumber}`);

      const addToRow = (colLetter, value) => {
        if (value !== undefined && value !== null && value !== '') {
          requests.push({
            range: `RCC_OFFICE_FMS!${colLetter}${targetRowNumber}`,
            values: [[value]],
          });
        }
      };

      // ✅ STATUS - हर row में जाएगा
      addToRow('AL', STATUS_4);

      // ✅ Common fields - हर row में same जाएगा
      addToRow('AN', Vendor_Name_4);
      addToRow('AO', BILL_NO_4);
      addToRow('AP', BILL_DATE_4);

      // ✅ Per-item fields - हर row में अलग जाएगा
      addToRow('AQ', item.BASIC_AMOUNT_4);
      addToRow('AR', item.CGST_4);
      addToRow('AS', item.SGST_4);
      addToRow('AT', item.IGST_4);
      addToRow('AU', item.TOTAL_AMOUNT_4);

      // ✅ Transport & Net - हर row में same जाएगा
      addToRow('AV', TRASNPORT_CHARGES_4);
      addToRow('AW', Transport_Gst_4);
      addToRow('AX', NET_AMOUNT_4);
      addToRow('AY', Remark_4);
    });

    if (notFoundUids.length > 0) {
      console.warn('These uids not found in C column:', notFoundUids);
    }

    if (requests.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No matching rows found to update',
        notFoundUids,
      });
    }

    // ✅ Batch update
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: OfficeExpenseID,
      resource: {
        valueInputOption: 'USER_ENTERED',
        data: requests,
      },
    });

    return res.json({
      success: true,
      message: `Data updated successfully for ${items.length} items`,
      offBillUid: uid,
      updatedItems: items.length - notFoundUids.length,
      notFoundUids: notFoundUids.length > 0 ? notFoundUids : undefined,
    });

  } catch (error) {
    console.error('Expenses Entry POST Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
});

module.exports = router;