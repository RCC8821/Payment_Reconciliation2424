

// import React, { useState, useEffect, useMemo } from "react";
// import {
//   useGetPaymentReconciliationQuery,
//   useGetBankClosingBalanceQuery,
//   useLazyGetBankClosingBalanceQuery,
//   useUpdateReconciliationMutation,
// } from "../../features/Payment/PaymentSlice";
// import { X, Building, Search, FileText, CheckCircle, AlertCircle } from "lucide-react";
// import { useDispatch } from "react-redux";
// import { PaymentSlice } from "../../features/Payment/PaymentSlice";

// const Reconciliation = () => {
//   const dispatch = useDispatch();
//   const [triggerBankBalance] = useLazyGetBankClosingBalanceQuery();

//   const {
//     data: reconciliationData = [],
//     isLoading,
//   } = useGetPaymentReconciliationQuery();

//   // Modal ke liye new states
//   const [selectedBank, setSelectedBank] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [filterFromDate, setFilterFromDate] = useState("");
//   const [filterToDate, setFilterToDate] = useState("");
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  
//   // NEW STATES FOR FEEDBACK
//   const [editForm, setEditForm] = useState({
//     BANK_CLOSING_BALANCE: "",
//     Remark: "",
//     Status: "---- Select ----- ",
//   });
//   const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'success', 'error'

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

//   const uniqueBanks = useMemo(() => {
//     return [...new Set(reconciliationData.map(item => item.bankDetails).filter(Boolean))];
//   }, [reconciliationData]);

//   const { 
//     data: mainBankData = {}, 
//     isLoading: isMainBankLoading 
//   } = useGetBankClosingBalanceQuery(selectedBank, { skip: !selectedBank });

//   const { 
//     data: modalBankData = {}, 
//     isLoading: isModalBankLoading 
//   } = useGetBankClosingBalanceQuery(selectedItem?.bankDetails, {
//     skip: !selectedItem?.bankDetails || !isModalOpen,
//   });

//   const [updateReconciliation, { isLoading: isSaving }] = useUpdateReconciliationMutation();

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

//   // Debounce search
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm.trim());
//     }, 300);
//     return () => clearTimeout(timer);
//   }, [searchTerm]);

//   // Filtering Logic
//   useEffect(() => {
//     if (!selectedBank) {
//       setFilteredData([]);
//       return;
//     }
//     let data = reconciliationData.filter(item => item.bankDetails === selectedBank);

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
//   }, [selectedBank, reconciliationData, debouncedSearchTerm, filterFromDate, filterToDate]);

//   const handleEditClick = (item) => {
//     setSelectedItem(item);
//     setEditForm({
//       BANK_CLOSING_BALANCE: "",
//       Remark: item.Remark || "",
//       Status: item.Status || "---- Select -----",
//     });
//     setSaveStatus(''); // Reset status
//     setIsModalOpen(true);
//   };

//   // Auto calculate in modal
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
//     setSaveStatus(''); // Reset status
//     setEditForm({
//       BANK_CLOSING_BALANCE: "",
//       Remark: "",
//       Status: "---- Select ----- ",
//     });
//   };

//   // UPDATED SAVE FUNCTION WITH PERFECT FEEDBACK
//   const handleSaveReconciliation = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (editForm.Status === "---- Select -----") {
//       setSaveStatus('error');
//       setTimeout(() => setSaveStatus(''), 3000);
//       return;
//     }

//     setSaveStatus('saving');

//     const payload = {
//       paymentDetails: selectedItem.paymentDetails.trim(),
//       bankClosingBalanceAfterPayment: editForm.BANK_CLOSING_BALANCE.replace("₹", "").trim(),
//       status: editForm.Status,
//       remark: editForm.Remark.trim(),
//     };

//     try {
//       await updateReconciliation(payload).unwrap();

//       const bankName = selectedItem.bankDetails;

//       if (selectedBank && bankName === selectedBank) {
//         await triggerBankBalance(bankName, { forceRefetch: true }).unwrap();
//         await new Promise(resolve => setTimeout(resolve, 6000));
//         await triggerBankBalance(bankName, { forceRefetch: true }).unwrap();
//       }

//       dispatch(
//         PaymentSlice.util.invalidateTags([
//           { type: 'BankBalance', id: bankName }
//         ])
//       );

//       setSaveStatus('success');
      
//       // 2 second baad auto close
//       setTimeout(() => {
//         handleModalClose();
//       }, 2000);

//     } catch (error) {
//       console.error("Save failed:", error);
//       setSaveStatus('error');
//       setTimeout(() => setSaveStatus(''), 4000);
//     }
//   };

//   if (isLoading) return <div className="p-10 text-center font-bold">Loading...</div>;

