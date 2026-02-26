const express = require("express");
const { sheets, SPREADSHEET_GST_SHEET_ID } = require("../config/googleSheet");

const router = express.Router();

router.get("/Gst-Data", async (req, res) => {
  try {
    // Safety check
    if (!SPREADSHEET_GST_SHEET_ID) {
      return res.status(500).json({
        success: false,
        error: "SPREADSHEET_GST_SHEET_ID is not configured",
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: "GST_Input!A2:Y", // ← change 'Sheet1' to your actual tab name if different
      valueRenderOption: "FORMATTED_VALUE",
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        totalRecords: 0,
        data: [],
      });
    }

    const data = rows
      //    .filter(row => row[11] && !row[12])
      .map((row) => ({
        UID: (row[0] || "").trim(),
        Project_Name_1: (row[1] || "").trim(),
        Contractor_Vendor_Name_1: (row[2] || "").trim(),
        Bill_Date_1: (row[3] || "").trim(),
        Bill_Number_1: (row[4] || "").trim(),
        Exp_Head_1: (row[5] || "").trim(),
        Total_Bill_Amount_1: (row[6] || "").trim(),
        CGST_1: (row[7] || "").trim(),
        SGST_1: (row[8] || "").trim(),
        IGST_1: (row[9] || "").trim(),
        Transport_Charges_1: (row[10] || "").trim(),
        Transport_Gst_Amount_1: (row[11] || "").trim(),
        NET_Amount: (row[12] || "").trim(),
        Total_GST_Amount_1: (row[13] || "").trim(),
        GST_Filling_Period: (row[14] || "").trim(),
        IN_Out_Head_1: (row[15] || "").trim(),
        Timestamp_2: (row[23] || "").trim(),
        Status_1: (row[21] || "").trim(),
      }));

    res.json({
      success: true,
      totalRecords: data.length,
      data,
    });
  } catch (error) {
    console.error("Error in /Gst-Data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch GST data",
    });
  }
});


