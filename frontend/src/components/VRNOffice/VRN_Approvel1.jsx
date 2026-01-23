

// import React, { useState } from 'react';
// import {
//    useGetPendingOfficeExpensesQuery,
//   useUpdateOfficeExpenseApprovalMutation,
// } from '../../features/VRN_OFFICE_Expenses/Vrn_Approval1ApiSlice'; 
// import { ExternalLink, Image, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';

// function VRN_Approvel1() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//   } = useGetPendingOfficeExpensesQuery();

//   const [updateApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseApprovalMutation();

//   const expenses = response?.data || [];
//   const totalRecords = response?.totalRecords || 0;

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [formData, setFormData] = useState({
//     STATUS_2: '',
//     REVISED_AMOUNT_3: '',
//     REMARK_2: '',
//   });

  

//   const openModal = (expense) => {
//     setSelectedExpense(expense);
//     setFormData({
//       STATUS_2: '',
//       REVISED_AMOUNT_3: expense.PLANNED_2 || '',
//       REMARK_2: '',
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedExpense(null);
//   };

//   const handleSubmit = async () => {
//     if (!formData.STATUS_2) {
//       alert('Please select a status');
//       return;
//     }

//     const payload = {
//       uid: selectedExpense.uid,
//       STATUS_2: formData.STATUS_2,
//       REVISED_AMOUNT_3: formData.REVISED_AMOUNT_3,
//       APPROVAL_DOER_2: selectedExpense.APPROVAL_DOER || 'Unknown', // Auto-filled
//       REMARK_2: formData.REMARK_2,
//     };

//     try {
//       await updateApproval(payload).unwrap();
//       alert('Approval updated successfully!');
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to update approval: ' + (err?.data?.message || err.message));
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
//         <span className="ml-3 text-lg text-gray-600">Loading pending approvals...</span>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="text-center py-10 text-red-600 text-lg">
//         Error: {error?.data?.message || 'Failed to load data'}
//       </div>
//     );
//   }

//   if (expenses.length === 0) {
//     return (
//       <div className="text-center py-16 text-gray-500 text-xl">
//         No pending approvals at Level 1
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-3xl font-bold text-gray-800">VRN Office Expenses - Level 1 Approval</h2>
//         <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold">
//           {totalRecords} Pending Record{totalRecords !== 1 ? 's' : ''}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
//         <table className="w-full table-auto bg-white">
//           <thead className=" bg-blue-400 text-white font-bold text-2xl">
//             <tr>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Planned </th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UID</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Office Name</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Payee</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES HEAD</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES SUBHEAD</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES Details</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">DEPARTMENT</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">APPROVAL DOER</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">RAISED BY</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">REMARK </th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Bill</th>
//               <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {expenses.map((item) => (
//               <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-4 py-4 text-sm font-bold text-emerald-800">{item.PLANNED_2 || '0'}</td>
//                 <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.uid}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.OFFICE_NAME_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.PAYEE_NAME_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.EXPENSES_HEAD_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.EXPENSES_SUBHEAD_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.EXPENSES_DETAILS_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.Amount || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.DEPARTMENT_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.APPROVAL_DOER}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.RAISED_BY_1}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700">{item.REMARK_1}</td>
//                 <td className="px-4 py-4 text-sm">
//                   {item.Bill_Photo ? (
//                     <a href={item.Bill_Photo} target="_blank" rel="noopener noreferrer"
//                       className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
//                       <Image className="w-4 h-4" /> View
//                     </a>
//                   ) : <span className="text-gray-400 text-xs">-</span>}
//                 </td>
//                 <td className="px-4 py-4 text-center">
//                   <button
//                     onClick={() => openModal(item)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition"
//                   >
//                     <Edit3 className="w-4 h-4" />
//                     Review
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Approval Modal */}
//       {isModalOpen && selectedExpense && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Level 1 Approval</h3>

//             <div className="space-y-4 mb-6">
              

             

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status <span className="text-red-500">*</span></label>
//                 <select
//                   value={formData.STATUS_2}
//                   onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Approved">Done</option>
                 
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Revised Amount (if changed)</label>
//                 <input
//                   type="number"
//                   value={formData.REVISED_AMOUNT_3}
//                   onChange={(e) => setFormData({ ...formData, REVISED_AMOUNT_3: e.target.value })}
//                   placeholder="Enter revised amount"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//                 <textarea
//                   value={formData.REMARK_2}
//                   onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
//                   rows="3"
//                   placeholder="Add any remark..."
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div className="pt-2">
//                 <p className="text-sm text-gray-600">
//                   <strong>Approver:</strong> {selectedExpense.APPROVAL_DOER || 'Current User'} (Auto-filled)
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={isUpdating}
//                 className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70"
//               >
//                 {isUpdating ? (
//                   <>Updating...</>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Submit Approval
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default VRN_Approvel1;





import React, { useState, useMemo } from "react";
import {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} from "../../features/VRN_OFFICE_Expenses/Vrn_Approval1ApiSlice";
import {
  Image as LucideImage,
  Loader2,
  CheckCircle,
  Edit3,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

function VRN_Approvel1() {
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
  const isAdmin = userType === "ADMIN";

  const allExpenses = response?.data || [];
  const totalRecords = response?.totalRecords || 0;

  // Filter expenses assigned to current user (unless admin)
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
  const [revisedAmounts, setRevisedAmounts] = useState({}); // uid → value
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    STATUS_2: "",
    REMARK_2: "",
  });

  // ── Computed values ────────────────────────────────────────────────
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

  const totalOriginalAmount = useMemo(() =>
    itemsForSelectedBill.reduce((sum, item) => {
      const amt = String(item.Amount || "0").replace(/,/g, "");
      return sum + (parseFloat(amt) || 0);
    }, 0), [itemsForSelectedBill]);

  const totalRevisedAmount = useMemo(() =>
    itemsForSelectedBill.reduce((sum, item) => {
      const rev = revisedAmounts[item.uid];
      if (!rev) return sum;
      const clean = String(rev).replace(/,/g, "").trim();
      return sum + (parseFloat(clean) || 0);
    }, 0), [itemsForSelectedBill, revisedAmounts]);

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

  // ── Handlers ───────────────────────────────────────────────────────
  const handleRevisedAmountChange = (uid, value) => {
    setRevisedAmounts((prev) => ({ ...prev, [uid]: value }));
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
        const payload = {
          uid: item.uid,
          STATUS_2: formData.STATUS_2,
          REVISED_AMOUNT_3: revisedAmounts[item.uid] || undefined,
          APPROVAL_DOER_2: item.APPROVAL_DOER || currentApprover || "Unknown",
          REMARK_2: formData.REMARK_2 || undefined,
        };
        return updateApproval(payload).unwrap();
      });

      await Promise.all(promises);
      alert("Approval updated successfully!");
      setIsModalOpen(false);
      setRevisedAmounts({});
      // Optional: refetch or clear selection
      // clearSelection();
    } catch (err) {
      console.error(err);
      alert("Failed to update: " + (err?.data?.message || err.message));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <span className="ml-3 text-lg text-gray-300">Loading pending approvals...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-400 text-lg">
        Error: {error?.data?.message || "Failed to load data"}
      </div>
    );
  }

  if (!currentApprover) {
    return (
      <div className="text-center py-16 text-red-400 text-xl">
        No user information found in session. Please login again.
      </div>
    );
  }

  if (expensesToShow.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-xl space-y-3">
        <div>No pending approvals {isAdmin ? "in the system" : "assigned to you"}.</div>
        <div className="text-base">
          Logged in as: <strong className="text-gray-200">{currentApprover}</strong>
          {isAdmin && <span className="ml-2 text-purple-400">(ADMIN)</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pb-5 border-b border-gray-700/60">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
            VRN Office Expenses
          </h2>
          <p className="text-xl text-gray-400 mt-1 font-medium">Level 1 Approval</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-800/70 px-5 py-2.5 rounded-xl border border-gray-700/60">
          <span className="text-gray-400 text-sm">Approver:</span>
          <span className="font-semibold text-white">{currentApprover}</span>
          {isAdmin && (
            <span className="px-2.5 py-1 bg-purple-800/60 text-purple-200 text-xs rounded-full font-medium">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Bill Selector – Sticky */}
      <div className="sticky top-0 z-20 bg-gradient-to-b from-gray-950 to-transparent pb-5 pt-2">
        <div className="bg-gray-900/85 rounded-2xl border border-gray-700/60 p-6 backdrop-blur-lg shadow-2xl">
          <label className="block text-lg font-semibold text-gray-200 mb-3">
            Select OFFBILL NO
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedOffBillNo || searchTerm}
              onChange={(e) => {
                if (selectedOffBillNo) {
                  if (e.target.value === "") clearSelection();
                  return;
                }
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => !selectedOffBillNo && setShowDropdown(true)}
              placeholder="Search OFFBILL NO..."
              className="w-full px-5 py-4 pl-12 pr-16 bg-gray-800/90 border border-gray-700 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            {selectedOffBillNo ? (
              <button
                onClick={clearSelection}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition"
              >
                <X className="w-6 h-6" />
              </button>
            ) : (
              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500" />
            )}

            {showDropdown && !selectedOffBillNo && (
              <div className="absolute z-50 w-full mt-2 bg-gray-900/95 border border-gray-700 rounded-xl shadow-2xl max-h-80 overflow-y-auto backdrop-blur-md">
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
                      className="px-6 py-4 hover:bg-cyan-950/60 cursor-pointer border-b border-gray-800 last:border-b-0 text-gray-300 hover:text-cyan-200 transition"
                    >
                      {billNo}
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-5 text-gray-500 text-center">
                    No matching bill number found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content when bill is selected */}
      {selectedOffBillNo && (
        <>
          <div className="bg-gray-800/60 p-4 rounded-xl text-sm text-gray-300 border border-gray-700/50">
            <strong>Selected Bill:</strong>{" "}
            <span className="text-cyan-300 font-medium">{selectedOffBillNo}</span> •{" "}
            {itemsForSelectedBill.length} item{itemsForSelectedBill.length !== 1 ? "s" : ""}
          </div>

          {itemsForSelectedBill.length > 0 ? (
            <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-6 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-semibold text-gray-100">
                  Items for bill <span className="text-cyan-400">{selectedOffBillNo}</span>
                </h3>
                <div className="text-sm text-gray-400">
                  Fill revised amount for <strong>every item</strong> (mandatory)
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-700/40">
                <table className="w-full table-auto min-w-max">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950 text-white">
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">UID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Office Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Payee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Item Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">QTY</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Original Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                        Revised Amount <span className="text-red-400">*</span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Bill</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60 bg-gray-900/30">
                    {itemsForSelectedBill.map((item) => (
                      <tr
                        key={item.uid}
                        className={`hover:bg-indigo-950/40 transition-colors ${
                          revisedAmounts[item.uid] ? "bg-emerald-950/20" : "bg-red-950/10"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-300 font-medium">{item.uid}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.OFFICE_NAME_1 || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.PAYEE_NAME_1 || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.ITEM_NAME_1 || "-"}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{item.Qty_1 || "-"}</td>
                       
                        <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                          ₹{formatAmount(item.Amount)}
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={revisedAmounts[item.uid] || ""}
                            onChange={(e) => handleRevisedAmountChange(item.uid, e.target.value)}
                            placeholder="Required"
                            className={`w-full px-4 py-2.5 bg-gray-800 border ${
                              revisedAmounts[item.uid]
                                ? "border-emerald-600 focus:ring-emerald-500"
                                : "border-red-600 focus:ring-red-500"
                            } rounded-lg text-gray-100 focus:outline-none focus:ring-2 transition-all`}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {item.Bill_Photo ? (
                            <a
                              href={item.Bill_Photo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                            >
                              <LucideImage className="w-4 h-4" />
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

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-lg font-medium text-gray-300">
                  Total Original:{" "}
                  <span className="text-emerald-400 font-semibold">
                    ₹{totalOriginalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="ml-6">
                    Revised:{" "}
                    <span className={totalRevisedAmount > 0 ? "text-emerald-400" : "text-gray-400"}>
                      ₹{totalRevisedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                </div>

                <button
                  onClick={openModal}
                  disabled={!allItemsHaveRevisedAmount || isUpdating}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit3 className="w-5 h-5" />
                  Review & Approve ({itemsForSelectedBill.length} items)
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-2xl border border-gray-700/50 p-10 text-center text-gray-400 backdrop-blur-sm">
              No items found for bill <strong className="text-cyan-300">{selectedOffBillNo}</strong>
            </div>
          )}
        </>
      )}

      {/* ── Approval Modal ──────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-700/30 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-950 to-indigo-950 px-8 py-6">
              <h3 className="text-2xl font-bold text-white">Level 1 Approval – VRN</h3>
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
                  onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                >
                  <option value="">----- Select -----</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Remark</label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
                  rows={3}
                  placeholder="Add remark if needed..."
                  className="w-full px-5 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                />
              </div>

              <div className="text-sm text-gray-400">
                <strong>Approver:</strong> {currentApprover}
                {isAdmin && <span className="text-purple-300 ml-2">(ADMIN)</span>}
              </div>

              <div className="bg-gray-800/60 p-5 rounded-xl border border-gray-700">
                <p className="text-sm font-semibold text-gray-300 mb-3">Items Summary:</p>
                <div className="space-y-2 max-h-52 overflow-y-auto text-sm text-gray-400">
                  {itemsForSelectedBill.map((item) => (
                    <div key={item.uid} className="flex justify-between">
                      <span className="truncate max-w-[320px]">{item.EXPENSES_DETAILS_1 || item.uid}</span>
                      <span className="text-emerald-400 font-medium">
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
                className="px-7 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="px-7 py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl flex items-center gap-2.5 transition disabled:opacity-50"
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

export default VRN_Approvel1;