//   return (
//     <div className="w-full max-w-full min-h-screen  p-2 md:p-4 overflow-x-hidden box-border mt-10">
//       <div className="max-w-full mx-auto space-y-4">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-white">Payment Reconciliation</h1>
//         </div>

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
//             {/* Bank Summary Cards - same as before */}
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

//             {/* Filters - same as before */}
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
//                   <label className="block text-xs font-medium text-gray-600 mb-1">From Payment Date</label>
//                   <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-gray-600 mb-1">To Payment Date</label>
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

//             {/* Table - same as before */}
//             <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="w-full overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead className="bg-gray-800 text-white">
//                     <tr>
//                       {[
//                         "UID",
//                         "Timestamp",
//                         "Particulars",
//                         "Paid Amount",
//                         "Bank",
//                         "Mode",
//                         "Payment Details",
//                         "Payment Date",
//                         "Exp Head",
//                         "Planned 2",
//                         "Actions"
//                       ].map(h => (
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

//         {/* UPDATED MODAL WITH PERFECT FEEDBACK */}
//         {isModalOpen && selectedItem && (
//           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-[999]">
//             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
//               <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
//                 <h2 className="text-sm font-bold">Reconcile Transaction</h2>
//                 <button onClick={handleModalClose} className="hover:bg-gray-700 p-1 rounded">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
              
//               <div className="p-4 overflow-y-auto space-y-4">
//                 {/* STATUS MESSAGE - NEW */}
//                 {saveStatus === 'success' && (
//                   <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
//                     <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
//                     <span className="font-bold text-green-700 text-sm">Successfully Saved! Closing in 2 seconds...</span>
//                   </div>
//                 )}
                
