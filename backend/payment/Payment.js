
// const express = require('express');
// const { sheets, spreadsheetId } = require('../config/googleSheet');
// const router = express.Router();

// router.get('/payment-Reconsilation', async (req, res) => {
//   try {
//     // Fetch columns A to L starting from row 7 (A7:L)
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: 'FMS!A7:M',
//     });

//     let rows = response.data.values || [];

//     if (rows.length === 0) {
//       return res.json({ success: true, data: [] });
//     }

  
//     const filteredData = rows
//      .filter(row => row[11] && !row[12])
//       .map(row => ({
//         timestamp: (row[0] || '').toString().trim(),
//         uid: (row[1] || '').toString().trim(),
//         contractorName: (row[2] || '').toString().trim(),
//         paidAmount: (row[3] || '').toString().trim(),
//         bankDetails: (row[4] || '').toString().trim(),
//         paymentMode: (row[5] || '').toString().trim(),
//         paymentDetails: (row[6] || '').toString().trim(),
//         paymentDate: (row[7] || '').toString().trim(),
//         ExpHead: (row[8] || '').toString().trim(),
//         planned2: (row[11] || '').toString().trim(),
//         actual2: (row[12] || '').toString().trim(),
//       }));

//     res.json({ success: true, data: filteredData });
//   } catch (error) {
//     console.error('GET /payment-Reconsilation:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch data' });
//   }
// });

// router.get('/bank-balance/:bankName', async (req, res) => {
//   try {
//     const { bankName } = req.params;
//     console.log('Requested Bank:', bankName);

//     // Sheet name ko single quotes mein wrap karo (safe way)
//     const range = `'${bankName}'!F3`;

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//     });

//     const bankClosingBalance = response.data.values?.[0]?.[0] || 'Not Found';

//     console.log('Fetched Range:', range);
//     console.log('F3 Value:', bankClosingBalance);

//     // Hamesha success: true bhejo agar koi error nahi hai
//     res.status(200).json({
//       success: true,
//       bankName: bankName,
//       bankClosingBalance: bankClosingBalance.toString().trim(),
//     });
//   } catch (error) {
//     console.error('Bank balance API error:', error.message);
//     // Agar error hai tabhi success: false bhejo
//     res.status(500).json({
//       success: false,
//       message: 'Failed to fetch bank balance',
//       error: error.message,
//     });
//   }
// });





// router.post('/update-reconciliation', async (req, res) => {
//   console.log('Received body:', req.body);

//   try {
//     const {
//       paymentDetails,
//       bankDetails,                      // ← नया field
//       bankClosingBalanceAfterPayment,
//       status,
//       remark
//     } = req.body;

//     if (!paymentDetails?.trim() || !bankDetails?.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: 'Both Payment Details and Bank Details are required'
//       });
//     }

//     const trimmedPayment = paymentDetails.trim().toLowerCase();
//     const trimmedBank    = bankDetails.trim().toLowerCase();

//     // Google Sheet से data लाओ
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range: 'FMS!A7:Q',   // या जितना ज़रूरी हो
//     });

//     const rows = response.data.values || [];

//     // दोनों conditions match करने वाली row ढूंढो
//     const rowIndex = rows.findIndex(row => {
//       const sheetPayment = (row[6] || '').toString().trim().toLowerCase();  // column G → index 6
//       const sheetBank    = (row[4] || '').toString().trim().toLowerCase();  // column E → index 4 (Bank name वाला column)

//       return sheetPayment === trimmedPayment && sheetBank === trimmedBank;
//     });

//     if (rowIndex === -1) {
//       return res.status(404).json({
//         success: false,
//         message: 'No matching row found with both Payment Details and Bank Details',
//         searchedPayment: trimmedPayment,
//         searchedBank: trimmedBank
//       });
//     }

//     const sheetRowNumber = 7 + rowIndex;  // A7 से शुरू है
//     console.log(`Matched row: ${sheetRowNumber} (0-based index ${rowIndex})`);

//     // अब update करो (एक-एक करके safe तरीके से)

//     // Column P → Bank Closing Balance After Payment
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `FMS!P${sheetRowNumber}`,
//       valueInputOption: 'RAW',
//       resource: { values: [[bankClosingBalanceAfterPayment || '']] }
//     });