router.post("/Gst-Followup-Update", async (req, res) => {
  try {
    // ────────────────────────────────────────────────────────────────
    // STEP 1: Validate and extract request data
    // ────────────────────────────────────────────────────────────────
    console.log("=== GST FOLLOW-UP UPDATE REQUEST ===");
    console.log("FULL REQUEST BODY:", JSON.stringify(req.body, null, 2));
    console.log("Timestamp:", new Date().toISOString());
    console.log("────────────────────────────────────────────────────────────");

    const { uid, status, remark, followUpDate } = req.body;

    console.log("✓ Raw followUpDate from request:", followUpDate);
    console.log("✓ Type of followUpDate:", typeof followUpDate);
    console.log("✓ Is it empty?", !followUpDate || followUpDate === "");

    // Validate UID (required)
    if (!uid || typeof uid !== "string" || uid.trim() === "") {
      console.error("❌ Validation Error: uid is empty or invalid");
      return res.status(400).json({ 
        success: false, 
        error: "uid is required and must be a non-empty string" 
      });
    }

    // Validate Status (required)
    if (!status || typeof status !== "string" || status.trim() === "") {
      console.error("❌ Validation Error: status is empty or invalid");
      return res.status(400).json({ 
        success: false, 
        error: "status is required and must be a non-empty string" 
      });
    }

    // Process optional fields
    const cleanUID = uid.trim();
    const cleanStatus = status.trim();
    const cleanRemark = (remark || "").trim();
    
    // ✅ CRITICAL FIX: Handle followUpDate properly
    let cleanFollowUpDate = "";
    
    // Check if followUpDate exists and has a value
    if (followUpDate) {
      // followUpDate exists - use it
      cleanFollowUpDate = String(followUpDate).trim();
      console.log("✓ Follow-up date is present:", cleanFollowUpDate);
      console.log("✓ Date length:", cleanFollowUpDate.length);
      console.log("✓ Date is NOT empty:", cleanFollowUpDate !== "");
    } else {
      console.log("⚠ No follow-up date provided (optional field)");
      cleanFollowUpDate = "";
    }

    console.log("────────────────────────────────────────────────────────────");
    console.log("Processed Values (BEFORE sending to sheets):");
    console.log("  UID:", cleanUID);
    console.log("  Status:", cleanStatus);
    console.log("  Remark:", cleanRemark);
    console.log("  FollowUpDate:", `"${cleanFollowUpDate}"` || "(EMPTY)");
    console.log("  FollowUpDate is truthy?", !!cleanFollowUpDate);
    console.log("────────────────────────────────────────────────────────────");

    // ────────────────────────────────────────────────────────────────
    // STEP 2: Check Google Sheets configuration
    // ────────────────────────────────────────────────────────────────
    if (!SPREADSHEET_GST_SHEET_ID) {
      console.error("❌ Configuration Error: SPREADSHEET_GST_SHEET_ID not set");
      return res.status(500).json({ 
        success: false, 
        error: "SPREADSHEET_GST_SHEET_ID not configured" 
      });
    }
    console.log("✓ Spreadsheet ID configured");

    // ────────────────────────────────────────────────────────────────
    // STEP 3: Fetch all GST data from Google Sheets
    // ────────────────────────────────────────────────────────────────
    const readRange = "GST_Input!A2:Y";
    console.log("Reading range:", readRange);
    
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: readRange,
      valueRenderOption: "FORMATTED_VALUE",
    });

    const rows = readRes.data.values || [];
    console.log(`✓ Found ${rows.length} rows in sheet`);

    if (rows.length === 0) {
      console.error("❌ No data found in sheet");
      return res.status(404).json({ 
        success: false, 
        error: "No data found in sheet" 
      });
    }

    // ────────────────────────────────────────────────────────────────
    // STEP 4: Find the row matching the UID
    // ────────────────────────────────────────────────────────────────
    const rowIndex = rows.findIndex(
      (row) => row[0] && row[0].toString().trim() === cleanUID
    );

    if (rowIndex === -1) {
      console.error(`❌ UID not found: ${cleanUID}`);
      return res.status(404).json({ 
        success: false, 
        error: `UID not found: ${cleanUID}` 
      });
    }

    const sheetRowNumber = rowIndex + 2;
    console.log(`✓ Found UID at sheet row ${sheetRowNumber}`);

    // ────────────────────────────────────────────────────────────────
    // STEP 5: Calculate updated follow-up count
    // ────────────────────────────────────────────────────────────────
    const currentFollowupCount = parseInt(rows[rowIndex][22] || "0", 10) || 0;
    const newFollowupCount = currentFollowupCount + 1;
    console.log(`Follow-up count: ${currentFollowupCount} → ${newFollowupCount}`);

    // ────────────────────────────────────────────────────────────────
    // STEP 6: Generate timestamp
    // ────────────────────────────────────────────────────────────────
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timestampStr = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    console.log(`Current timestamp: ${timestampStr}`);

    // ────────────────────────────────────────────────────────────────
    // STEP 7: Prepare values for update
    // ────────────────────────────────────────────────────────────────
    // Column U = Timestamp_2
    // Column V = Status_2
    // Column W = Followup_Count_2
    // Column X = Gst_Fill_Date_2 (FollowUpDate - NEXT FOLLOW-UP DATE)
    // Column Y = Remark_2

    console.log("────────────────────────────────────────────────────────────");
    console.log("VALUES BEING WRITTEN TO GOOGLE SHEETS:");
    console.log("  Column U (Timestamp):", timestampStr);
    console.log("  Column V (Status):", cleanStatus);
    console.log("  Column W (Count):", newFollowupCount.toString());
    console.log("  Column X (Date) <<<<<<< IMPORTANT:", `"${cleanFollowUpDate}"`);
    console.log("  Column Y (Remark):", cleanRemark);
    console.log("────────────────────────────────────────────────────────────");

    const updateValues = [
      [
        timestampStr,                    // Column U: Timestamp
        cleanStatus,                     // Column V: Status
        newFollowupCount.toString(),     // Column W: Count
        cleanFollowUpDate,               // Column X: FOLLOW-UP DATE ✅
        cleanRemark                      // Column Y: Remarks
      ]
    ];

    const updateRange = `GST_Input!U${sheetRowNumber}:Y${sheetRowNumber}`;
    console.log(`Update range: ${updateRange}`);
    console.log("Values array to write:", JSON.stringify(updateValues));

    // ────────────────────────────────────────────────────────────────
    // STEP 8: Write updated values to Google Sheets
    // ────────────────────────────────────────────────────────────────
    console.log("Attempting to write to Google Sheets...");
    
    const updateRes = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_GST_SHEET_ID,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      resource: { values: updateValues },
    });

    console.log("✓ Update successful");
    console.log(`✓ Updated cells: ${updateRes.data.updatedCells}`);
    console.log("✓ Updated range:", updateRes.data.updatedRange);
    console.log("────────────────────────────────────────────────────────────");

    // ────────────────────────────────────────────────────────────────
    // STEP 9: Return success response
    // ────────────────────────────────────────────────────────────────
    const successResponse = {
      success: true,
      message: "Follow-up updated successfully",
      data: {
        uid: cleanUID,
        sheetRow: sheetRowNumber,
        timestamp: timestampStr,
        status: cleanStatus,
        followup_count: newFollowupCount,
        followUpDate: cleanFollowUpDate,  // Return actual value
        remark: cleanRemark,
        cellsUpdated: updateRes.data.updatedCells
      }
    };

    console.log("SUCCESS RESPONSE:", JSON.stringify(successResponse, null, 2));
    console.log("═══════════════════════════════════════════════════════════");
    
    res.json(successResponse);

  } catch (error) {
    // ────────────────────────────────────────────────────────────────
    // ERROR HANDLING
    // ────────────────────────────────────────────────────────────────
    console.error("❌ ERROR in Gst-Followup-Update:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    let errorMessage = "Failed to update follow-up";
    let statusCode = 500;

    if (error.message && error.message.includes("404")) {
      statusCode = 404;
      errorMessage = "Spreadsheet or range not found";
    } else if (error.message && error.message.includes("403")) {
      statusCode = 403;
      errorMessage = "Permission denied - check service account access";
    } else if (error.message && error.message.includes("INVALID_ARGUMENT")) {
      statusCode = 400;
      errorMessage = "Invalid request format";
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      details: error.message || error.toString(),
      timestamp: new Date().toISOString()
    });
  }
});



module.exports = router;
