const express = require('express');
const { sheets, spreadsheetId } = require('../config/googleSheet');
const router = express.Router();

// GET - Dropdown Data
router.get('/Bank-Interest-Dropdown-Data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Project_Data!B2:B',
    });

    const rows = response.data.values || [];
    const accounts = rows
      .map(row => row[0]?.toString().trim())
      .filter(val => val);

    res.json({
      success: true,
      accounts
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

// POST - Add Bank Interest & Charges Data
router.post('/Bank-Interest-Add', async (req, res) => {
  try {
    const {
      bankPayment,
      chargesInterestDetails,
      bankName,
      amount,
      paymentMode,
      paymentDate,
      remark
    } = req.body;

    // Validation
    if (!bankPayment || !chargesInterestDetails || !bankName || !amount || !paymentMode || !paymentDate) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: bankPayment, chargesInterestDetails, bankName, amount, paymentMode, paymentDate'
      });
    }

    // Fetch existing data to check duplicates and generate UID/PaymentDetails
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Bank_Intrest_&_Charges!A2:J',
    });

    const rows = existingData.data.values || [];

    // Generate new UID (Column B - index 1)
    let maxUID = 0;
    rows.forEach(row => {
      const uid = row[1]?.toString().trim();
      if (uid) {
        const num = parseInt(uid, 10);
        if (!isNaN(num) && num > maxUID) {
          maxUID = num;
        }
      }
    });
    const newUID = String(maxUID + 1).padStart(4, '0');

    // Check if UID already exists (safety check)
    const uidExists = rows.some(row => row[1]?.toString().trim() === newUID);
    if (uidExists) {
      return res.status(400).json({
        success: false,
        message: `UID ${newUID} already exists in sheet`
      });
    }

    // Generate new PAYMENT_DETAILS (Column H - index 7)
    let maxPaymentNum = 0;
    rows.forEach(row => {
      const paymentDetails = row[7]?.toString().trim();
      if (paymentDetails && paymentDetails.startsWith('IC')) {
        const num = parseInt(paymentDetails.replace('IC', ''), 10);
        if (!isNaN(num) && num > maxPaymentNum) {
          maxPaymentNum = num;
        }
      }
    });
    const newPaymentDetails = 'IC' + String(maxPaymentNum + 1).padStart(4, '0');

    // Check if PAYMENT_DETAILS already exists (safety check)
    const paymentDetailsExists = rows.some(row => row[7]?.toString().trim() === newPaymentDetails);
    if (paymentDetailsExists) {
      return res.status(400).json({
        success: false,
        message: `PAYMENT_DETAILS ${newPaymentDetails} already exists in sheet`
      });
    }

    // Generate India Timestamp (DD/MM/YYYY HH:MM:SS)
    const indiaTime = new Date().toLocaleString('en-GB', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(',', '');

    // Prepare row data (A to J columns)
    // A: Timestamp, B: UID, C: Bank_Payment, D: Charges_&_Interest_Details, 
    // E: Bank_Name, F: Amount, G: PAYMENT_MODE, H: PAYMENT_DETAILS, I: PAYMENT_DATE, J: Remark
    const newRow = [
      indiaTime,              // A - Timestamp
      newUID,                 // B - UID
      bankPayment,            // C - Bank_Payment
      chargesInterestDetails, // D - Charges_&_Interest_Details
      bankName,               // E - Bank_Name
      amount,                 // F - Amount
      paymentMode,            // G - PAYMENT_MODE
      newPaymentDetails,      // H - PAYMENT_DETAILS (auto-generated)
      paymentDate,            // I - PAYMENT_DATE
      remark || ''            // J - Remark
    ];

    // Append data to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Bank_Intrest_&_Charges!A2:J',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [newRow]
      }
    });

    res.status(201).json({
      success: true,
      message: 'Data added successfully',
      data: {
        timestamp: indiaTime,
        uid: newUID,
        bankPayment,
        chargesInterestDetails,
        bankName,
        amount,
        paymentMode,
        paymentDetails: newPaymentDetails,
        paymentDate,
        remark: remark || ''
      }
    });

  } catch (error) {
    console.error('Error adding bank interest data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add data',
      error: error.message
    });
  }
});

module.exports = router;