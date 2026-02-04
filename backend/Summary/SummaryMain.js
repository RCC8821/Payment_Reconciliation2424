const express = require("express");
const { sheets, Summary_ID } = require("../config/googleSheet");

const router = express.Router();

router.get("/Summary-main", async (req, res) => {
  try {
    if (!Summary_ID) {
      return res.status(500).json({
        success: false,
        error: "Summary_ID is not configured",
      });
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: Summary_ID,
      range: "All_Bank_Summary!A3:G", // Adjust 1000 → higher if more rows expected
      valueRenderOption: "FORMATTED_VALUE", // Keeps commas in numbers like "23,292,700.00"
    });

    const rows = response.data.values || [];

    if (rows.length < 2) {
      return res.json({
        success: true,
        message: "Not enough data found in sheet",
        inTotal: null,
        outTotal: null,
        transactions: [],
      });
    }

    // ────────────────────────────────────────────────
    // TOTAL row → usually the very first row (index 0)
    // IN total is in column F (index 5), OUT in G (index 6)
    // ────────────────────────────────────────────────
    const totalRow = rows[0] || [];

    let inTotal = totalRow[5] || null; // F column → "IN" Amount total
    let outTotal = totalRow[6] || null; // G column → "OUT" Expenses total

    // Fallback: if somehow shifted, check nearby columns
    if (!inTotal && totalRow[4]) inTotal = totalRow[4];
    if (!outTotal && totalRow[5]) outTotal = totalRow[5]; // rare case

    // Optional: clean numbers for calculation (remove commas)
    let balanceDiff = null;
    if (inTotal && outTotal) {
      const inClean = parseFloat(inTotal.toString().replace(/,/g, "")) || 0;
      const outClean = parseFloat(outTotal.toString().replace(/,/g, "")) || 0;
      balanceDiff = (inClean - outClean).toFixed(2);
    }

    // ────────────────────────────────────────────────
    // Transactions: start from row 1 (A4 onwards)
    // ────────────────────────────────────────────────
    const transactions = rows
      .slice(1)
      .filter((row) => {
        // Keep only rows that have a valid date in column A
        return (
          row &&
          row.length >= 5 &&
          row[0] &&
          row[0].trim() !== "" &&
          !row[0].toLowerCase().includes("total")
        );
      })
      .map((row) => ({
        date: row[0] || "", // A - DATE
        siteName: row[1] || "", // B - Site Name
        vendorName: row[2] || "", // C - Vendor Name
        bankName: row[3] || "", // D - Bank Name
        expHead: row[4] || "", // E - Exp Head
        inAmount: row[5] || "0.00", // F - "IN" Amount
        outAmount: row[6] || "0.00", // G - "OUT" Expenses
      })).reverse();
      

    // Final response
    res.json({
      success: true,
      inTotal: inTotal, // should now be "23,292,700.00" or similar
      outTotal: outTotal, // "37,944,961.12"
      netBalance: balanceDiff, // IN - OUT as string with 2 decimals
      totalTransactions: transactions.length,
      transactions: transactions,
      // Optional debug (remove in production)
      debug: {
        rowsFetched: rows.length,
        firstRow: totalRow.slice(0, 7), // first 7 cells of total row
        sampleTx: transactions[0] ? transactions[0] : null,
      },
    });
  } catch (error) {
    console.error("Error in /Summary-main:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch bank summary data",
      details: error.message || "Unknown error",
    });
  }
});





router.get("/Bank-Balance",async (req,res)=>{
    try {

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId:Summary_ID,
      range: 'Bank Balance!A2:B',
    });

    let rows = response.data.values || [];

    if (rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

  
    const filteredData = rows
    //  .filter(row => row[12] && !row[13])
      .map(row => ({
        BankName: (row[0] || '').toString().trim(),
        Balance: (row[1] || '').toString().trim(),
       
      }));

    res.json({ success: true, data: filteredData });
  } catch (error) {
    console.error('GET /Bank Balnace:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch data' });
  }
})

module.exports = router;