//     // Column N → Status
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `FMS!N${sheetRowNumber}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: { values: [[status || '']] }
//     });

//     // Column Q → Remark
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: `FMS!Q${sheetRowNumber}`,
//       valueInputOption: 'USER_ENTERED',
//       resource: { values: [[remark || '']] }
//     });

//     res.json({
//       success: true,
//       message: `Row ${sheetRowNumber} updated successfully`,
//       row: sheetRowNumber,
//       updatedFields: {
//         P: bankClosingBalanceAfterPayment,
//         N: status,
//         Q: remark
//       }
//     });

//   } catch (error) {
//     console.error('Update error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Update failed',
//       error: error.message
//     });
//   }
// });



// module.exports = router;








const express = require('express');
const { sheets, spreadsheetId } = require('../config/googleSheet');
const router = express.Router();

// ── GET: Reconciliation data ──────────────────────────────────────────────
router.get('/payment-Reconsilation', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'FMS!A7:M',
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const filteredData = rows
      .filter(row => row[11] && !row[12])
      .map(row => ({
        timestamp:      (row[0]  || '').toString().trim(),
        uid:            (row[1]  || '').toString().trim(),
        contractorName: (row[2]  || '').toString().trim(),
        paidAmount:     (row[3]  || '').toString().trim(),
        bankDetails:    (row[4]  || '').toString().trim(),
        paymentMode:    (row[5]  || '').toString().trim(),
        paymentDetails: (row[6]  || '').toString().trim(),
        paymentDate:    (row[7]  || '').toString().trim(),
        ExpHead:        (row[8]  || '').toString().trim(),
        planned2:       (row[11] || '').toString().trim(),
        actual2:        (row[12] || '').toString().trim(),
      }));

    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('GET /payment-Reconsilation error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});

// ── GET: Bank closing balance ─────────────────────────────────────────────
router.get('/bank-balance/:bankName', async (req, res) => {
  try {
    const { bankName } = req.params;
    console.log('Requested Bank:', bankName);

    const range    = `'${bankName}'!F3`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const bankClosingBalance = response.data.values?.[0]?.[0] || 'Not Found';
    console.log('F3 Value:', bankClosingBalance);

    res.status(200).json({
      success:            true,
      bankName:           bankName,
      bankClosingBalance: bankClosingBalance.toString().trim(),
    });
  } catch (error) {
    console.error('Bank balance API error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank balance',
      error:   error.message,
    });
  }
});

// ── POST: Save to "Actual Out" sheet only ────────────────────────────────
router.post('/update-reconciliation', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const {
      paymentDetails,
      bankDetails,
      bankClosingBalanceAfterPayment,
      status,
      remark,
      firmName,
    } = req.body;

    if (!paymentDetails?.trim() || !bankDetails?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'paymentDetails and bankDetails are required',
      });
    }

    // ── Generate timestamp in backend ──
    const now   = new Date();
    const dd    = String(now.getDate()).padStart(2, '0');
    const mm    = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy  = now.getFullYear();
    const hh    = String(now.getHours()).padStart(2, '0');
    const min   = String(now.getMinutes()).padStart(2, '0');
    const ss    = String(now.getSeconds()).padStart(2, '0');
    const timeStamp = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

    console.log('TimeStamp:', timeStamp);
    console.log('firmName:', firmName);

    // ── Find next empty row in "Actual Out" starting from A5 ──
    const actualOutResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Actual Out!A5:G',
    });

    const existingRows  = actualOutResponse.data.values || [];
    const nextRowNumber = 5 + existingRows.length;

    console.log('Writing to Actual Out row:', nextRowNumber);

    // ── Row data ──
    // A = TimeStamp  (backend generated)
    // B = Firm Name  (contractorName from frontend)
    // C = Bank Detail
    // D = Payment Detail
    // E = Status
    // F = Bank Closing Balance
    // G = Remark
    const rowData = [
      timeStamp,
      (firmName                      || '').toString().trim(),
      (bankDetails                   || '').toString().trim(),
      (paymentDetails                || '').toString().trim(),
      (status                        || '').toString().trim(),
      (bankClosingBalanceAfterPayment|| '').toString().trim(),
      (remark                        || '').toString().trim(),
    ];

    console.log('Row data:', rowData);

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:            `Actual Out!A${nextRowNumber}:G${nextRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource:         { values: [rowData] },
    });

    console.log('Actual Out sheet updated at row:', nextRowNumber);

    res.json({
      success:    true,
      message:    `Saved to Actual Out sheet at row ${nextRowNumber}`,
      row:        nextRowNumber,
      savedData: {
        A_TimeStamp:          timeStamp,
        B_FirmName:           firmName,
        C_BankDetail:         bankDetails,
        D_PaymentDetail:      paymentDetails,
        E_Status:             status,
        F_BankClosingBalance: bankClosingBalanceAfterPayment,
        G_Remark:             remark,
      },
    });

  } catch (error) {
    console.error('POST /update-reconciliation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data',
      error:   error.message,
    });
  }
});

module.exports = router;