//                 {saveStatus === 'error' && (
//                   <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
//                     <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
//                     <span className="font-bold text-red-700 text-sm">Save failed! Please try again.</span>
//                   </div>
//                 )}

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
//                       disabled={saveStatus === 'saving' || saveStatus === 'success'}
//                     />
//                   </div>
//                   <div>
//                     <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
//                     <select
//                       value={editForm.Status}
//                       onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
//                       className="w-full p-2 border rounded-lg font-bold text-xs"
//                       disabled={saveStatus === 'saving' || saveStatus === 'success'}
//                     >
//                       <option value="---- Select ----- ">----- Select -----</option>
//                       <option value="Done">Done</option>
//                       <option value="Cancel">Cancel</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* UPDATED BUTTON SECTION */}
//                 <div className="pt-4 border-t flex justify-end gap-3">
//                   <button
//                     onClick={handleModalClose}
//                     disabled={saveStatus === 'saving'}
//                     className="px-4 py-2 font-bold text-gray-400 text-xs uppercase hover:text-gray-600 disabled:opacity-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleSaveReconciliation}
//                     disabled={saveStatus !== '' || isSaving}
//                     className={`px-6 py-2 rounded-lg font-bold text-xs uppercase transition-all flex items-center gap-1 ${
//                       saveStatus === 'success'
//                         ? 'bg-green-600 text-white shadow-lg shadow-green-300'
//                         : saveStatus === 'saving' || isSaving
//                         ? 'bg-blue-400 text-white cursor-not-allowed shadow-lg shadow-blue-300'
//                         : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-300'
//                     }`}
//                   >
//                     {saveStatus === 'success' && <CheckCircle className="w-4 h-4" />}
//                     {saveStatus === 'saving' || isSaving ? (
//                       <>
//                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                         Saving...
//                       </>
//                     ) : (
//                       'Save'
//                     )}
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
  useLazyGetBankClosingBalanceQuery,
  useUpdateReconciliationMutation,
} from "../../features/Payment/PaymentSlice";
import { X, Building, Search, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { PaymentSlice } from "../../features/Payment/PaymentSlice";

const Reconciliation = () => {
  const dispatch = useDispatch();
  const [triggerBankBalance] = useLazyGetBankClosingBalanceQuery();

  const {
    data: reconciliationData = [],
    isLoading,
  } = useGetPaymentReconciliationQuery();

  // Modal ke liye new states
  const [selectedBank, setSelectedBank] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // NEW STATES FOR FEEDBACK
  const [editForm, setEditForm] = useState({
    BANK_CLOSING_BALANCE: "",
    Remark: "",
    Status: "---- Select ----- ",
  });
  const [saveStatus, setSaveStatus] = useState(''); // '', 'saving', 'success', 'error'

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

  const uniqueBanks = useMemo(() => {
    return [...new Set(reconciliationData.map(item => item.bankDetails).filter(Boolean))];
  }, [reconciliationData]);

  const { 
    data: mainBankData = {}, 
    isLoading: isMainBankLoading 
  } = useGetBankClosingBalanceQuery(selectedBank, { skip: !selectedBank });

  const { 
    data: modalBankData = {}, 
    isLoading: isModalBankLoading 
  } = useGetBankClosingBalanceQuery(selectedItem?.bankDetails, {
    skip: !selectedItem?.bankDetails || !isModalOpen,
  });

  const [updateReconciliation, { isLoading: isSaving }] = useUpdateReconciliationMutation();

  // ────────────────────────────────────────────────
  // FIXED: bankSpecificStats is now always defined (safe default when no bank selected)
  // ────────────────────────────────────────────────
  const bankSpecificStats = useMemo(() => {
    if (!selectedBank) {
      return {
        totalPaid: 0,
        count: 0,
        finalProjected: 0,
      };
    }

    const bankItems = reconciliationData.filter(item => item.bankDetails === selectedBank);
    const totalPaid = bankItems.reduce((sum, item) => {
      const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
      return sum + (isNaN(amt) ? 0 : amt);
    }, 0);

    const currentE3 = Number(mainBankData?.bankClosingBalance?.replace(/[₹,]/g, "") || 0);
    const finalProjected = currentE3 - totalPaid;

    return {
      totalPaid,
      count: bankItems.length,
      finalProjected,
    };
  }, [selectedBank, reconciliationData, mainBankData]);

  const totalGlobalAmount = reconciliationData.reduce((sum, item) => {
    const amt = Number(item.paidAmount?.replace(/[₹,]/g, "") || 0);
    return sum + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtering Logic
  useEffect(() => {
    if (!selectedBank) {
      setFilteredData([]);
      return;
    }
    let data = reconciliationData.filter(item => item.bankDetails === selectedBank);

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
  }, [selectedBank, reconciliationData, debouncedSearchTerm, filterFromDate, filterToDate]);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditForm({
      BANK_CLOSING_BALANCE: "",
      Remark: item.Remark || "",
      Status: item.Status || "---- Select -----",
    });
    setSaveStatus(''); // Reset status
    setIsModalOpen(true);
  };

  // Auto calculate in modal
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
    setSaveStatus(''); // Reset status
    setEditForm({
      BANK_CLOSING_BALANCE: "",
      Remark: "",
      Status: "---- Select ----- ",
    });
  };

  // UPDATED SAVE FUNCTION WITH PERFECT FEEDBACK
  const handleSaveReconciliation = async (e) => {
    e.preventDefault();
    
    // Validation
    if (editForm.Status === "---- Select -----") {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
      return;
    }

    setSaveStatus('saving');

    const payload = {
      paymentDetails: selectedItem.paymentDetails.trim(),
      bankClosingBalanceAfterPayment: editForm.BANK_CLOSING_BALANCE.replace("₹", "").trim(),
      status: editForm.Status,
      remark: editForm.Remark.trim(),
    };

    try {
      await updateReconciliation(payload).unwrap();

      const bankName = selectedItem.bankDetails;

      if (selectedBank && bankName === selectedBank) {
        await triggerBankBalance(bankName, { forceRefetch: true }).unwrap();
        await new Promise(resolve => setTimeout(resolve, 6000));
        await triggerBankBalance(bankName, { forceRefetch: true }).unwrap();
      }

      dispatch(
        PaymentSlice.util.invalidateTags([
          { type: 'BankBalance', id: bankName }
        ])
      );

      setSaveStatus('success');
      
      // 2 second baad auto close
      setTimeout(() => {
        handleModalClose();
      }, 2000);

    } catch (error) {
      console.error("Save failed:", error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 4000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-4 text-lg text-indigo-300">Loading reconciliation data...</span>
      </div>
    );
  }

  return (
    <div className=" space-y-6  md:p-6 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-4 border-b border-indigo-700/40">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
          Payment Reconciliation
          <span className="block text-xl font-medium text-gray-400 mt-1">
            Bank Wise Matching
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="px-5 py-2.5 rounded-full font-semibold text-sm bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md">
            {reconciliationData.length} Entries
          </div>
        </div>
      </div>

      {/* Bank Selection */}
      <div className="bg-black/30 backdrop-blur-md rounded-xl border border-indigo-700/40 p-4">
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="w-full md:w-96 bg-gray-900/70 text-gray-200 border border-indigo-600/50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">─── Select Bank Account ───</option>
          {uniqueBanks.map((bank) => (
            <option key={bank} value={bank}>
              {bank}
            </option>
          ))}
        </select>
      </div>

      {selectedBank && (
        <div className="space-y-6">
          {/* Bank Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-gray-900 to-indigo-950/60 p-5 rounded-xl border border-indigo-700/30 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-indigo-300 mb-1">Current Balance</p>
              <p className="text-2xl font-bold text-white">
                {isMainBankLoading ? "..." : `₹${mainBankData?.bankClosingBalance || "0"}`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950/60 p-5 rounded-xl border border-indigo-700/30 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-indigo-300 mb-1">Pending Entries</p>
              <p className="text-2xl font-bold text-amber-400">{bankSpecificStats.count}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-indigo-950/60 p-5 rounded-xl border border-indigo-700/30 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-indigo-300 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-red-400">
                ₹{bankSpecificStats.totalPaid.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/40 to-teal-900/40 p-5 rounded-xl border border-emerald-700/40 shadow-lg">
              <p className="text-xs uppercase tracking-wide text-emerald-200 mb-1">Projected Balance</p>
              <p className="text-2xl font-bold text-emerald-300">
                ₹{bankSpecificStats.finalProjected.toLocaleString("en-IN")}
              </p>
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
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/70 border border-indigo-600/50 rounded-xl text-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">From Payment Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/70 border border-indigo-600/50 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">To Payment Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-900/70 border border-indigo-600/50 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilterFromDate(fromDate);
                    setFilterToDate(toDate);
                  }}
                  className="w-full px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-md transition-all"
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
                  className="text-sm text-red-400 hover:text-red-300 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-indigo-700/40 bg-black/30 backdrop-blur-md shadow-2xl">
            <table className="w-full min-w-max border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
                  {[
                    "Timestamp",
                    "UID",
                    "Particulars",
                    "Paid Amount",
                    "Bank",
                    "Mode",
                    "Payment Details",
                    "Payment Date",
                    "Exp Head",
                    "Planned 2",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-800/50 bg-gray-900/20">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-6 py-12 text-center text-gray-400 text-lg">
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr
                      key={item.uid || item.paymentDetails}
                      className="hover:bg-indigo-950/30 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 text-sm text-gray-300">{item.timestamp || "-"}</td>
                      <td className="px-5 py-4 text-sm font-medium text-indigo-300">{item.uid}</td>
                      <td className="px-5 py-4 text-sm text-gray-200 max-w-xs truncate">
                        {item.contractorName || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-emerald-400">
                        ₹{item.paidAmount || "0"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300 break-words">
                        {item.bankDetails || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{item.paymentMode || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-200 max-w-md truncate">
                        {item.paymentDetails || "-"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-300">{item.paymentDate || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-300">{item.ExpHead || "-"}</td>
                      <td className="px-5 py-4 text-sm text-gray-300">{item.planned2 || "-"}</td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                        >
                          <FileText className="w-4 h-4" />
                          Reconcile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-700/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 flex justify-between items-center border-b border-indigo-700/50">
              <h3 className="text-xl font-bold text-white">Reconcile Transaction</h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status feedback */}
              {saveStatus === "success" && (
                <div className="flex items-center gap-3 bg-emerald-900/40 border border-emerald-700/50 rounded-xl p-4 text-emerald-300">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Successfully reconciled!</span>
                </div>
              )}
              {saveStatus === "error" && (
                <div className="flex items-center gap-3 bg-red-900/40 border border-red-700/50 rounded-xl p-4 text-red-300">
                  <AlertCircle className="w-6 h-6" />
                  <span className="font-medium">Failed to save. Please try again.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Bank</p>
                  <p className="text-lg font-medium text-white">{selectedItem.bankDetails}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">E3 Balance</p>
                  <p className="text-lg font-bold text-cyan-400">
                    {isModalBankLoading ? "..." : `₹${modalBankData.bankClosingBalance || "0"}`}
                  </p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Paid Amount</p>
                  <p className="text-lg font-bold text-red-400">₹{selectedItem.paidAmount}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Auto-calculated Closing Balance
                </label>
                <input
                  type="text"
                  readOnly
                  value={editForm.BANK_CLOSING_BALANCE}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-indigo-600/50 rounded-lg text-emerald-300 font-bold text-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Remark</label>
                  <textarea
                    value={editForm.Remark}
                    onChange={(e) => setEditForm({ ...editForm, Remark: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Add remark if needed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reconciliation Status
                  </label>
                  <select
                    value={editForm.Status}
                    onChange={(e) => setEditForm({ ...editForm, Status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="---- Select ----- ">──── Select Status ────</option>
                    <option value="Done">Done</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                <button
                  onClick={handleModalClose}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReconciliation}
                  disabled={saveStatus === "saving" || isSaving || saveStatus === "success"}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    saveStatus === "success"
                      ? "bg-emerald-700 text-white shadow-lg shadow-emerald-900/50"
                      : saveStatus === "saving" || isSaving
                      ? "bg-indigo-700/70 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                  }`}
                >
                  {saveStatus === "saving" || isSaving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === "success" ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Saved
                    </>
                  ) : (
                    "Save Reconciliation"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reconciliation;