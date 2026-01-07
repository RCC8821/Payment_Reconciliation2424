
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   useGetPaymentReconciliationQuery,
//   useGetBankClosingBalanceQuery,
//   useUpdateReconciliationMutation,
// } from "../../features/Payment/PaymentSlice";
// import { X, Building, Search, FileText } from "lucide-react";

// const Reconciliation = () => {
//   const {
//     data: reconciliationData = [],
//     isLoading,
//     refetch,
//   } = useGetPaymentReconciliationQuery();

//   // States
//   const [selectedBank, setSelectedBank] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
  
//   // Search (debounced for smooth performance)
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
//   // Date inputs
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
  
//   // Applied date filters
//   const [filterFromDate, setFilterFromDate] = useState("");
//   const [filterToDate, setFilterToDate] = useState("");
  
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editForm, setEditForm] = useState({
//     BANK_CLOSING_BALANCE: "",
//     Remark: "",
//     Status: "---- Select ----- ",
//   });

//   // Universal Date Parser
//   const parseDate = (dateStr) => {
//     if (!dateStr) return null;

//     let day, month, year;

//     if (dateStr.includes('-')) {
//       [year, month, day] = dateStr.split('-');
//     } else if (dateStr.includes('/')) {
//       [day, month, year] = dateStr.split('/');
//     } else {
//       return null;
//     }

//     const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
//     const date = new Date(formatted);
//     return isNaN(date.getTime()) ? null : date;
//   };

//   // Unique Banks
//   const uniqueBanks = useMemo(() => {
//     return [...new Set(reconciliationData.map(item => item.bankDetails).filter(Boolean))];
//   }, [reconciliationData]);

//   // Main Bank Balance Query
//   const { data: mainBankData = {}, isLoading: isMainBankLoading } =
//     useGetBankClosingBalanceQuery(selectedBank, { skip: !selectedBank });

//   // Modal Bank Balance Query - Fixed: default empty object to avoid undefined error
//   const { 
//     data: modalBankData = {}, 
//     isLoading: isModalBankLoading 
//   } = useGetBankClosingBalanceQuery(selectedItem?.bankDetails, {
//     skip: !selectedItem?.bankDetails || !isModalOpen,
//   });

//   const [updateReconciliation, { isLoading: isSaving }] =
//     useUpdateReconciliationMutation();

//   // Bank Stats
//   const bankSpecificStats = useMemo(() => {
//     const bankItems = reconciliationData.filter(item => item.bankDetails === selectedBank);
//     const totalPaid = bankItems.reduce((sum, item) => {
//       const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
//       return sum + (isNaN(amt) ? 0 : amt);
//     }, 0);
//     const currentE3 = Number(mainBankData?.bankClosingBalance?.replace(/[₹,]/g, "") || 0);
//     return {
//       totalPaid,
//       count: bankItems.length,
//       finalProjected: currentE3 - totalPaid,
//     };
//   }, [selectedBank, reconciliationData, mainBankData]);

//   const totalGlobalAmount = reconciliationData.reduce((sum, item) => {
//     const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
//     return sum + (isNaN(amt) ? 0 : amt);
//   }, 0);

//   // Debounce search term
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm.trim());
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Main Filtering Logic
//   useEffect(() => {
//     if (!selectedBank) {
//       setFilteredData([]);
//       return;
//     }

//     let data = reconciliationData.filter(item => item.bankDetails === selectedBank);

//     // Date Filter
//     if (filterFromDate || filterToDate) {
//       if (filterFromDate) {
//         const from = parseDate(filterFromDate);
//         if (from) {
//           data = data.filter(item => {
//             const billDate = parseDate(item.paymentDate);
//             return billDate && billDate >= from;
//           });
//         }
//       }
//       if (filterToDate) {
//         const to = parseDate(filterToDate);
//         if (to) {
//           to.setHours(23, 59, 59, 999);
//           data = data.filter(item => {
//             const billDate = parseDate(item.paymentDate);
//             return billDate && billDate <= to;
//           });
//         }
//       }
//     }

//     // Search Filter - हर बार सही काम करेगा
//     if (debouncedSearchTerm) {
//       const term = debouncedSearchTerm.toLowerCase();
//       data = data.filter(item => {
//         return (
//           (item.uid?.toLowerCase().includes(term)) ||
//           (item.contractorName?.toLowerCase().includes(term)) ||
//           (item.bankDetails?.toLowerCase().includes(term)) ||
//           (item.paymentDetails?.toLowerCase().includes(term)) ||
//           (item.paymentMode?.toLowerCase().includes(term)) ||
//           (item.ExpHead?.toLowerCase().includes(term)) ||
//           (item.paymentDate?.toLowerCase().includes(term)) ||
//           (item.timestamp?.toLowerCase().includes(term)) ||
//           (item.planned2?.toLowerCase().includes(term)) ||
//           (item.paidAmount?.replace(/[₹,]/g, "").includes(term))
//         );
//       });
//     }

//     setFilteredData(data);
//   }, [
//     selectedBank,
//     reconciliationData,
//     debouncedSearchTerm,
//     filterFromDate,
//     filterToDate,
//   ]);

//   const handleEditClick = (item) => {
//     setSelectedItem(item);
//     setEditForm({
//       BANK_CLOSING_BALANCE: "",
//       Remark: item.Remark || "",
//       Status: item.Status || "--- Select ----",
//     });
//     setIsModalOpen(true);
//   };

//   // Modal auto-calculate balance - Fixed: modalBankData?.bankClosingBalance check
//   useEffect(() => {
//     if (isModalOpen && selectedItem && modalBankData?.bankClosingBalance) {
//       const originalBalance = Number(modalBankData.bankClosingBalance.replace(/[₹,]/g, ""));
//       const paidAmount = Number(selectedItem.paidAmount.replace(/[₹,]/g, ""));
//       const remaining = (originalBalance - paidAmount).toLocaleString("en-IN", {
//         minimumFractionDigits: 2,
//       });
//       setEditForm(prev => ({ ...prev, BANK_CLOSING_BALANCE: `₹${remaining}` }));
//     }
//   }, [modalBankData, isModalBankLoading, isModalOpen, selectedItem]);

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setSelectedItem(null);
//   };

//   const handleSaveReconciliation = async (e) => {
//     e.preventDefault();
//     const payload = {
//       paymentDetails: selectedItem.paymentDetails.trim(),
//       bankClosingBalanceAfterPayment: editForm.BANK_CLOSING_BALANCE.replace("₹", "").trim(),
//       status: editForm.Status,
//       remark: editForm.Remark.trim(),
//     };
//     try {
//       await updateReconciliation(payload).unwrap();
//       refetch();
//       handleModalClose();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   if (isLoading) return <div className="p-10 text-center font-bold">Loading...</div>;

//   return (
//     <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border">
//       <div className="max-w-full mx-auto space-y-4">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Payment Reconciliation</h1>
//         </div>

//         {/* Global Stats */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div className="bg-blue-600 p-4 rounded-xl text-white shadow-md">
//             <p className="text-[10px] font-bold opacity-80 uppercase">Total All Bank Amount</p>
//             <p className="text-xl font-black">₹{totalGlobalAmount.toLocaleString("en-IN")}</p>
//           </div>
//           <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-400 shadow-sm">
//             <p className="text-gray-400 text-[10px] font-bold uppercase">Pending Entries</p>
//             <p className="text-xl font-black text-gray-800">{reconciliationData.length}</p>
//           </div>
//         </div>

//         {/* Bank Selector */}
//         <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
//           <select
//             value={selectedBank}
//             onChange={(e) => setSelectedBank(e.target.value)}
//             className="w-full md:max-w-xs p-2 bg-gray-50 border rounded-lg font-bold text-sm outline-none focus:border-blue-500"
//           >
//             <option value="">--- Select Bank Account ---</option>
//             {uniqueBanks.map(bank => (
//               <option key={bank} value={bank}>{bank}</option>
//             ))}
//           </select>
//         </div>

//         {selectedBank && (
//           <div className="space-y-4 max-w-full">
//             {/* Bank Summary */}
//             <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
//               <h2 className="text-sm font-bold text-amber-800 mb-3 flex items-start gap-2 break-words">
//                 <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
//                 <span className="flex-1">Records for: {selectedBank}</span>
//               </h2>
//               <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
//                 <div className="bg-white p-3 rounded-lg border border-blue-100">
//                   <p className="text-[9px] font-bold text-blue-400 uppercase">Balance</p>
//                   <p className="text-sm font-black text-blue-900 truncate">
//                     {isMainBankLoading ? "..." : `₹${mainBankData?.bankClosingBalance || "0"}`}
//                   </p>
//                 </div>
//                 <div className="bg-white p-3 rounded-lg border border-yellow-100">
//                   <p className="text-[9px] font-bold text-yellow-600 uppercase">Pending</p>
//                   <p className="text-sm font-black text-gray-800">{bankSpecificStats.count}</p>
//                 </div>
//                 <div className="bg-white p-3 rounded-lg border border-red-100">
//                   <p className="text-[9px] font-bold text-red-500 uppercase">To Deduct</p>
//                   <p className="text-sm font-black text-red-600 truncate">
//                     ₹{bankSpecificStats.totalPaid.toLocaleString("en-IN")}
//                   </p>
//                 </div>
//                 <div className="bg-green-600 p-3 rounded-lg shadow-sm">
//                   <p className="text-[9px] font-bold text-green-100 uppercase">Final Bal.</p>
//                   <p className="text-sm font-black text-white truncate">
//                     ₹{bankSpecificStats.finalProjected.toLocaleString("en-IN")}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             {/* Filters */}
//             <div className="space-y-4">
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search by UID, Contractor, Amount, Date, Bank..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">From Bill Date</label>
//                   <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">To Bill Date</label>
//                   <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
//                 </div>
//                 <div className="flex items-end">
//                   <button
//                     onClick={() => {
//                       setFilterFromDate(fromDate);
//                       setFilterToDate(toDate);
//                     }}
//                     className="w-full px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700"
//                   >
//                     Apply Date Filter
//                   </button>
//                 </div>
//               </div>

//               {(searchTerm || filterFromDate || filterToDate) && (
//                 <div className="flex justify-end">
//                   <button
//                     onClick={() => {
//                       setSearchTerm("");
//                       setFromDate("");
//                       setToDate("");
//                       setFilterFromDate("");
//                       setFilterToDate("");
//                     }}
//                     className="text-sm text-red-600 underline hover:text-red-800"
//                   >
//                     Clear All Filters
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Table */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="w-full">
//                 <table className="w-full text-left border-collapse">
//                   <thead className="bg-gray-800 text-white">
//                     <tr>
//                       {["UID","Timestamp","Contractor","Paid Amount","Bank","Mode","Details","Bill Date","Exp Head","Planned 2","Actions"].map(h => (
//                         <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase whitespace-normal">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {filteredData.length === 0 ? (
//                       <tr>
//                         <td colSpan="11" className="px-3 py-8 text-center text-gray-500">
//                           No data found matching your filters.
//                         </td>
//                       </tr>
//                     ) : (
//                       filteredData.map(item => (
//                         <tr key={item.uid || item.paymentDetails} className="hover:bg-gray-50">
//                           <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.timestamp}</td>
//                           <td className="px-3 py-3 text-[11px] font-bold">{item.uid}</td>
//                           <td className="px-3 py-3 text-[11px]">{item.contractorName}</td>
//                           <td className="px-3 py-3 text-[11px] font-black text-blue-600">₹{item.paidAmount}</td>
//                           <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">{item.bankDetails || "-"}</td>
//                           <td className="px-3 py-3 text-[11px]">{item.paymentMode}</td>
//                           <td className="px-3 py-3 text-[11px] break-words max-w-xs">{item.paymentDetails}</td>
//                           <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.paymentDate}</td>
//                           <td className="px-3 py-3 text-[11px]">{item.ExpHead}</td>
//                           <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.planned2}</td>
//                           <td className="px-3 py-3">
//                             <button onClick={() => handleEditClick(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
//                               <FileText className="w-3.5 h-3.5" />
//                             </button>
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Modal */}
//         {isModalOpen && selectedItem && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-[999]">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
//               <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
//                 <h2 className="text-sm font-bold">Reconcile Transaction</h2>
//                 <button onClick={handleModalClose}><X className="w-5 h-5" /></button>
//               </div>
//               <div className="p-4 overflow-y-auto space-y-4">
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
//                   <div className="p-2 bg-gray-50 rounded border">
//                     <p className="text-[8px] text-gray-400 uppercase font-bold">Bank</p>
//                     <p className="text-[10px] font-bold truncate">{selectedItem.bankDetails}</p>
//                   </div>
//                   <div className="p-2 bg-green-50 rounded border border-green-200">
//                     <p className="text-[8px] text-green-600 uppercase font-bold">E3 Bal.</p>
//                     <p className="text-sm font-black text-green-700">
//                       {isModalBankLoading ? "..." : `₹${modalBankData.bankClosingBalance || "0"}`}
//                     </p>
//                   </div>
//                   <div className="p-2 bg-red-50 rounded border border-red-200">
//                     <p className="text-[8px] text-red-600 uppercase font-bold">Paid</p>
//                     <p className="text-sm font-black text-red-700">₹{selectedItem.paidAmount}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <label className="text-[10px] font-bold text-gray-500 uppercase">
//                     Auto-Calculated Balance
//                   </label>
//                   <input
//                     type="text"
//                     readOnly
//                     value={editForm.BANK_CLOSING_BALANCE}
//                     className="w-full p-3 bg-blue-50 border rounded-xl font-black text-blue-700 text-lg shadow-inner mt-1"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div>
//                     <label className="text-[10px] font-bold text-gray-400 uppercase">Remark</label>
//                     <textarea
//                       value={editForm.Remark}
//                       onChange={(e) => setEditForm({ ...editForm, Remark: e.target.value })}
//                       className="w-full p-2 border rounded-lg text-xs"
//                       rows="2"
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
//                     <select
//                       value={editForm.Status}
//                       onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
//                       className="w-full p-2 border rounded-lg font-bold text-xs"
//                     >
//                       <option value=" ">----- Select----</option>
//                       <option value="Done">Done</option>
//                       <option value="Cancel">Cancel</option>
//                     </select>
//                   </div>
//                 </div>
//                 <div className="pt-4 border-t flex justify-end gap-3">
//                   <button
//                     onClick={handleModalClose}
//                     className="px-4 py-2 font-bold text-gray-400 text-xs uppercase"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveReconciliation}
//                     disabled={isSaving}
//                     className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase hover:bg-blue-700"
//                   >
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Reconciliation;



