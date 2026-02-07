const express = require("express");
const { sheets, Summary_ID } = require("../config/googleSheet");

const router = express.Router();

router.get("/outStanding", async (req, res) => {
  try {
    if (!Summary_ID) {
      return res.status(500).json({
        success: false,
        error: "Summary_ID is not configured",
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: Summary_ID,
      range: "Out_Standing_Data!A3:H1000", // ← adjust end row if needed
      valueRenderOption: "FORMATTED_VALUE",
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({
        success: true,
        message: "No data found in sheet",
        totalOutstanding: "0.00",
        totalNetAmount: "0.00",
        totalPaidAmount: "0.00",
        transactions: [],
      });
    }

    // ────────────────────────────────────────────────
    // Map rows to meaningful objects
    // Assuming header is already skipped (data starts A3)
    // ────────────────────────────────────────────────
    const transactions = rows
      .filter((row) => {
        // Skip completely empty rows or total rows
        if (!row || row.length < 6) return false;
        const date = (row[0] || "").toString().trim();
        return date !== "" && !date.toLowerCase().includes("total");
      })
      .map((row) => ({
        date       : row[0] || "",           // A - Date
        siteName   : row[1] || "",           // B - Site Name
        vendorName : row[2] || "",           // C - Vendor Name
        billNo     : row[3] || "",           // D - Bill. No
        expHead    : row[4] || "",           // E - Exp. Head
        netAmount  : row[5] || "0.00",       // F - Net Amount
        paidAmount : row[6] || "0.00",       // G - Paid Amount
        balance    : row[7] || "0.00",       // H - Balance (most important)
      }))
      .reverse(); // newest first (optional — remove if you want oldest first)

    // ────────────────────────────────────────────────
    // Calculate aggregates from the data itself
    // (more reliable than depending on a "total row")
    // ────────────────────────────────────────────────
    let totalNet   = 0;
    let totalPaid  = 0;
    let totalOut   = 0;

    transactions.forEach((tx) => {
      const net   = parseFloat(tx.netAmount.toString().replace(/,/g, ""))   || 0;
      const paid  = parseFloat(tx.paidAmount.toString().replace(/,/g, ""))  || 0;
      const bal   = parseFloat(tx.balance.toString().replace(/,/g, ""))     || 0;

      totalNet  += net;
      totalPaid += paid;
      totalOut  += bal;   // ← usually what you want to show as "Outstanding"
    });

    const format = (num) => Number(num).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    // Final response
    res.json({
      success: true,
      totalNetAmount    : format(totalNet),
      totalPaidAmount   : format(totalPaid),
      totalOutstanding  : format(totalOut),      // ← most important value
      totalTransactions : transactions.length,
      transactions,
      // Optional debug info (remove in production)
      debug: {
        rowsFetched: rows.length,
        firstRowSample: rows[0] || null,
        lastRowSample: rows[rows.length - 1] || null,
      },
    });

  } catch (error) {
    console.error("Error in /outStanding:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch outstanding data",
      details: error.message || "Unknown error",
    });
  }
});




// router.get("/Bank-Balance",async (req,res)=>{
//     try {

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId:Summary_ID,
//       range: 'Bank Balance!A2:B',
//     });

//     let rows = response.data.values || [];

//     if (rows.length === 0) {
//       return res.json({ success: true, data: [] });
//     }

  
//     const filteredData = rows
//     //  .filter(row => row[12] && !row[13])
//       .map(row => ({
//         BankName: (row[0] || '').toString().trim(),
//         Balance: (row[1] || '').toString().trim(),
       
//       }));

//     res.json({ success: true, data: filteredData });
//   } catch (error) {
//     console.error('GET /Bank Balnace:', error);
//     res.status(500).json({ success: false, error: 'Failed to fetch data' });
//   }
// })

module.exports = router;
