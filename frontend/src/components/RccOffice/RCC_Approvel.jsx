


import React, { useState, useMemo } from "react";
import {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} from "../../features/RCC_Office_Expenses/approval1ApiSlice";
import {
  Image,
  Loader2,
  CheckCircle,
  Edit3,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

function RCC_Approvel() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPendingOfficeExpensesQuery();

  const [updateApproval, { isLoading: isUpdating }] =
    useUpdateOfficeExpenseApprovalMutation();

  const currentApprover = sessionStorage.getItem("userName") || "";
  const userType = sessionStorage.getItem("userType")?.toUpperCase() || "";
  const allExpenses = response?.data || [];

  const isAdmin = userType === "ADMIN";

  const expensesToShow = isAdmin
    ? allExpenses
    : allExpenses.filter(
        (item) =>
          item.APPROVAL_DOER?.trim().toLowerCase() ===
          currentApprover.trim().toLowerCase()
      );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffBillNo, setSelectedOffBillNo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [revisedAmounts, setRevisedAmounts] = useState({}); // uid → value (string)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    STATUS_2: "",
    REMARK_2: "",
  });

  // Normalized bill numbers
  const uniqueOffBillNos = useMemo(() => {
    const billNos = new Set();
    expensesToShow.forEach((item) => {
      const bill = String(item.OFFBILLUID ?? "").trim();
      if (bill) billNos.add(bill);
    });
    return Array.from(billNos).sort();
  }, [expensesToShow]);

  const filteredOffBillNos = useMemo(() => {
    if (!searchTerm.trim()) return uniqueOffBillNos;
    const term = searchTerm.trim().toLowerCase();
    return uniqueOffBillNos.filter((billNo) =>
      billNo.toLowerCase().includes(term)
    );
  }, [uniqueOffBillNos, searchTerm]);

  const itemsForSelectedBill = useMemo(() => {
    if (!selectedOffBillNo) return [];
    const selected = String(selectedOffBillNo).trim();
    return expensesToShow.filter((item) => {
      const itemBill = String(item.OFFBILLUID ?? "").trim();
      return itemBill === selected;
    });
  }, [selectedOffBillNo, expensesToShow]);

  const totalOriginalAmount = useMemo(() => {
    return itemsForSelectedBill.reduce((sum, item) => {
      const amountStr = String(item.Amount || "0").replace(/,/g, "");
      return sum + (parseFloat(amountStr) || 0);
    }, 0);
  }, [itemsForSelectedBill]);

  const totalRevisedAmount = useMemo(() => {
    return itemsForSelectedBill.reduce((sum, item) => {
      const revised = revisedAmounts[item.uid];
      if (!revised) return sum;
      const clean = String(revised).replace(/,/g, "").trim();
      return sum + (parseFloat(clean) || 0);
    }, 0);
  }, [itemsForSelectedBill, revisedAmounts]);

  const allItemsHaveRevisedAmount = useMemo(() => {
    if (itemsForSelectedBill.length === 0) return false;
    return itemsForSelectedBill.every((item) => {
      const val = revisedAmounts[item.uid];
      return val !== undefined && val !== "" && !isNaN(parseFloat(val));
    });
  }, [itemsForSelectedBill, revisedAmounts]);

  const formatAmount = (amountStr) => {
    if (!amountStr) return "0.00";
    const clean = String(amountStr).replace(/,/g, "");
    const num = parseFloat(clean) || 0;
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Handlers
  const handleRevisedAmountChange = (uid, value) => {
    setRevisedAmounts((prev) => ({
      ...prev,
      [uid]: value,
    }));
  };

  const clearSelection = () => {
    setSelectedOffBillNo("");
    setSearchTerm("");
    setRevisedAmounts({});
    setShowDropdown(false);
  };

  const openModal = () => {
    if (!allItemsHaveRevisedAmount) {
      alert("कृपया सभी आइटम्स के लिए Revised Amount भरें");
      return;
    }
    setFormData({ STATUS_2: "", REMARK_2: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_2) {
      alert("कृपया स्टेटस चुनें");
      return;
    }

    try {
      const promises = itemsForSelectedBill.map((item) => {
        const uid = item.uid;
        const payload = {
          uid,
          STATUS_2: formData.STATUS_2,
          REVISED_AMOUNT_3: revisedAmounts[uid] || undefined,
          APPROVAL_DOER_2: item?.APPROVAL_DOER || currentApprover || "Unknown",
          REMARK_2: formData.REMARK_2 || undefined,
        };
        return updateApproval(payload).unwrap();
      });

      await Promise.all(promises);
      alert("Approval successful!");
      setIsModalOpen(false);
      setRevisedAmounts({});
    } catch (err) {
      alert("Error: " + (err?.data?.message || err.message || "Unknown error"));
    }
  };

  // Render logic
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="ml-3 text-lg text-gray-600">Loading pending approvals...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600 text-lg">
        Error: {error?.data?.message || "Failed to load data"}
      </div>
    );
  }

  if (!currentApprover) {
    return (
      <div className="text-center py-16 text-red-600 text-xl">
        No user information found in session. Please login again.
      </div>
    );
  }

  if (expensesToShow.length === 0) {
    return (
      <div className="text-center py-16 text-gray-600 text-xl space-y-4">
        <div>
          No pending approvals {isAdmin ? "in the system" : "assigned to you"} at this time.
        </div>
        <div className="text-base text-gray-500">
          Logged in as: <strong>{currentApprover}</strong>
          {isAdmin && <span className="ml-2">(ADMIN)</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 mt-10 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-gray-700/50">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          RCC Office Expenses
          <span className="block text-xl font-medium text-gray-400 mt-1">
            Level 1 Approval
          </span>
        </h2>
        <div className="flex items-center gap-3 bg-gray-800/60 px-4 py-2 rounded-lg border border-gray-700/50">
          <span className="text-gray-400 text-sm">Approver:</span>
          <span className="font-medium text-white">{currentApprover}</span>
          {isAdmin && (
            <span className="ml-1 px-2 py-0.5 bg-purple-700/70 text-purple-200 text-xs rounded-full font-semibold">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Bill Selection - Sticky */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-950 to-transparent pb-4 pt-2">
        <div className="bg-gray-900/80 rounded-xl border border-gray-700/60 p-6 backdrop-blur-md shadow-xl">
          <label className="block text-lg font-semibold text-gray-200 mb-3">
            Select OFFBILL NO
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedOffBillNo || searchTerm}
              onChange={(e) => {
                if (selectedOffBillNo) {
                  if (e.target.value === "") {
                    clearSelection();
                  }
                  return;
                }
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => !selectedOffBillNo && setShowDropdown(true)}
              placeholder="Type to search OFFBILL NO..."
              className="w-full px-4 py-3.5 pl-11 pr-14 bg-gray-800/90 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />

            {selectedOffBillNo ? (
              <button
                onClick={clearSelection}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                title="Clear selection"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            )}

            {showDropdown && !selectedOffBillNo && (
              <div className="absolute z-50 w-full mt-2 bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl max-h-72 overflow-y-auto backdrop-blur-sm">
                {filteredOffBillNos.length > 0 ? (
                  filteredOffBillNos.map((billNo) => (
                    <div
                      key={billNo}
                      onClick={() => {
                        setSelectedOffBillNo(billNo);
                        setSearchTerm("");
                        setShowDropdown(false);
                        setRevisedAmounts({});
                      }}
                      className="px-5 py-3.5 hover:bg-indigo-950/70 cursor-pointer border-b border-gray-800 last:border-b-0 text-gray-300 hover:text-white transition-colors"
                    >
                      {billNo}
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-4 text-gray-500 text-center">
                    No matching OFFBILL NO found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Bill Info */}
      {selectedOffBillNo && (
        <div className="bg-gray-800/70 p-4 rounded-lg mb-4 text-white text-sm">
          <strong>Selected Bill:</strong>{" "}
          <span className="text-indigo-300">{selectedOffBillNo}</span> •{" "}
          {itemsForSelectedBill.length} items
        </div>
      )}

      {selectedOffBillNo ? (
        itemsForSelectedBill.length > 0 ? (
          <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-6 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-semibold text-gray-200">
                Items for bill:{" "}
                <span className="text-indigo-400">{selectedOffBillNo}</span>
              </h3>
              <div className="text-sm text-gray-400">
                All items are mandatory — please fill revised amount for each
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-700/40">
              <table className="w-full table-auto min-w-max">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      UID
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Office Name
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Payee
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Item Name
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      QTY
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Original Amount
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Revised Amount <span className="text-red-400">*</span>
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Approval Doer
                    </th>
                    <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                      Bill
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 bg-gray-900/30">
                  {itemsForSelectedBill.map((item) => (
                    <tr
                      key={item.uid}
                      className={`hover:bg-indigo-950/40 transition-colors ${
                        revisedAmounts[item.uid]
                          ? "bg-emerald-950/30"
                          : "bg-red-950/20"
                      }`}
                    >
                      <td className="px-5 py-4 text-sm text-gray-300 font-medium">{item.uid}</td>
                      <td className="px-5 py-4 text-sm text-gray-300">
                        {item.OFFICE_NAME_1 || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {item.PAYEE_NAME_1 || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300 max-w-xs truncate" title={item.ITEM_NAME_1}>
                        {item.ITEM_NAME_1 || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{item.Qty_1 || "-"}</td>
                      <td className="px-5 py-4 text-sm font-medium text-emerald-400">
                        ₹{formatAmount(item.Amount)}
                      </td>
                      <td className="px-5 py-4">
                        <input
                          type="number"
                          value={revisedAmounts[item.uid] || ""}
                          onChange={(e) => handleRevisedAmountChange(item.uid, e.target.value)}
                          placeholder="Required"
                          required
                          className={`w-full px-3 py-2 bg-gray-800 border ${
                            revisedAmounts[item.uid]
                              ? "border-emerald-600 focus:ring-emerald-500"
                              : "border-red-600 focus:ring-red-500"
                          } rounded-lg text-gray-200 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                        />
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">
                        {item.APPROVAL_DOER || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {item.Bill_Photo ? (
                          <a
                            href={item.Bill_Photo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                          >
                            <Image className="w-4 h-4" />
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-5">
              <div className="text-lg font-semibold text-gray-300">
                Total (Original):{" "}
                <span className="text-emerald-400">
                  ₹{totalOriginalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
                <span className="ml-4 text-lg">
                  Revised:{" "}
                  <span className={totalRevisedAmount > 0 ? "text-emerald-400" : "text-gray-400"}>
                    ₹{totalRevisedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </span>
              </div>

              <button
                onClick={openModal}
                disabled={!allItemsHaveRevisedAmount || isUpdating}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit3 className="w-5 h-5" />
                Review & Approve ({itemsForSelectedBill.length} items)
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900/40 rounded-xl border border-gray-700/50 p-8 text-center text-gray-400 backdrop-blur-sm">
            No items found for bill{" "}
            <strong className="text-indigo-400">{selectedOffBillNo}</strong>
          </div>
        )
      ) : null}

      {/* Approval Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-700/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 to-purple-950 px-8 py-6">
              <h3 className="text-2xl font-bold text-white">Level 1 Approval</h3>
              <p className="text-gray-300 mt-1">
                {itemsForSelectedBill.length} items • ₹
                {totalRevisedAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Approval Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_2}
                  onChange={(e) =>
                    setFormData({ ...formData, STATUS_2: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">----- Select -----</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Remark
                </label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) =>
                    setFormData({ ...formData, REMARK_2: e.target.value })
                  }
                  rows={3}
                  placeholder="Add any remark..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 text-sm text-gray-400">
                <strong>Approver:</strong> {currentApprover}
                {isAdmin && <span className="text-purple-400 ml-2">(ADMIN)</span>}
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-sm text-gray-300 font-semibold mb-2">Items Summary:</p>
                <div className="space-y-1 max-h-40 overflow-y-auto text-xs text-gray-400">
                  {itemsForSelectedBill.map((item) => (
                    <div key={item.uid} className="flex justify-between">
                      <span className="truncate max-w-[280px]">{item.ITEM_NAME_1 || item.uid}</span>
                      <span className="text-emerald-400">
                        ₹{formatAmount(revisedAmounts[item.uid] || item.Amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-950/70 flex gap-4 justify-end border-t border-gray-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="px-6 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RCC_Approvel;