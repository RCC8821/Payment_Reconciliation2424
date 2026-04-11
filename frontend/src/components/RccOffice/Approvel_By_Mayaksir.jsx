
// import React, { useState, useEffect } from "react";
// import {
//   useGetPendingOfficeExpensesLevel2Query,
//   useUpdateOfficeExpenseFinalApprovalMutation,
// } from '../../features/RCC_Office_Expenses/approval2ApiSlice';
// import { Image as LucideImage, Loader2, CheckCircle, Edit3, X, Sun, Moon } from 'lucide-react';

// function Approvel_By_Mayaksir() {
//   // Theme handling
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem('isDarkMode');
//     return saved !== null ? JSON.parse(saved) : true; // default dark
//   });

//   // Sync theme with localStorage
//   useEffect(() => {
//     localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   const toggleTheme = () => {
//     setIsDarkMode(prev => !prev);
//   };

//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetPendingOfficeExpensesLevel2Query();

//   const [updateFinalApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseFinalApprovalMutation();

//   const expenses = response?.data || [];
//   const totalRecords = response?.totalRecords || expenses.length;

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [formData, setFormData] = useState({
//     STATUS_3: '',
//     FINAL_AMOUNT_3: '',
//     PAYMENT_MODE_3: '',
//     REMARK_3: '',
//   });

//   const openModal = (expense) => {
//     console.log("Opening modal with expense:", expense);
//     setSelectedExpense(expense);
//     setFormData({
//       STATUS_3: '',
//       FINAL_AMOUNT_3: expense.Total_Amount || expense.REVISED_AMOUNT_2 || expense.Amount || '',
//       PAYMENT_MODE_3: '',
//       REMARK_3: '',
//     });
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedExpense(null);
//     setFormData({
//       STATUS_3: '',
//       FINAL_AMOUNT_3: '',
//       PAYMENT_MODE_3: '',
//       REMARK_3: '',
//     });
//   };

//   const handleSubmit = async () => {
//     if (!formData.STATUS_3) {
//       alert('Status select karo (Done) ❌');
//       return;
//     }

//     if (!selectedExpense?.Office_Bill_No?.trim()) {
//       alert('Bill No nahi mila! ❌');
//       console.log("selectedExpense:", selectedExpense);
//       return;
//     }

//     if (formData.FINAL_AMOUNT_3 !== '' && isNaN(Number(formData.FINAL_AMOUNT_3))) {
//       alert('Final amount valid number daalo ❌');
//       return;
//     }

//     console.log("Form data BEFORE payload:", formData);

//     const payload = {
//       uid: selectedExpense.Office_Bill_No.trim(),
//       STATUS_3: formData.STATUS_3,
//       FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3 ? Number(formData.FINAL_AMOUNT_3) : null,
//       PAYMENT_MODE_3: formData.PAYMENT_MODE_3 || null,
//       REMARK_3: formData.REMARK_3.trim() || null,
//     };

//     console.log("Sending this payload to backend:", payload);

//     try {
//       await updateFinalApproval(payload).unwrap();
//       alert('✅ Final approval submit ho gaya!');
//       closeModal();
//       refetch();
//     } catch (err) {
//       console.error('API error:', err);
//       alert('❌ Submit failed: ' + (err?.data?.message || err?.message || 'Unknown error'));
//     }
//   };

//   // ────────────────────────────────────────────────
//   // Loading / Error / Empty states
//   // ────────────────────────────────────────────────

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${
//         isDarkMode 
//           ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
//           : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
//       }`}>
//         <div className="flex flex-col items-center space-y-5">
//           <Loader2 className={`w-16 h-16 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} animate-spin`} />
//           <p className={`text-xl font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
//             Loading pending final approvals...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center p-6 ${
//         isDarkMode 
//           ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
//           : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
//       }`}>
//         <div className="text-center max-w-md">
//           <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>
//             Data loading failed
//           </h2>
//           <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
//             {error?.data?.message || 'Cannot load pending records'}
//           </p>
//           <button
//             onClick={() => window.location.reload()}
//             className={`px-8 py-3 rounded-xl font-medium shadow-lg transition-all ${
//               isDarkMode 
//                 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
//                 : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
//             }`}
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (expenses.length === 0) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center p-6 ${
//         isDarkMode 
//           ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
//           : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
//       }`}>
//         <div className="text-center max-w-md">
//           <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'} mb-4`}>
//             No Pending Data
//           </h2>
//           <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
//             All records processed or no expenses waiting for Level-2 (Mayank Sir) approval.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ────────────────────────────────────────────────
//   // Main UI
//   // ────────────────────────────────────────────────

//   return (
//     <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full ${
//       isDarkMode 
//         ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
//         : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
//     }`}>

//       {/* Background effects - only in dark mode */}
//       {isDarkMode && (
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
//           <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
//         </div>
//       )}

//       <div className="relative z-10 w-full space-y-8 lg:space-y-10">

//         {/* Header + Theme Toggle */}
//         <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 ${
//           isDarkMode 
//             ? 'bg-black/50 backdrop-blur-xl border-indigo-700/50' 
//             : 'bg-white/80 backdrop-blur-md border-gray-200'
//         }`}>
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             <div>
//               <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
//                 isDarkMode 
//                   ? 'from-indigo-200 to-purple-200' 
//                   : 'from-indigo-600 to-purple-600'
//               }`}>
//                 Final Approval – Mayank Sir
//               </h1>
//               <p className={`mt-2 text-base sm:text-lg lg:text-xl ${
//                 isDarkMode ? 'text-indigo-300/90' : 'text-indigo-700/90'
//               }`}>
//                 Level 2 • {totalRecords} pending record{totalRecords !== 1 ? 's' : ''}
//               </p>
//             </div>

//             <div className="flex items-center gap-4">
//               <button
//                 onClick={toggleTheme}
//                 className={`p-3 rounded-xl transition-all ${
//                   isDarkMode 
//                     ? 'bg-purple-900/50 hover:bg-purple-800/50 text-yellow-300' 
//                     : 'bg-gray-200 hover:bg-gray-300 text-indigo-700'
//                 }`}
//                 title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//               >
//                 {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
//               </button>

//               <div className={`px-6 py-4 lg:py-6 rounded-2xl border shadow-lg min-w-[140px] lg:min-w-[180px] text-center ${
//                 isDarkMode 
//                   ? 'bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-600/40' 
//                   : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300'
//               }`}>
//                 <p className={`text-sm uppercase tracking-wider font-semibold mb-1 ${
//                   isDarkMode ? 'text-purple-200' : 'text-purple-800'
//                 }`}>Pending</p>
//                 <p className={`text-3xl lg:text-4xl font-black ${
//                   isDarkMode ? 'text-white' : 'text-indigo-800'
//                 }`}>{totalRecords}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className={`overflow-x-auto rounded-2xl border shadow-2xl w-full ${
//           isDarkMode 
//             ? 'border-indigo-700/50 bg-black/40 backdrop-blur-md' 
//             : 'border-gray-300 bg-white/70 backdrop-blur-md'
//         }`}>
//           <table className="w-full min-w-[1400px] border-collapse">
//             <thead>
//               <tr className={`text-white ${
//                 isDarkMode 
//                   ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950' 
//                   : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
//               }`}>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Timestamp</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill No</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Office</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Payee</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Head</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Subhead</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Department</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Approver</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Raised By</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Amount</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill</th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Action</th>
//               </tr>
//             </thead>

//           <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800/60 bg-gray-950/10' : 'divide-gray-200 bg-white/50'}`}>
//   {expenses.map((item) => {
//     // ← यहाँ curly braces {} इस्तेमाल करें और return करें

//     const rawUrl = item.Bill_Photo_1 || item.Bill_Photo || '';
//     const photoUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';

//     const hasValidPhoto =
//       photoUrl.length > 0 &&
//       photoUrl !== 'No file uploaded' &&
//       photoUrl !== 'null' &&
//       photoUrl !== 'undefined' &&
//       !photoUrl.toLowerCase().includes('no file') &&
//       photoUrl.startsWith('http');

//     return (
//       <tr
//         key={item.Office_Bill_No || item.uid || Math.random()} // Math.random() fallback के लिए
//         className={`hover transition-colors duration-150 ${
//           isDarkMode ? 'hover:bg-indigo-950/40' : 'hover:bg-indigo-50/80'
//         }`}
//       >
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           {item.Timestamp || '-'}
//         </td>
//         <td
//           className={`px-4 py-5 lg:px-6 lg:py-6 font-medium font-bold text-base ${
//             isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
//           }`}
//         >
//           {item.Office_Bill_No || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//           {item.OFFICE_NAME_1 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//           {item.PAYEE_NAME_1 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//           {item.EXPENSES_HEAD_1 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//           {item.EXPENSES_SUBHEAD_1 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           {item.DEPARTMENT_1 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           {item.APPROVAL_DOER || item.APPROVAL_DOER_2 || '-'}
//         </td>
//         <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//           {item.RAISED_BY_1 || '-'}
//         </td>
//         <td
//           className={`px-4 py-5 lg:px-6 lg:py-6 font-medium text-base ${
//             isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//           }`}
//         >
//           ₹{(item.Total_Amount || item.Amount || 0).toLocaleString('en-IN')}
//         </td>

//         {/* Bill Photo Column */}
//         <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//           {hasValidPhoto ? (
//             <a
//               href={photoUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               onClick={(e) => e.stopPropagation()}
//               className={`inline-flex items-center justify-center p-3 rounded-lg hover:scale-105 transition cursor-pointer ${
//                 isDarkMode
//                   ? 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70'
//                   : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
//               }`}
//               title="View bill photo"
//             >
//               <LucideImage className="w-6 h-6" />
//             </a>
//           ) : (
//             <span
//               className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-base font-medium select-none pointer-events-none`}
//               onClick={(e) => {
//                 e.preventDefault();
//                 e.stopPropagation();
//               }}
//             >
//               N/A
//             </span>
//           )}
//         </td>

//         <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//           <button
//             onClick={() => openModal(item)}
//             className={`px-5 py-3 lg:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto min-w-[140px] lg:min-w-[160px] text-base lg:text-lg ${
//               isDarkMode
//                 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
//                 : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
//             }`}
//             title={`Review ${item.Office_Bill_No || 'record'}`}
//           >
//             <Edit3 className="w-5 h-5" />
//             Review
//           </button>
//         </td>
//       </tr>
//     );
//   })}
// </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ────────────────────────────────────────────────
//            MODAL - Dark & Light both supported
//       ──────────────────────────────────────────────── */}
//       {isModalOpen && selectedExpense && (
//         <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
//           <div className={`rounded-2xl shadow-2xl w-full max-w-full sm:max-w-3xl lg:max-w-5xl border max-h-[96vh] flex flex-col overflow-hidden ${
//             isDarkMode 
//               ? 'bg-gradient-to-b from-gray-900 to-black border-indigo-700/50' 
//               : 'bg-gradient-to-b from-white to-gray-100 border-gray-300'
//           }`}>

//             {/* Header */}
//             <div className={`p-5 sm:p-6 lg:p-8 flex justify-between items-center border-b shrink-0 ${
//               isDarkMode 
//                 ? 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60' 
//                 : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300'
//             }`}>
//               <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${
//                 isDarkMode ? 'text-white' : 'text-indigo-800'
//               }`}>
//                 Final Approval – {selectedExpense.Office_Bill_No}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className={`p-2 rounded-lg transition shrink-0 ${
//                   isDarkMode 
//                     ? 'text-gray-400 hover:text-white hover:bg-gray-800/80' 
//                     : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
//                 }`}
//               >
//                 <X className="w-7 h-7 sm:w-8 sm:h-8" />
//               </button>
//             </div>

//             {/* Scrollable Content */}
//             <div className={`flex-1 overflow-y-auto p-5 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 scrollbar-thin ${
//               isDarkMode 
//                 ? 'scrollbar-thumb-indigo-600 scrollbar-track-gray-900/40' 
//                 : 'scrollbar-thumb-indigo-400 scrollbar-track-gray-200'
//             }`}>
              
//               {/* Bill Info */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
//                 <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border ${
//                   isDarkMode 
//                     ? 'bg-gray-900/60 border-gray-800/50' 
//                     : 'bg-white border-gray-200'
//                 }`}>
//                   <p className={`text-xs sm:text-sm lg:text-base uppercase mb-1 sm:mb-2 ${
//                     isDarkMode ? 'text-gray-400' : 'text-gray-600'
//                   }`}>Bill No</p>
//                   <p className={`text-lg sm:text-xl lg:text-2xl font-bold break-all ${
//                     isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
//                   }`}>
//                     {selectedExpense.Office_Bill_No || '—'}
//                   </p>
//                 </div>
//                 <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border ${
//                   isDarkMode 
//                     ? 'bg-gray-900/60 border-gray-800/50' 
//                     : 'bg-white border-gray-200'
//                 }`}>
//                   <p className={`text-xs sm:text-sm lg:text-base uppercase mb-1 sm:mb-2 ${
//                     isDarkMode ? 'text-gray-400' : 'text-gray-600'
//                   }`}>Original Amount</p>
//                   <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${
//                     isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
//                   }`}>
//                     ₹{(selectedExpense.Total_Amount || selectedExpense.Amount || '0').toLocaleString('en-IN')}
//                   </p>
//                 </div>
//               </div>

//               {/* Final Status */}
//               <div className="space-y-3">
//                 <label className={`block text-base sm:text-lg font-medium ${
//                   isDarkMode ? 'text-gray-200' : 'text-gray-800'
//                 }`}>
//                   Final Status <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={formData.STATUS_3}
//                   onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
//                   className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
//                     isDarkMode
//                       ? formData.STATUS_3
//                         ? 'bg-gray-800 border-gray-700 focus:ring-emerald-500 text-white border-emerald-500/50'
//                         : 'bg-gray-800/70 border-red-500/50 focus:ring-red-500 text-white'
//                       : formData.STATUS_3
//                         ? 'bg-white border-gray-300 focus:ring-emerald-500 text-gray-900 border-emerald-500'
//                         : 'bg-white border-red-300 focus:ring-red-500 text-gray-900 border-red-500'
//                   }`}
//                 >
//                   <option value="">----- Select ----- *</option>
//                   <option value="Done">✅ Done</option>
//                   <option value="Cancel">Cancel</option>
//                 </select>
//               </div>

//               {/* Final Amount */}
//               <div className="space-y-3">
//                 <label className={`block text-base sm:text-lg font-medium ${
//                   isDarkMode ? 'text-gray-200' : 'text-gray-800'
//                 }`}>Final Amount (Optional)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   value={formData.FINAL_AMOUNT_3}
//                   onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
//                   className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 text-base sm:text-lg ${
//                     isDarkMode
//                       ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white'
//                       : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-900'
//                   }`}
//                   placeholder="Original amount ya revised daalo"
//                 />
//               </div>

//               {/* Payment Mode */}
//               <div className="space-y-3">
//                 <label className={`block text-base sm:text-lg font-medium ${
//                   isDarkMode ? 'text-gray-200' : 'text-gray-800'
//                 }`}>
//                   Payment Mode <span className="text-yellow-400 text-xs sm:text-sm">(preferred)</span>
//                 </label>
//                 <select
//                   value={formData.PAYMENT_MODE_3 || ''}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, PAYMENT_MODE_3: e.target.value }))}
//                   className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 text-base sm:text-lg ${
//                     isDarkMode
//                       ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white'
//                       : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-900'
//                   }`}
//                 >
//                   <option value="">Select Payment Mode</option>
//                   <option value="Cash">Cash</option>
//                   <option value="Bank">Bank</option>
//                 </select>
//               </div>

//               {/* Remark */}
//               <div className="space-y-3">
//                 <label className={`block text-base sm:text-lg font-medium ${
//                   isDarkMode ? 'text-gray-200' : 'text-gray-800'
//                 }`}>Final Remark (Optional)</label>
//                 <textarea
//                   value={formData.REMARK_3}
//                   onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
//                   rows={4}
//                   className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 resize-y text-base sm:text-lg ${
//                     isDarkMode
//                       ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white'
//                       : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-900'
//                   }`}
//                   placeholder="Approval reason / rejection note / comments..."
//                 />
//               </div>

//               <div className="h-6 sm:h-8 lg:h-10"></div>
//             </div>

//             {/* Buttons */}
//             <div className={`border-t p-5 sm:p-6 lg:p-8 sticky bottom-0 z-10 ${
//               isDarkMode 
//                 ? 'bg-gradient-to-t from-black via-black/95 to-transparent border-gray-800' 
//                 : 'bg-gradient-to-t from-white via-white/95 to-transparent border-gray-200'
//             }`}>
//               <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5">
//                 <button
//                   onClick={closeModal}
//                   disabled={isUpdating}
//                   className={`px-8 py-3 sm:py-4 rounded-lg font-medium transition text-base sm:text-lg w-full sm:w-auto ${
//                     isDarkMode 
//                       ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
//                       : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
//                   }`}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isUpdating || !formData.STATUS_3}
//                   className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center gap-3 w-full sm:w-auto min-w-[200px] transition-all text-base sm:text-lg ${
//                     isUpdating || !formData.STATUS_3
//                       ? isDarkMode
//                         ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
//                         : 'bg-gray-300 text-gray-400 cursor-not-allowed border border-gray-400'
//                       : isDarkMode
//                         ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50 hover:scale-[1.02]'
//                         : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl border border-emerald-400 hover:scale-[1.02]'
//                   }`}
//                 >
//                   {isUpdating ? (
//                     <>
//                       <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
//                       Submit kar raha...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
//                       Submit Final Approval
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Approvel_By_Mayaksir;




//////

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseByOFFBILLUIDMutation,
} from '../../features/RCC_Office_Expenses/approval2ApiSlice';
import { 
  Image as LucideImage, 
  Loader2, 
  CheckCircle, 
  X, 
  Sun, 
  Moon, 
  Search, 
  ChevronDown,
  Filter,
  Package,
  Send
} from 'lucide-react';

// ✅ HELPER FUNCTION - Amount ko properly parse karega
const parseAmount = (value) => {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.toString().replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// ✅ FORMAT FUNCTION - Amount ko Indian format me show karega
const formatAmount = (value) => {
  const num = parseAmount(value);
  return num.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
};

function Approvel_By_Mayaksir() {
  // ═══════════════════════════════════════════════════════════
  // THEME HANDLING
  // ═══════════════════════════════════════════════════════════
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  // ═══════════════════════════════════════════════════════════
  // RTK QUERY HOOKS
  // ═══════════════════════════════════════════════════════════
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPendingOfficeExpensesLevel2Query();

  const [updateByOFFBILLUID, { isLoading: isUpdating }] = useUpdateOfficeExpenseByOFFBILLUIDMutation();

  const expenses = response?.data || [];
  const totalRecords = response?.totalRecords || expenses.length;

  // ═══════════════════════════════════════════════════════════
  // OFFBILLUID FILTER STATE
  // ═══════════════════════════════════════════════════════════
  const [selectedOFFBILLUID, setSelectedOFFBILLUID] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get unique OFFBILLUIDs
  const uniqueOFFBILLUIDs = useMemo(() => {
    const uids = [...new Set(expenses.map(item => item.OFFBILLUID).filter(Boolean))];
    return uids.sort();
  }, [expenses]);

  // Filter UIDs based on search
  const filteredUIDs = useMemo(() => {
    if (!searchQuery.trim()) return uniqueOFFBILLUIDs;
    return uniqueOFFBILLUIDs.filter(uid => 
      uid.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [uniqueOFFBILLUIDs, searchQuery]);

  // Filter expenses based on selected OFFBILLUID
  const filteredExpenses = useMemo(() => {
    if (!selectedOFFBILLUID) return expenses;
    return expenses.filter(item => item.OFFBILLUID === selectedOFFBILLUID);
  }, [expenses, selectedOFFBILLUID]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // MODAL / FORM STATE
  // ═══════════════════════════════════════════════════════════
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    STATUS_2: '',
    PAYMENT_MODE_3: '',
    REMARK_2: '',
  });

  // Open modal for selected OFFBILLUID group
  const openApprovalModal = () => {
    if (!selectedOFFBILLUID) {
      alert('Pehle OFFBILLUID select karo! ❌');
      return;
    }
    setFormData({
      STATUS_2: '',
      PAYMENT_MODE_3: '',
      REMARK_2: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      STATUS_2: '',
      PAYMENT_MODE_3: '',
      REMARK_2: '',
    });
  };

  // ═══════════════════════════════════════════════════════════
  // SUBMIT HANDLER - Bulk update by OFFBILLUID
  // ═══════════════════════════════════════════════════════════
  const handleSubmit = async () => {
    if (!formData.STATUS_2) {
      alert('Status select karo! ❌');
      return;
    }

    if (!selectedOFFBILLUID) {
      alert('OFFBILLUID select nahi hua! ❌');
      return;
    }

    const payload = {
      OFFBILLUID: selectedOFFBILLUID,
      STATUS_2: formData.STATUS_2,
      PAYMENT_MODE_3: formData.PAYMENT_MODE_3 || '',
      REMARK_2: formData.REMARK_2.trim() || '',
    };

    console.log("Sending payload:", payload);

    try {
      const result = await updateByOFFBILLUID(payload).unwrap();
      alert(`✅ ${result.message} - ${result.updatedRows} row(s) updated!`);
      closeModal();
      setSelectedOFFBILLUID('');
      setSearchQuery('');
      refetch();
    } catch (err) {
      console.error('API error:', err);
      alert('❌ Submit failed: ' + (err?.data?.message || err?.message || 'Unknown error'));
    }
  };

  // ✅ FIXED: Calculate total amount for selected group
  const totalAmountForSelected = useMemo(() => {
    return filteredExpenses.reduce((sum, item) => {
      const amount = parseAmount(item.Amount);
      console.log(`Item: ${item.ITEM_NAME_1}, Raw Amount: ${item.Amount}, Parsed: ${amount}`);
      return sum + amount;
    }, 0);
  }, [filteredExpenses]);

  // ✅ Calculate total amount for all expenses
  const grandTotalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => {
      return sum + parseAmount(item.Amount);
    }, 0);
  }, [expenses]);

  // ═══════════════════════════════════════════════════════════
  // LOADING STATE
  // ═══════════════════════════════════════════════════════════
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className={`w-16 h-16 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} animate-spin`} />
          <p className={`text-xl font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            Loading pending approvals...
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // ERROR STATE
  // ═══════════════════════════════════════════════════════════
  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-4`}>
            Data loading failed
          </h2>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
            {error?.data?.message || 'Cannot load pending records'}
          </p>
          <button
            onClick={() => refetch()}
            className={`px-8 py-3 rounded-xl font-medium shadow-lg transition-all ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // EMPTY STATE
  // ═══════════════════════════════════════════════════════════
  if (expenses.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'} mb-4`}>
            No Pending Data
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
            All records processed or no expenses waiting for Level-2 approval.
          </p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MAIN UI
  // ═══════════════════════════════════════════════════════════
  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full ${
      isDarkMode 
        ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>

      {/* Background effects - dark mode only */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      )}

      <div className="relative z-10 w-full space-y-6 lg:space-y-8">

        {/* ═══════════════════════════════════════════════════════════
            HEADER SECTION
        ═══════════════════════════════════════════════════════════ */}
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 ${
          isDarkMode 
            ? 'bg-black/50 backdrop-blur-xl border-indigo-700/50' 
            : 'bg-white/80 backdrop-blur-md border-gray-200'
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode 
                  ? 'from-indigo-200 to-purple-200' 
                  : 'from-indigo-600 to-purple-600'
              }`}>
                Level 2 Approval – Mayank Sir
              </h1>
              <p className={`mt-2 text-base sm:text-lg ${
                isDarkMode ? 'text-indigo-300/90' : 'text-indigo-700/90'
              }`}>
                {totalRecords} total record{totalRecords !== 1 ? 's' : ''} • {uniqueOFFBILLUIDs.length} unique bill(s)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all ${
                  isDarkMode 
                    ? 'bg-purple-900/50 hover:bg-purple-800/50 text-yellow-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-indigo-700'
                }`}
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
              </button>

              {/* Grand Total Amount Card */}
              <div className={`px-5 py-3 rounded-2xl border shadow-lg text-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-emerald-900/70 to-teal-900/70 border-emerald-600/40' 
                  : 'bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300'
              }`}>
                <p className={`text-xs uppercase tracking-wider font-semibold mb-1 ${
                  isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
                }`}>Total Amount</p>
                <p className={`text-xl sm:text-2xl font-black ${
                  isDarkMode ? 'text-emerald-300' : 'text-emerald-700'
                }`}>₹{formatAmount(grandTotalAmount)}</p>
              </div>

              <div className={`px-6 py-4 rounded-2xl border shadow-lg min-w-[140px] text-center ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-600/40' 
                  : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300'
              }`}>
                <p className={`text-sm uppercase tracking-wider font-semibold mb-1 ${
                  isDarkMode ? 'text-purple-200' : 'text-purple-800'
                }`}>Pending</p>
                <p className={`text-3xl font-black ${
                  isDarkMode ? 'text-white' : 'text-indigo-800'
                }`}>{totalRecords}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            OFFBILLUID FILTER SECTION - Z-INDEX FIXED
        ═══════════════════════════════════════════════════════════ */}
        <div className={`rounded-2xl border shadow-xl p-6 relative z-30 ${
          isDarkMode 
            ? 'bg-black/40 backdrop-blur-md border-indigo-700/50' 
            : 'bg-white/70 backdrop-blur-md border-gray-200'
        }`}>
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            
            {/* Searchable Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
              <div className="flex items-center gap-2">
                <Filter className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Filter by OFFBILLUID:
                </span>
              </div>

              {/* ✅ FIXED: Custom Searchable Dropdown with proper z-index */}
              <div className="relative w-full sm:w-80 z-50" ref={dropdownRef}>
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    isDarkMode 
                      ? 'bg-gray-900/80 border-gray-700 hover:border-indigo-500 text-white' 
                      : 'bg-white border-gray-300 hover:border-indigo-500 text-gray-800'
                  } ${isDropdownOpen ? (isDarkMode ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-indigo-500 ring-2 ring-indigo-500/30') : ''}`}
                >
                  <span className={selectedOFFBILLUID ? '' : (isDarkMode ? 'text-gray-400' : 'text-gray-500')}>
                    {selectedOFFBILLUID || 'Select OFFBILLUID...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* ✅ FIXED: Dropdown Panel with z-[100] */}
                {isDropdownOpen && (
                  <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl z-[100] overflow-hidden ${
                    isDarkMode 
                      ? 'bg-gray-900 border-gray-700' 
                      : 'bg-white border-gray-200'
                  }`}>
                    {/* Search Input */}
                    <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className="relative">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Type to search..."
                          className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500'
                          }`}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-60 overflow-y-auto">
                      {/* Clear Selection Option */}
                      <div
                        onClick={() => {
                          setSelectedOFFBILLUID('');
                          setSearchQuery('');
                          setIsDropdownOpen(false);
                        }}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          isDarkMode 
                            ? 'hover:bg-gray-800 text-gray-400 border-b border-gray-700' 
                            : 'hover:bg-gray-100 text-gray-500 border-b border-gray-200'
                        }`}
                      >
                        -- Show All --
                      </div>

                      {filteredUIDs.length === 0 ? (
                        <div className={`px-4 py-6 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          No matching UIDs found
                        </div>
                      ) : (
                        filteredUIDs.map((uid) => {
                          const items = expenses.filter(e => e.OFFBILLUID === uid);
                          const itemCount = items.length;
                          // ✅ FIXED: Calculate total for each UID
                          const uidTotal = items.reduce((sum, item) => sum + parseAmount(item.Amount), 0);
                          const isSelected = selectedOFFBILLUID === uid;
                          return (
                            <div
                              key={uid}
                              onClick={() => {
                                setSelectedOFFBILLUID(uid);
                                setSearchQuery('');
                                setIsDropdownOpen(false);
                              }}
                              className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                                isSelected 
                                  ? (isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700')
                                  : (isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-gray-100 text-gray-800')
                              }`}
                            >
                              <div>
                                <span className="font-medium">{uid}</span>
                                <span className={`ml-2 text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                  ₹{formatAmount(uidTotal)}
                                </span>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                isDarkMode 
                                  ? 'bg-purple-900/50 text-purple-300' 
                                  : 'bg-purple-100 text-purple-700'
                              }`}>
                                {itemCount} item{itemCount !== 1 ? 's' : ''}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button - Approve Selected Group */}
            {selectedOFFBILLUID && (
              <button
                onClick={openApprovalModal}
                className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white'
                }`}
              >
                <Send className="w-5 h-5" />
                Approve "{selectedOFFBILLUID}"
              </button>
            )}
          </div>

          {/* Selected Info */}
          {selectedOFFBILLUID && (
            <div className={`mt-4 p-4 rounded-xl border flex flex-wrap items-center gap-4 ${
              isDarkMode 
                ? 'bg-indigo-950/50 border-indigo-700/50' 
                : 'bg-indigo-50 border-indigo-200'
            }`}>
              <div className="flex items-center gap-2">
                <Package className={`w-5 h-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <span className={`font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                  Selected: <strong>{selectedOFFBILLUID}</strong>
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode 
                  ? 'bg-purple-900/50 text-purple-300' 
                  : 'bg-purple-100 text-purple-700'
              }`}>
                {filteredExpenses.length} item{filteredExpenses.length !== 1 ? 's' : ''}
              </span>
              {/* ✅ FIXED: Total amount display */}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDarkMode 
                  ? 'bg-emerald-900/50 text-emerald-300' 
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                Total: ₹{formatAmount(totalAmountForSelected)}
              </span>
              <button
                onClick={() => {
                  setSelectedOFFBILLUID('');
                  setSearchQuery('');
                }}
                className={`ml-auto p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-red-900/50 text-red-400' 
                    : 'hover:bg-red-100 text-red-600'
                }`}
                title="Clear selection"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DATA TABLE - LOWER Z-INDEX
        ═══════════════════════════════════════════════════════════ */}
        <div className={`overflow-x-auto rounded-2xl border shadow-2xl w-full relative z-10 ${
          isDarkMode 
            ? 'border-indigo-700/50 bg-black/40 backdrop-blur-md' 
            : 'border-gray-300 bg-white/70 backdrop-blur-md'
        }`}>
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr className={`text-white ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950' 
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
              }`}>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">OFFBILLUID</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">UID</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Office</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Payee</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Expense Head</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Item</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Qty</th>
                <th className="px-4 py-4 text-right text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Amount</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Department</th>
                <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Raised By</th>
                <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill</th>
              </tr>
            </thead>

            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800/60' : 'divide-gray-200'}`}>
              {filteredExpenses.map((item, index) => {
                const rawUrl = item.Bill_Photo || '';
                const photoUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
                const hasValidPhoto = photoUrl.startsWith('http');
                const isSelectedGroup = selectedOFFBILLUID && item.OFFBILLUID === selectedOFFBILLUID;

                return (
                  <tr
                    key={`${item.OFFBILLUID}-${item.uid}-${index}`}
                    className={`transition-colors duration-150 ${
                      isSelectedGroup
                        ? (isDarkMode ? 'bg-indigo-950/40' : 'bg-indigo-50')
                        : (isDarkMode ? 'hover:bg-indigo-950/20' : 'hover:bg-gray-50')
                    }`}
                  >
                    <td className={`px-4 py-4 font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                      {item.OFFBILLUID || '-'}
                    </td>
                    <td className={`px-4 py-4 font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      {item.uid || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.OFFICE_NAME_1 || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.PAYEE_NAME_1 || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.EXPENSES_HEAD_1 || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.ITEM_NAME_1 || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.Qty_1 || '-'}
                    </td>
                    {/* ✅ FIXED: Amount display */}
                    <td className={`px-4 py-4 font-medium text-right ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ₹{formatAmount(item.Amount)}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.DEPARTMENT_1 || '-'}
                    </td>
                    <td className={`px-4 py-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.RAISED_BY_1 || '-'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {hasValidPhoto ? (
                        <a
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition ${
                            isDarkMode
                              ? 'bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70'
                              : 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                          }`}
                        >
                          <LucideImage className="w-5 h-5" />
                        </a>
                      ) : (
                        <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* ✅ NEW: Table Footer with Total */}
            {filteredExpenses.length > 0 && (
              <tfoot>
                <tr className={`font-bold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-950/50 to-teal-950/50' 
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100'
                }`}>
                  <td colSpan={7} className={`px-4 py-4 text-right ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Total ({filteredExpenses.length} items):
                  </td>
                  <td className={`px-4 py-4 text-right text-lg ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    ₹{formatAmount(totalAmountForSelected)}
                  </td>
                  <td colSpan={3}></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>

        {/* Table Footer Info */}
        <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Showing {filteredExpenses.length} of {expenses.length} records
          {selectedOFFBILLUID && ` • Filtered by: ${selectedOFFBILLUID}`}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          APPROVAL MODAL
      ═══════════════════════════════════════════════════════════ */}
      {isModalOpen && selectedOFFBILLUID && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl border max-h-[90vh] flex flex-col overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-900 to-black border-indigo-700/50' 
              : 'bg-gradient-to-b from-white to-gray-100 border-gray-300'
          }`}>

            {/* Modal Header */}
            <div className={`p-6 flex justify-between items-center border-b shrink-0 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60' 
                : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300'
            }`}>
              <div>
                <h3 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-indigo-800'}`}>
                  Bulk Approval
                </h3>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  OFFBILLUID: <strong>{selectedOFFBILLUID}</strong> • {filteredExpenses.length} item(s)
                </p>
              </div>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition ${
                  isDarkMode 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800/80' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Modal Content */}
            <div className={`flex-1 overflow-y-auto p-6 space-y-6 ${
              isDarkMode ? 'scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900/40' : ''
            }`}>
              
              {/* Summary */}
              <div className={`p-4 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-900/60 border-gray-800/50' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Items</p>
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                      {filteredExpenses.length}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Amount</p>
                    {/* ✅ FIXED: Modal total amount */}
                    <p className={`text-2xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      ₹{formatAmount(totalAmountForSelected)}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS_2 Dropdown */}
              <div className="space-y-2">
                <label className={`block text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_2}
                  onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base ${
                    isDarkMode
                      ? formData.STATUS_2
                        ? 'bg-gray-800 border-emerald-500/50 text-white'
                        : 'bg-gray-800 border-red-500/50 text-white'
                      : formData.STATUS_2
                        ? 'bg-white border-emerald-500 text-gray-900'
                        : 'bg-white border-red-300 text-gray-900'
                  }`}
                >
                  <option value="">-- Select Status --</option>
                  <option value="Done">✅ Done</option>
                  <option value="Rejected">❌ Rejected</option>
                </select>
              </div>

              {/* PAYMENT_MODE_3 Dropdown */}
              <div className="space-y-2">
                <label className={`block text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Payment Mode
                </label>
                <select
                  value={formData.PAYMENT_MODE_3}
                  onChange={(e) => setFormData({ ...formData, PAYMENT_MODE_3: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  <option value="">-- Select Payment Mode --</option>
                  <option value="Cash">💵 Cash</option>
                  <option value="Bank">🏦 Bank</option>
                </select>
              </div>

              {/* REMARK_2 Input */}
              <div className="space-y-2">
                <label className={`block text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Remark
                </label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-base ${
                    isDarkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Enter any remark or note..."
                />
              </div>

              {/* Items Preview */}
              <div className="space-y-2">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Items to be updated:
                </p>
                <div className={`max-h-40 overflow-y-auto rounded-lg border p-3 space-y-2 ${
                  isDarkMode 
                    ? 'bg-gray-950/50 border-gray-800' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  {filteredExpenses.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`flex justify-between items-center text-sm py-2 px-3 rounded ${
                        isDarkMode ? 'bg-gray-900/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex-1">
                        <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {item.ITEM_NAME_1 || `Item ${idx + 1}`}
                        </span>
                        <span className={`ml-2 text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          ({item.uid})
                        </span>
                      </div>
                      {/* ✅ FIXED: Item amount in preview */}
                      <span className={`font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        ₹{formatAmount(item.Amount)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Preview Total */}
                <div className={`flex justify-between items-center pt-2 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  <span className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Total:
                  </span>
                  <span className={`font-bold text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ₹{formatAmount(totalAmountForSelected)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`border-t p-6 ${
              isDarkMode 
                ? 'bg-gray-900/80 border-gray-800' 
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className={`px-6 py-3 rounded-xl font-medium transition w-full sm:w-auto ${
                    isDarkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating || !formData.STATUS_2}
                  className={`px-8 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 w-full sm:w-auto min-w-[180px] transition-all ${
                    isUpdating || !formData.STATUS_2
                      ? (isDarkMode ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-300 text-gray-400 cursor-not-allowed')
                      : (isDarkMode 
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl')
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
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
        </div>
      )}
    </div>
  );
}

export default Approvel_By_Mayaksir;