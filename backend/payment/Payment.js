
const express = require('express');
const { sheets, spreadsheetId } = require('../config/googleSheet');
const router = express.Router();

router.get('/payment-Reconsilation', async (req, res) => {
  try {
    // Fetch columns A to L starting from row 7 (A7:L)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'FMS!A7:M',
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

  
    const filteredData = rows
     .filter(row => row[11] && !row[12])
      .map(row => ({
        timestamp: (row[0] || '').toString().trim(),
        uid: (row[1] || '').toString().trim(),
        contractorName: (row[2] || '').toString().trim(),
        paidAmount: (row[3] || '').toString().trim(),
        bankDetails: (row[4] || '').toString().trim(),
        paymentMode: (row[5] || '').toString().trim(),
        paymentDetails: (row[6] || '').toString().trim(),
        paymentDate: (row[7] || '').toString().trim(),
        ExpHead: (row[8] || '').toString().trim(),
        planned2: (row[11] || '').toString().trim(),
        actual2: (row[12] || '').toString().trim(),
      }));

    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('GET /payment-Reconsilation:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
});

router.get('/bank-balance/:bankName', async (req, res) => {
  try {
    const { bankName } = req.params;
    console.log('Requested Bank:', bankName);

    // Sheet name ko single quotes mein wrap karo (safe way)
    const range = `'${bankName}'!F3`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const bankClosingBalance = response.data.values?.[0]?.[0] || 'Not Found';

    console.log('Fetched Range:', range);
    console.log('F3 Value:', bankClosingBalance);

    // Hamesha success: true bhejo agar koi error nahi hai
    res.status(200).json({
      success: true,
      bankName: bankName,
      bankClosingBalance: bankClosingBalance.toString().trim(),
    });
  } catch (error) {
    console.error('Bank balance API error:', error.message);
    // Agar error hai tabhi success: false bhejo
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank balance',
      error: error.message,
    });
  }
});








router.post('/update-reconciliation', async (req, res) => {
  console.log('Received body:', req.body);

  try {
    const { paymentDetails, bankClosingBalanceAfterPayment, status, remark } = req.body;

    if (!paymentDetails?.trim()) {
      return res.status(400).json({ success: false, message: 'Payment Details is required' });
    }

    const trimmedInput = paymentDetails.trim().toLowerCase();

    // Get data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'FMS!A7:Q',  // thoda zyada range le lo safety ke liye
    });

    const rows = response.data.values || [];

    const rowIndex = rows.findIndex(row => {
      const sheetValue = row[6]?.toString().trim().toLowerCase() || '';
      return sheetValue === trimmedInput;
    });

    if (rowIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment Details not found in column G (index 6)',
        searched: trimmedInput 
      });
    }

    const sheetRowNumber = 7 + rowIndex;
    console.log(`Found row: ${sheetRowNumber} (0-based index ${rowIndex})`);

    // Very clear single update - batch ki jagah simple update try karte hain pehle
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `FMS!P${sheetRowNumber}`,
      valueInputOption: 'RAW',
      resource: {
        values: [[bankClosingBalanceAfterPayment || '']]
      }
    });

    // Optional: status aur remark bhi update (agar chahiye to uncomment kar dena)
   
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `FMS!N${sheetRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[status || '']] }
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `FMS!Q${sheetRowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [[remark || '']] }
    });
    

    console.log(`Updated P${sheetRowNumber} with value: ${bankClosingBalanceAfterPayment}`);

    // Browser mein check karne ke liye thoda wait (real mein nahi chahiye)
    // await new Promise(r => setTimeout(r, 1500));

    res.json({ 
      success: true, 
      message: `Updated row ${sheetRowNumber} in FMS sheet`,
      row: sheetRowNumber,
      updatedColumnP: bankClosingBalanceAfterPayment
    });

  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Update failed', 
      error: error.message,
      stack: error.stack?.substring(0, 300)  // thoda clue milega
    });
  }
});





module.exports = router;