import React, { useState, useEffect, useMemo } from "react";
import {
  useGetPaymentReconciliationQuery,
  useGetBankClosingBalanceQuery,
  useUpdateReconciliationMutation,
} from "../../features/Payment/PaymentSlice";
import { X, Building, Search, FileText } from "lucide-react";

const Reconciliation = () => {
  const {
    data: reconciliationData = [],
    isLoading,
    refetch,
  } = useGetPaymentReconciliationQuery();

  // States
  const [selectedBank, setSelectedBank] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  
  // Search (debounced for smooth performance)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  // Date inputs
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  
  // Applied date filters
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    BANK_CLOSING_BALANCE: "",
    Remark: "",
    Status: "---- Select ----- ",
  });

  // Universal Date Parser
  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    let day, month, year;

    if (dateStr.includes('-')) {
      [year, month, day] = dateStr.split('-');
    } else if (dateStr.includes('/')) {
      [day, month, year] = dateStr.split('/');
    } else {
      return null;
    }

    const formatted = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const date = new Date(formatted);
    return isNaN(date.getTime()) ? null : date;
  };

  // Unique Banks
  const uniqueBanks = useMemo(() => {
    return [...new Set(reconciliationData.map(item => item.bankDetails).filter(Boolean))];
  }, [reconciliationData]);

  // Main Bank Balance Query
  const { data: mainBankData = {}, isLoading: isMainBankLoading } =
    useGetBankClosingBalanceQuery(selectedBank, { skip: !selectedBank });

  // Modal Bank Balance Query
  const { 
    data: modalBankData = {}, 
    isLoading: isModalBankLoading 
  } = useGetBankClosingBalanceQuery(selectedItem?.bankDetails, {
    skip: !selectedItem?.bankDetails || !isModalOpen,
  });

  const [updateReconciliation, { isLoading: isSaving }] =
    useUpdateReconciliationMutation();

  // Bank Stats
  const bankSpecificStats = useMemo(() => {
    const bankItems = reconciliationData.filter(item => item.bankDetails === selectedBank);
    const totalPaid = bankItems.reduce((sum, item) => {
      const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);
    const currentE3 = Number(mainBankData?.bankClosingBalance?.replace(/[₹,]/g, "") || 0);
    return {
      totalPaid,
      count: bankItems.length,
      finalProjected: currentE3 - totalPaid,
    };
  }, [selectedBank, reconciliationData, mainBankData]);

  const totalGlobalAmount = reconciliationData.reduce((sum, item) => {
    const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Main Filtering Logic
  useEffect(() => {
    if (!selectedBank) {
      setFilteredData([]);
      return;
    }

    let data = reconciliationData.filter(item => item.bankDetails === selectedBank);

    // Date Filter
    if (filterFromDate || filterToDate) {
      if (filterFromDate) {
        const from = parseDate(filterFromDate);
        if (from) {
          data = data.filter(item => {
            const billDate = parseDate(item.paymentDate);
            return billDate && billDate >= from;
          });
        }
      }
      if (filterToDate) {
        const to = parseDate(filterToDate);
        if (to) {
          to.setHours(23, 59, 59, 999);
          data = data.filter(item => {
            const billDate = parseDate(item.paymentDate);
            return billDate && billDate <= to;
          });
        }
      }
    }

    // Search Filter
    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase();
      data = data.filter(item => {
        return (
          (item.uid?.toLowerCase().includes(term)) ||
          (item.contractorName?.toLowerCase().includes(term)) ||
          (item.bankDetails?.toLowerCase().includes(term)) ||
          (item.paymentDetails?.toLowerCase().includes(term)) ||
          (item.paymentMode?.toLowerCase().includes(term)) ||
          (item.ExpHead?.toLowerCase().includes(term)) ||
          (item.paymentDate?.toLowerCase().includes(term)) ||
          (item.timestamp?.toLowerCase().includes(term)) ||
          (item.planned2?.toLowerCase().includes(term)) ||
          (item.paidAmount?.replace(/[₹,]/g, "").includes(term))
        );
      });
    }

    setFilteredData(data);
  }, [
    selectedBank,
    reconciliationData,
    debouncedSearchTerm,
    filterFromDate,
    filterToDate,
  ]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditForm({
      BANK_CLOSING_BALANCE: "",
      Remark: item.Remark || "",
      Status: item.Status || "--- Select ----",
    });
    setIsModalOpen(true);
  };

  // Modal auto-calculate balance
  useEffect(() => {
    if (isModalOpen && selectedItem && modalBankData?.bankClosingBalance) {
      const originalBalance = Number(modalBankData.bankClosingBalance.replace(/[₹,]/g, ""));
      const paidAmount = Number(selectedItem.paidAmount.replace(/[₹,]/g, ""));
      const remaining = (originalBalance - paidAmount).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      });
      setEditForm(prev => ({ ...prev, BANK_CLOSING_BALANCE: `₹${remaining}` }));
    }
  }, [modalBankData, isModalBankLoading, isModalOpen, selectedItem]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveReconciliation = async (e) => {
    e.preventDefault();
    const payload = {
      paymentDetails: selectedItem.paymentDetails.trim(),
      bankClosingBalanceAfterPayment: editForm.BANK_CLOSING_BALANCE.replace("₹", "").trim(),
      status: editForm.Status,
      remark: editForm.Remark.trim(),
    };
    try {
      await updateReconciliation(payload).unwrap();
      refetch();
      handleModalClose();
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div className="p-10 text-center font-bold">Loading...</div>;

  return (
    <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border">
      <div className="max-w-full mx-auto space-y-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Payment Reconciliation</h1>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-blue-600 p-4 rounded-xl text-white shadow-md">
            <p className="text-[10px] font-bold opacity-80 uppercase">Total All Bank Amount</p>
            <p className="text-xl font-black">₹{totalGlobalAmount.toLocaleString("en-IN")}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border-l-4 border-yellow-400 shadow-sm">
            <p className="text-gray-400 text-[10px] font-bold uppercase">Pending Entries</p>
            <p className="text-xl font-black text-gray-800">{reconciliationData.length}</p>
          </div>
        </div>

        {/* Bank Selector */}
        <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full md:max-w-xs p-2 bg-gray-50 border rounded-lg font-bold text-sm outline-none focus:border-blue-500"
          >
            <option value="">--- Select Bank Account ---</option>
            {uniqueBanks.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        {selectedBank && (
          <div className="space-y-4 max-w-full">
            {/* Bank Summary */}
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
              <h2 className="text-sm font-bold text-amber-800 mb-3 flex items-start gap-2 break-words">
                <Building className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                <span className="flex-1">Records for: {selectedBank}</span>
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="bg-white p-3 rounded-lg border border-blue-100">
                  <p className="text-[9px] font-bold text-blue-400 uppercase">Balance</p>
                  <p className="text-sm font-black text-blue-900 truncate">
                    {isMainBankLoading ? "..." : `₹${mainBankData?.bankClosingBalance || "0"}`}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-yellow-100">
                  <p className="text-[9px] font-bold text-yellow-600 uppercase">Pending</p>
                  <p className="text-sm font-black text-gray-800">{bankSpecificStats.count}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-red-100">
                  <p className="text-[9px] font-bold text-red-500 uppercase">To Deduct</p>
                  <p className="text-sm font-black text-red-600 truncate">
                    ₹{bankSpecificStats.totalPaid.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-green-600 p-3 rounded-lg shadow-sm">
                  <p className="text-[9px] font-bold text-green-100 uppercase">Final Bal.</p>
                  <p className="text-sm font-black text-white truncate">
                    ₹{bankSpecificStats.finalProjected.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by UID, Contractor, Amount, Date, Bank..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">From Payment Date</label>
                  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">To Payment Date</label>
                  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setFilterFromDate(fromDate);
                      setFilterToDate(toDate);
                    }}
                    className="w-full px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700"
                  >
                    Apply Date Filter
                  </button>
                </div>
              </div>

              {(searchTerm || filterFromDate || filterToDate) && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFromDate("");
                      setToDate("");
                      setFilterFromDate("");
                      setFilterToDate("");
                    }}
                    className="text-sm text-red-600 underline hover:text-red-800"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Table - Updated Headers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-800 text-white">
                    <tr>
                      {[
                        "UID",
                        "Timestamp",
                        "Particulars",         // ← Contractor की जगह
                        "Paid Amount",
                        "Bank",
                        "Mode",
                        "Payment Details",     // ← Details की जगह
                        "Payment Date",        // ← Bill Date की जगह
                        "Exp Head",
                        "Planned 2",
                        "Actions"
                      ].map(h => (
                        <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase whitespace-normal">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="px-3 py-8 text-center text-gray-500">
                          No data found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map(item => (
                        <tr key={item.uid || item.paymentDetails} className="hover:bg-gray-50">
                          <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.timestamp}</td>
                          <td className="px-3 py-3 text-[11px] font-bold">{item.uid}</td>
                          <td className="px-3 py-3 text-[11px]">{item.contractorName}</td> {/* Particulars में contractorName दिख रहा है */}
                          <td className="px-3 py-3 text-[11px] font-black text-blue-600">₹{item.paidAmount}</td>
                          <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">{item.bankDetails || "-"}</td>
                          <td className="px-3 py-3 text-[11px]">{item.paymentMode}</td>
                          <td className="px-3 py-3 text-[11px] break-words max-w-xs">{item.paymentDetails}</td>
                          <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.paymentDate}</td>
                          <td className="px-3 py-3 text-[11px]">{item.ExpHead}</td>
                          <td className="px-3 py-3 text-[11px] whitespace-nowrap">{item.planned2}</td>
                          <td className="px-3 py-3">
                            <button onClick={() => handleEditClick(item)} className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition-colors">
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-[999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
              <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
                <h2 className="text-sm font-bold">Reconcile Transaction</h2>
                <button onClick={handleModalClose}><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-gray-50 rounded border">
                    <p className="text-[8px] text-gray-400 uppercase font-bold">Bank</p>
                    <p className="text-[10px] font-bold truncate">{selectedItem.bankDetails}</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-[8px] text-green-600 uppercase font-bold">E3 Bal.</p>
                    <p className="text-sm font-black text-green-700">
                      {isModalBankLoading ? "..." : `₹${modalBankData.bankClosingBalance || "0"}`}
                    </p>
                  </div>
                  <div className="p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-[8px] text-red-600 uppercase font-bold">Paid</p>
                    <p className="text-sm font-black text-red-700">₹{selectedItem.paidAmount}</p>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Auto-Calculated Balance
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={editForm.BANK_CLOSING_BALANCE}
                    className="w-full p-3 bg-blue-50 border rounded-xl font-black text-blue-700 text-lg shadow-inner mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Remark</label>
                    <textarea
                      value={editForm.Remark}
                      onChange={(e) => setEditForm({ ...editForm, Remark: e.target.value })}
                      className="w-full p-2 border rounded-lg text-xs"
                      rows="2"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                    <select
                      value={editForm.Status}
                      onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
                      className="w-full p-2 border rounded-lg font-bold text-xs"
                    >
                      <option value=" ">----- Select----</option>
                      <option value="Done">Done</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    onClick={handleModalClose}
                    className="px-4 py-2 font-bold text-gray-400 text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveReconciliation}
                    disabled={isSaving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase hover:bg-blue-700"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reconciliation;