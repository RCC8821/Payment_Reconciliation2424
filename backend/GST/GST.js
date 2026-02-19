const express = require("express");
const { sheets, SPREADSHEET_GST_SHEET_ID } = require("../config/googleSheet");

const router = express.Router();


router.get('/Gst-Data', async (req, res) => {
  try {
    // Safety check
    if (!SPREADSHEET_GST_SHEET_ID) {
      return res.status(500).json({
        success: false,
        error: 'SPREADSHEET_GST_SHEET_ID is not configured'
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: 'GST_Input!A2:V',          // ← change 'Sheet1' to your actual tab name if different
      valueRenderOption: 'FORMATTED_VALUE'
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        totalRecords: 0,
        data: []
      });
    }

    const data = rows
//    .filter(row => row[11] && !row[12])   
      .map(row => ({
        UID:                   (row[0]  || '').trim(),
        Project_Name_1:        (row[1]  || '').trim(),
        Contractor_Vendor_Name_1: (row[2]  || '').trim(),
        Bill_Date_1:           (row[3]  || '').trim(),
        Bill_Number_1:         (row[4]  || '').trim(),
        Exp_Head_1:            (row[5]  || '').trim(),
        Total_Bill_Amount_1:   (row[6]  || '').trim(),
        CGST_1:                (row[7]  || '').trim(),
        SGST_1:                (row[8]  || '').trim(),
        IGST_1:                (row[9]  || '').trim(),
        Transport_Charges_1:   (row[10] || '').trim(),
        Transport_Gst_Amount_1:(row[11] || '').trim(),
        NET_Amount:            (row[12] || '').trim(),
        Total_GST_Amount_1:    (row[13] || '').trim(),
        GST_Filling_Period:  (row[14] || '').trim(),
        IN_Out_Head_1:            (row[15] || '').trim(),
        Status_1:            (row[21] || '').trim()
      }));

    res.json({
      success: true,
      totalRecords: data.length,
      data
    });

  } catch (error) {
    console.error('Error in /Gst-Data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch GST data'
    });
  }
});




router.post('/Gst-Followup-Update', async (req, res) => {
  try {
    const { uid, status, remark } = req.body;

    if (!uid || typeof uid !== 'string' || uid.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'uid is required (column A value)'
      });
    }

    if (!status || typeof status !== 'string' || status.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'status is required'
      });
    }

    const newRemark = (remark || '').trim();

    if (!SPREADSHEET_GST_SHEET_ID) {
      return res.status(500).json({
        success: false,
        error: 'SPREADSHEET_GST_SHEET_ID is not configured'
      });
    }

    // Read enough rows to find UID (A2:X5000 — adjust if more rows needed)
    const readRange = 'GST_Input!A2:X';

    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: readRange,
      valueRenderOption: 'FORMATTED_VALUE'
    });

    const rows = readRes.data.values || [];

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No data found in sheet'
      });
    }

    // Find row where column A (index 0) matches UID
    const rowIndex = rows.findIndex(row => 
      row[0] && row[0].toString().trim() === uid.trim()
    );

    if (rowIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `UID not found: ${uid}`
      });
    }

    // Actual sheet row number (A2 = row 2)
    const sheetRowNumber = rowIndex + 2;

    // Current followup count (column W = index 22)
    let currentCount = parseInt(rows[rowIndex][22] || '0', 10);
    if (isNaN(currentCount)) currentCount = 0;

    // New count = current + 1
    const newFollowupCount = currentCount + 1;

    // Timestamp in your format: DD/MM/YYYY HH:MM:SS
    const now = new Date();
    const day    = String(now.getDate()).padStart(2, '0');
    const month  = String(now.getMonth() + 1).padStart(2, '0');
    const year   = now.getFullYear();
    const hours   = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timestampStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

    // Values for columns U:V:W:X
    const updateValues = [
      [
        timestampStr,               // U - Timestamp_2
        status.trim(),              // V - Status_2
        newFollowupCount.toString(),// W - Followup_Count_2
        newRemark                   // X - Remark_2
      ]
    ];

    const updateRange = `GST_Input!U${sheetRowNumber}:X${sheetRowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: updateRange,
      valueInputOption: 'USER_ENTERED',
      resource: { values: updateValues }
    });

    res.json({
      success: true,
      message: 'Follow-up updated successfully',
      row: sheetRowNumber,
      data: {
        uid: uid.trim(),
        timestamp: timestampStr,
        status: status.trim(),
        followup_count: newFollowupCount,
        remark: newRemark
      }
    });

  } catch (error) {
    console.error('Error updating follow-up:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update follow-up',
      details: error.message || 'Unknown error'
    });
  }
});



module.exports=router