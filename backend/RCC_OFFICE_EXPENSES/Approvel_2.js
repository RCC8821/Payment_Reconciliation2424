const express = require('express');
const router = express.Router();
const { sheets, OfficeExpenseID } = require('../config/googleSheet');

// GET route (same as before)
router.get('/Get-Approvel-2', async (req, res) => {
  try {
    if (!OfficeExpenseID) {
      return res.status(500).json({
        success: false,
        error: "spreadsheetId is not configured",
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: OfficeExpenseID,
      range: "RCC_OFFICE_FMS!A7:AC",
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: "No data found",
        data: [],
      });
    }

    const filteredData = rows
      .filter((row) => row[27] && !row[28])
      .map((row) => ({
        OFFBILLUID: (row[1] || "").toString().trim(),
        uid: (row[2] || "").toString().trim(),
        OFFICE_NAME_1: (row[3] || "").toString().trim(),
        PAYEE_NAME_1: (row[4] || "").toString().trim(),
        EXPENSES_HEAD_1: (row[5] || "").toString().trim(),
        EXPENSES_SUBHEAD_1: (row[6] || "").toString().trim(),
        ITEM_NAME_1: (row[7] || "").toString().trim(),
        UNIT_1: (row[8] || "").toString().trim(),
        SKU_CODE_1: (row[9] || "").toString().trim(),
        Qty_1: (row[10] || "").toString().trim(),
        Amount: (row[11] || "").toString().trim(),
        DEPARTMENT_1: (row[12] || "").toString().trim(),
        APPROVAL_DOER: (row[13] || "").toString().trim(),
        RAISED_BY_1: (row[14] || "").toString().trim(),
        Bill_Photo: (row[15] || "").toString().trim(),
        REMARK_1: (row[16] || "").toString().trim(),
        PLANNED_2: (row[27] || "").toString().trim(),
        ACTUAL_2: (row[28] || "").toString().trim(),
      }));

    return res.json({
      success: true,
      totalRecords: filteredData.length,
      data: filteredData,
    });
  } catch (error) {
    console.error("DIM Approve2 GET Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch office expenses data",
      details: error.message,
    });
  }
});

// ✅ UPDATED POST route - OFFBILLUID ke sabhi matching rows update karega
router.post('/Post-Approvel-2', async (req, res) => {
  try {
    const { OFFBILLUID, STATUS_2, PAYMENT_MODE_3, REMARK_2 } = req.body;

    console.log("Received update body:", req.body);

    // Validation - OFFBILLUID required hai
    if (!OFFBILLUID) {
      return res.status(400).json({
        success: false,
        message: "OFFBILLUID is required",
      });
    }

    const trimmedOFFBILLUID = OFFBILLUID.toString().trim();

    // Column B (index 1) me OFFBILLUID search karo
    const findResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: OfficeExpenseID,
      range: "RCC_OFFICE_FMS!B7:B", // Column B me OFFBILLUID hai
    });

    const values = findResponse.data.values || [];

    // Sabhi matching rows ke indexes find karo
    const matchingRowIndexes = [];
    values.forEach((row, index) => {
      if (row.length > 0) {
        const sheetValue = row[0] ? row[0].toString().trim() : "";
        if (sheetValue === trimmedOFFBILLUID) {
          matchingRowIndexes.push(index);
        }
      }
    });

    // Agar koi row nahi mili
    if (matchingRowIndexes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No rows found with this OFFBILLUID",
        searchedFor: OFFBILLUID,
      });
    }

    console.log(`Found ${matchingRowIndexes.length} rows with OFFBILLUID: ${trimmedOFFBILLUID}`);

    // Batch update ke liye data prepare karo
    const updateData = [];

    matchingRowIndexes.forEach((rowIndex) => {
      const sheetRowNumber = 7 + rowIndex; // Row 7 se start hai

      // STATUS_2 -> Column AB (index 27)
      updateData.push({
        range: `RCC_OFFICE_FMS!AD${sheetRowNumber}`,
        values: [[STATUS_2 || ""]],
      });

      // PAYMENT_MODE_3 -> Column AF (index 31)
      updateData.push({
        range: `RCC_OFFICE_FMS!AF${sheetRowNumber}`,
        values: [[PAYMENT_MODE_3 || ""]],
      });

      // REMARK_2 -> Column AH (index 33)
      updateData.push({
        range: `RCC_OFFICE_FMS!AH${sheetRowNumber}`,
        values: [[REMARK_2 || ""]],
      });
    });

    // Ek hi batch call me sabhi rows update karo
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: OfficeExpenseID,
      resource: {
        valueInputOption: "USER_ENTERED",
        data: updateData,
      },
    });

    return res.json({
      success: true,
      message: `Data updated successfully in ${matchingRowIndexes.length} row(s)`,
      updatedRows: matchingRowIndexes.length,
      OFFBILLUID: trimmedOFFBILLUID,
    });

  } catch (error) {
    console.error("DIM Approve2 POST Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;