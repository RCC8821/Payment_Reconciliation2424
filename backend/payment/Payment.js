

const express = require('express');
const { sheets, spreadsheetId,SPREADSHEET_Bank_ID } = require('../config/googleSheet');
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
      spreadsheetId:SPREADSHEET_Bank_ID,
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

// ── POST: Save to "Actual Out" sheet ─────────────────────────────────────
router.post('/update-reconciliation', async (req, res) => {
  console.log('═══════════════════════════════════');
  console.log('📥 Received body:', JSON.stringify(req.body, null, 2));
  console.log('═══════════════════════════════════');

  try {
    const {
      paymentDetails,                 // D column
      bankDetails,                    // C column
      bankClosingBalanceAfterPayment, // F column
      status,                         // E column
      remark,                         // G column
      firmName,                       // B column (contractorName)
    } = req.body;

    // ── Validation ──────────────────────────────────────────────────────
    if (!paymentDetails?.trim() || !bankDetails?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'paymentDetails and bankDetails are required',
      });
    }

    // ── Generate Timestamp ───────────────────────────────────────────────
    const now       = new Date();
    const dd        = String(now.getDate()).padStart(2, '0');
    const mm        = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy      = now.getFullYear();
    const hh        = String(now.getHours()).padStart(2, '0');
    const min       = String(now.getMinutes()).padStart(2, '0');
    const ss        = String(now.getSeconds()).padStart(2, '0');
    const timeStamp = `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;

    console.log('⏰ TimeStamp:', timeStamp);
    console.log('🏢 firmName:', firmName);

    // ── Find Next Empty Row in "Actual Out" from A5 ──────────────────────
    const actualOutResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Actual Out!A5:G',
    });

    const existingRows  = actualOutResponse.data.values || [];
    const nextRowNumber = 5 + existingRows.length;

    console.log('📍 Writing to Actual Out row:', nextRowNumber);

    // ── Row Data (A to G) ────────────────────────────────────────────────
    // A = TimeStamp  (backend generated)
    // B = Firm Name  (contractorName from frontend)
    // C = Bank Detail
    // D = Payment Detail
    // E = Status
    // F = Bank Closing Balance After Payment
    // G = Remark
    const rowData = [
      timeStamp,
      (firmName                       || '').toString().trim(), // B
      (bankDetails                    || '').toString().trim(), // C
      (paymentDetails                 || '').toString().trim(), // D
      (status                         || '').toString().trim(), // E
      (bankClosingBalanceAfterPayment  || '').toString().trim(), // F
      (remark                         || '').toString().trim(), // G
    ];

    console.log('📝 Row data:', rowData);

    // ── Write to Sheet ───────────────────────────────────────────────────
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range:            `Actual Out!A${nextRowNumber}:G${nextRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource:         { values: [rowData] },
    });

    console.log('✅ Actual Out sheet updated at row:', nextRowNumber);

    res.json({
      success: true,
      message: `Saved to Actual Out sheet at row ${nextRowNumber}`,
      row:     nextRowNumber,
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
    console.error('❌ POST /update-reconciliation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save data',
      error:   error.message,
    });
  }
});


module.exports = router;