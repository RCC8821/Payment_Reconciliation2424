// import React, { useState } from 'react';
// import {
//   useGetPendingDimOfficeExpensesLevel2Query,
//   useUpdateDimOfficeExpenseFinalApprovalMutation,
// } from '../../features/Dimension_Office_Expenses/Dim_Approvel2ApiSlice';
// import { Image as LucideImage, Loader2, CheckCircle, Edit3, X } from 'lucide-react';

// function Dim_Approvel2() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//   } = useGetPendingDimOfficeExpensesLevel2Query();

//   const [updateFinalApproval, { isLoading: isUpdating }] = useUpdateDimOfficeExpenseFinalApprovalMutation();

//   const expenses = response?.data || [];
//   const totalRecords = response?.totalRecords || 0;

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [formData, setFormData] = useState({
//     STATUS_3: '',
//     FINAL_AMOUNT_3: '',
//     REMARK_3: '',
//   });

//   const openModal = (expense) => {
//     setSelectedExpense(expense);
//     setFormData({
//       STATUS_3: '',
//       FINAL_AMOUNT_3: expense.PLANNED_3 || '',
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
//       REMARK_3: '',
//     });
//   };

//   const handleSubmit = async () => {
//     if (!formData.STATUS_3) {
//       alert('Please select "Done" to finalize');
//       return;
//     }

//     const payload = {
//       uid: selectedExpense.Office_Bill_No,          //  ←←←  Most important change
//       STATUS_3: formData.STATUS_3,
//       FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3 ? Number(formData.FINAL_AMOUNT_3) : null,
//       REMARK_3: formData.REMARK_3.trim() || null,
//     };

//     try {
//       await updateFinalApproval(payload).unwrap();
//       alert('Final approval submitted successfully!');
//       closeModal();
//       // Optional: window.location.reload();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to submit: ' + (err?.data?.message || err.message));
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-5">
//           <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
//           <p className="text-xl font-medium text-indigo-300">Loading Dimension Level 2 approvals...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Data loading failed</h2>
//           <p className="text-gray-300 mb-6">{error?.data?.message || 'Cannot load pending records'}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (expenses.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Approvals</h2>
//           <p className="text-gray-400 text-lg">
//             No Dimension office expenses pending for Final Approval (Level 2)
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full">

//       {/* Background glows */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
//         <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
//       </div>

//       {/* Main content – full width */}
//       <div className="relative z-10 w-full space-y-8 lg:space-y-10">

//         {/* Header */}
//         <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-indigo-700/50 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl w-full">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             <div>
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
//                 Dimension Office Expenses – Level 2 Approval
//               </h1>
//               <p className="text-indigo-300/90 mt-2 text-base sm:text-lg lg:text-xl">
//                 Pending records for final review (Mayak Sir)
//               </p>
//             </div>
//             <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 px-6 py-4 lg:py-6 rounded-2xl border border-purple-600/40 shadow-lg min-w-[140px] lg:min-w-[180px] text-center">
//               <p className="text-sm uppercase tracking-wider text-purple-200 font-semibold mb-1">Pending</p>
//               <p className="text-3xl lg:text-4xl font-black text-white">{totalRecords}</p>
//             </div>
//           </div>
//         </div>

//         {/* Table – full width */}
//         <div className="overflow-x-auto rounded-2xl border border-indigo-700/50 bg-black/40 backdrop-blur-md shadow-2xl w-full">
//           <table className="w-full min-w-[1400px] border-collapse">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
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

//             <tbody className="divide-y divide-gray-800/60 bg-gray-950/10">
//               {expenses.map((item) => (
//                 <tr
//                   key={item.Office_Bill_No || item.uid}
//                   className="hover:bg-indigo-950/40 transition-colors duration-150"
//                 >
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.Timestamp || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-indigo-300 font-medium font-bold text-base">
//                     {item.Office_Bill_No || '-'}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.OFFICE_NAME_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.PAYEE_NAME_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.EXPENSES_HEAD_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.EXPENSES_SUBHEAD_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.DEPARTMENT_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.APPROVAL_DOER || item.APPROVAL_DOER_2 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.RAISED_BY_1 || '-'}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-emerald-400 font-medium text-base">
//                     ₹{(item.Total_Amount || item.Amount || '—').toLocaleString('en-IN')}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                     {item.Bill_Photo_1 || item.Bill_Photo ? (
//                       <a
//                         href={item.Bill_Photo_1 || item.Bill_Photo}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center justify-center p-3 bg-cyan-900/50 text-cyan-300 rounded-lg hover:bg-cyan-800/70 transition hover:scale-105"
//                         title="View bill photo"
//                       >
//                         <LucideImage className="w-6 h-6" />
//                       </a>
//                     ) : (
//                       <span className="text-gray-600 text-xl">—</span>
//                     )}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                     <button
//                       onClick={() => openModal(item)}
//                       className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-3 lg:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto min-w-[140px] lg:min-w-[160px] text-base lg:text-lg"
//                       title={`Review ${item.Office_Bill_No}`}
//                     >
//                       <Edit3 className="w-5 h-5" />
//                       Review
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal – wider on large screens */}
//       {isModalOpen && selectedExpense && (
//   <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
//     <div
//       className="
//         bg-gradient-to-b from-gray-900 to-black 
//         rounded-2xl shadow-2xl 
//         w-full max-w-full sm:max-w-3xl lg:max-w-5xl 
//         border border-indigo-700/50 
//         max-h-[96vh] flex flex-col overflow-hidden
//       "
//     >
//       {/* Header – fixed at top */}
//       <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 sm:p-6 lg:p-8 flex justify-between items-center border-b border-indigo-700/60 shrink-0">
//         <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
//           Final Approval – UID: {selectedExpense.uid || selectedExpense.Office_Bill_No || '—'}
//         </h3>
//         <button
//           onClick={closeModal}
//           className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition shrink-0 ml-2"
//         >
//           <X className="w-7 h-7 sm:w-8 sm:h-8" />
//         </button>
//       </div>

//       {/* Scrollable content area */}
//       <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-indigo-600/70 scrollbar-track-gray-900/30">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
//           <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800/50">
//             <p className="text-sm text-gray-400 uppercase mb-2">Bill No</p>
//             <p className="text-xl sm:text-2xl font-bold text-indigo-300 break-all">
//               {selectedExpense.Office_Bill_No || '—'}
//             </p>
//           </div>
//           <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-800/50">
//             <p className="text-sm text-gray-400 uppercase mb-2">Original Amount</p>
//             <p className="text-xl sm:text-3xl font-bold text-emerald-400">
//               ₹{(selectedExpense.Total_Amount || selectedExpense.Amount || '0').toLocaleString('en-IN')}
//             </p>
//           </div>
//         </div>

//         {/* Status - REQUIRED */}
//         <div className="space-y-3">
//           <label className="block text-base sm:text-lg font-medium text-gray-200">
//             Final Status <span className="text-red-400">*</span>
//           </label>
//           <select
//             value={formData.STATUS_3}
//             onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
//             className={`w-full px-5 py-4 rounded-lg text-white focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
//               formData.STATUS_3
//                 ? 'bg-gray-800 border border-gray-700 focus:ring-emerald-500 border-emerald-500/50'
//                 : 'bg-gray-800/70 border border-red-500/50 focus:ring-red-500'
//             }`}
//           >
//             <option value="">----- Select ----- *</option>
//             <option value="Done">✅ Done</option>
//           </select>
//         </div>

//         {/* Final Amount */}
//         <div className="space-y-3">
//           <label className="block text-base sm:text-lg font-medium text-gray-200">Final Amount (optional)</label>
//           <input
//             type="number"
//             step="0.01"
//             min="0"
//             value={formData.FINAL_AMOUNT_3}
//             onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
//             className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//             placeholder="Enter if different from planned/revised"
//           />
//         </div>

//         {/* Remark */}
//         <div className="space-y-3">
//           <label className="block text-base sm:text-lg font-medium text-gray-200">Final Remark (optional)</label>
//           <textarea
//             value={formData.REMARK_3}
//             onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
//             rows={4}
//             className="w-full px-5 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-base sm:text-lg"
//             placeholder="Any final comments or justification..."
//           />
//         </div>

//         {/* Extra space at bottom of scroll area */}
//         <div className="h-20 sm:h-24"></div>
//       </div>

//       {/* Buttons – sticky at bottom */}
//       <div className="
//         shrink-0 
//         border-t border-gray-800 
//         p-5 sm:p-6 lg:p-8 
//         bg-gradient-to-t from-black via-black/95 to-transparent 
//         sticky bottom-0 z-10
//       ">
//         <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5">
//           <button
//             onClick={closeModal}
//             className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition text-base sm:text-lg order-2 sm:order-1 w-full sm:w-auto"
//             disabled={isUpdating}
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={isUpdating || !formData.STATUS_3}
//             className={`px-8 sm:px-10 py-4 rounded-lg font-medium flex items-center justify-center gap-3 min-w-[200px] sm:min-w-[220px] transition-all text-base sm:text-lg order-1 sm:order-2 w-full sm:w-auto ${
//               isUpdating || !formData.STATUS_3
//                 ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
//                 : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50 hover:scale-[1.02]'
//             }`}
//           >
//             {isUpdating ? (
//               <>
//                 <Loader2 className="w-6 h-6 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 <CheckCircle className="w-6 h-6" />
//                 Submit Final Approval
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//     </div>
//   );
// }

// export default Dim_Approvel2;





import React, { useState, useEffect } from "react";
import {
  useGetPendingDimOfficeExpensesLevel2Query,
  useUpdateDimOfficeExpenseFinalApprovalMutation,
} from '../../features/Dimension_Office_Expenses/Dim_Approvel2ApiSlice';
import { Image as LucideImage, Loader2, CheckCircle, Edit3, X } from 'lucide-react';

function Dim_Approvel2() {
  // ── Theme handling (real-time sync without reload) ────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved !== null ? JSON.parse(saved) : true; // default dark
  });

  useEffect(() => {
    const applyTheme = () => {
      const saved = localStorage.getItem("isDarkMode");
      const shouldBeDark = saved !== null ? JSON.parse(saved) : true;

      setIsDarkMode(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme();

    const handleStorageChange = (e) => {
      if (e.key === "isDarkMode") {
        applyTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const interval = setInterval(applyTheme, 800);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPendingDimOfficeExpensesLevel2Query();

  const [updateFinalApproval, { isLoading: isUpdating }] = 
    useUpdateDimOfficeExpenseFinalApprovalMutation();

  const expenses = response?.data || [];
  const totalRecords = response?.totalRecords || 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    STATUS_3: '',
    FINAL_AMOUNT_3: '',
    REMARK_3: '',
  });

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      STATUS_3: '',
      FINAL_AMOUNT_3: expense.PLANNED_3 || '',
      REMARK_3: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
    setFormData({
      STATUS_3: '',
      FINAL_AMOUNT_3: '',
      REMARK_3: '',
    });
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_3) {
      alert('Please select "Done" to finalize');
      return;
    }

    const payload = {
      uid: selectedExpense.Office_Bill_No,
      STATUS_3: formData.STATUS_3,
      FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3 ? Number(formData.FINAL_AMOUNT_3) : null,
      REMARK_3: formData.REMARK_3.trim() || null,
    };

    try {
      await updateFinalApproval(payload).unwrap();
      alert('Final approval submitted successfully!');
      closeModal();
      refetch(); // Optional: auto-refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to submit: ' + (err?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className={`w-16 h-16 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <p className={`text-xl font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            Loading Dimension Level 2 approvals...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
            Data loading failed
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {error?.data?.message || 'Cannot load pending records'}
          </p>
          <button
            onClick={() => window.location.reload()}
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

  if (expenses.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            No Pending Approvals
          </h2>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No Dimension office expenses pending for Final Approval (Level 2)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full ${
      isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>

      {/* Background glows - only in dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      )}

      <div className="relative z-10 w-full space-y-8 lg:space-y-10">

        {/* Header */}
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 ${
          isDarkMode ? 'bg-black/50 backdrop-blur-xl border-indigo-700/50' : 'bg-white/80 backdrop-blur-md border-gray-200'
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode ? 'from-indigo-200 to-purple-200' : 'from-indigo-600 to-purple-600'
              }`}>
                Dimension Office Expenses – Level 2 Approval
              </h1>
              <p className={`mt-2 text-base sm:text-lg lg:text-xl ${
                isDarkMode ? 'text-indigo-300/90' : 'text-indigo-700/90'
              }`}>
                Pending records for final review (Mayak Sir)
              </p>
            </div>
            <div className={`px-6 py-4 lg:py-6 rounded-2xl border shadow-lg min-w-[140px] lg:min-w-[180px] text-center ${
              isDarkMode ? 'bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-600/40' : 'bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300'
            }`}>
              <p className={`text-sm uppercase tracking-wider font-semibold mb-1 ${
                isDarkMode ? 'text-purple-200' : 'text-purple-800'
              }`}>Pending</p>
              <p className={`text-3xl lg:text-4xl font-black ${
                isDarkMode ? 'text-white' : 'text-indigo-800'
              }`}>{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-2xl border shadow-2xl w-full ${
          isDarkMode ? 'border-indigo-700/50 bg-black/40 backdrop-blur-md' : 'border-gray-300 bg-white/70 backdrop-blur-md'
        }`}>
          <table className="w-full min-w-[1400px] border-collapse">
            <thead>
              <tr className={`text-white ${
                isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
              }`}>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Timestamp</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill No</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Office</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Payee</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Head</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Subhead</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Department</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Approver</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Raised By</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Amount</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill</th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">Action</th>
              </tr>
            </thead>

             <tbody
                          className={`divide-y ${isDarkMode ? "divide-gray-800/60 bg-gray-950/10" : "divide-gray-200 bg-white/50"}`}
                        >
                          {expenses.map((item) => {
                            // ← यहाँ curly braces {} इस्तेमाल करें और return करें
            
                            const rawUrl = item.Bill_Photo_1 || item.Bill_Photo || "";
                            const photoUrl =
                              typeof rawUrl === "string" ? rawUrl.trim() : "";
            
                            const hasValidPhoto =
                              photoUrl.length > 0 &&
                              photoUrl !== "No file uploaded" &&
                              photoUrl !== "null" &&
                              photoUrl !== "undefined" &&
                              !photoUrl.toLowerCase().includes("no file") &&
                              photoUrl.startsWith("http");
            
                            return (
                              <tr
                                key={item.Office_Bill_No || item.uid || Math.random()} // Math.random() fallback के लिए
                                className={`hover transition-colors duration-150 ${
                                  isDarkMode
                                    ? "hover:bg-indigo-950/40"
                                    : "hover:bg-indigo-50/80"
                                }`}
                              >
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {item.Timestamp || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 font-medium font-bold text-base ${
                                    isDarkMode ? "text-indigo-300" : "text-indigo-700"
                                  }`}
                                >
                                  {item.Office_Bill_No || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                                >
                                  {item.OFFICE_NAME_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                                >
                                  {item.PAYEE_NAME_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                                >
                                  {item.EXPENSES_HEAD_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                                >
                                  {item.EXPENSES_SUBHEAD_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {item.DEPARTMENT_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {item.APPROVAL_DOER || item.APPROVAL_DOER_2 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                                >
                                  {item.RAISED_BY_1 || "-"}
                                </td>
                                <td
                                  className={`px-4 py-5 lg:px-6 lg:py-6 font-medium text-base ${
                                    isDarkMode ? "text-emerald-400" : "text-emerald-600"
                                  }`}
                                >
                                  ₹{item.Total_Amount || item.Amount || 0}
                                </td>
            
                                {/* Bill Photo Column */}
                                <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                                  {hasValidPhoto ? (
                                    <a
                                      href={photoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className={`inline-flex items-center justify-center p-3 rounded-lg hover:scale-105 transition cursor-pointer ${
                                        isDarkMode
                                          ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70"
                                          : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                                      }`}
                                      title="View bill photo"
                                    >
                                      <LucideImage className="w-6 h-6" />
                                    </a>
                                  ) : (
                                    <span
                                      className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} text-base font-medium select-none pointer-events-none`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      N/A
                                    </span>
                                  )}
                                </td>
            
                                <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                                  <button
                                    onClick={() => openModal(item)}
                                    className={`px-5 py-3 lg:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto min-w-[140px] lg:min-w-[160px] text-base lg:text-lg ${
                                      isDarkMode
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                        : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
                                    }`}
                                    title={`Review ${item.Office_Bill_No || "record"}`}
                                  >
                                    <Edit3 className="w-5 h-5" />
                                    Review
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8">
          <div className={`rounded-2xl shadow-2xl w-full max-w-full sm:max-w-3xl lg:max-w-5xl border max-h-[96vh] flex flex-col overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-b from-gray-900 to-black border-indigo-700/50' 
              : 'bg-gradient-to-b from-white to-gray-100 border-gray-300'
          }`}>

            {/* Header */}
            <div className={`p-5 sm:p-6 lg:p-8 flex justify-between items-center border-b shrink-0 ${
              isDarkMode ? 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300'
            }`}>
              <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${
                isDarkMode ? 'text-white' : 'text-indigo-800'
              }`}>
                Final Approval – UID: {selectedExpense.uid || selectedExpense.Office_Bill_No || '—'}
              </h3>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition shrink-0 ml-3 ${
                  isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800/80' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <X className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className={`flex-1 overflow-y-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 scrollbar-thin ${
              isDarkMode ? 'scrollbar-thumb-indigo-600/70 scrollbar-track-gray-950/40' : 'scrollbar-thumb-indigo-400 scrollbar-track-gray-200'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 lg:gap-8">
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? 'bg-gray-900/60 border-gray-800/50' : 'bg-white border-gray-200'
                }`}>
                  <p className={`text-sm uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bill No</p>
                  <p className={`text-xl sm:text-2xl font-bold break-all ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    {selectedExpense.Office_Bill_No || '—'}
                  </p>
                </div>
                <div className={`p-5 rounded-xl border ${
                  isDarkMode ? 'bg-gray-900/60 border-gray-800/50' : 'bg-white border-gray-200'
                }`}>
                  <p className={`text-sm uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Original Amount</p>
                  <p className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ₹{(selectedExpense.Total_Amount || selectedExpense.Amount || '0').toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Final Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_3}
                  onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
                  className={`w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                    isDarkMode
                      ? formData.STATUS_3
                        ? 'bg-gray-800 border-gray-700 focus:ring-emerald-500 text-white border-emerald-500/50'
                        : 'bg-gray-800/70 border-red-500/50 focus:ring-red-500 text-white'
                      : formData.STATUS_3
                        ? 'bg-white border-gray-300 focus:ring-emerald-500 text-gray-900 border-emerald-500'
                        : 'bg-white border-red-300 focus:ring-red-500 text-gray-900 border-red-500'
                  }`}
                >
                  <option value="">----- Select ----- *</option>
                  <option value="Done">✅ Done</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Final Amount (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.FINAL_AMOUNT_3}
                  onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
                  className={`w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 text-base sm:text-lg ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white' : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-900'
                  }`}
                  placeholder="Enter if different from planned/revised"
                />
              </div>

              <div className="space-y-3">
                <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Final Remark (optional)
                </label>
                <textarea
                  value={formData.REMARK_3}
                  onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
                  rows={4}
                  className={`w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 resize-y text-base sm:text-lg ${
                    isDarkMode ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500 text-white' : 'bg-white border-gray-300 focus:ring-indigo-500 text-gray-900'
                  }`}
                  placeholder="Any final comments or justification..."
                />
              </div>

              <div className="h-16 sm:h-20 lg:h-24"></div>
            </div>

            {/* Sticky bottom buttons */}
            <div className={`shrink-0 border-t p-5 sm:p-6 lg:p-8 sticky bottom-0 z-10 ${
              isDarkMode ? 'bg-gradient-to-t from-black via-black/95 to-transparent border-gray-800' : 'bg-gradient-to-t from-white via-white/95 to-transparent border-gray-200'
            }`}>
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5">
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className={`px-8 py-4 rounded-lg font-medium transition text-base sm:text-lg order-2 sm:order-1 ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  disabled={isUpdating || !formData.STATUS_3}
                  className={`px-8 sm:px-10 py-4 rounded-lg font-medium flex items-center justify-center gap-3 min-w-[200px] sm:min-w-[220px] transition-all text-base sm:text-lg order-1 sm:order-2 ${
                    isUpdating || !formData.STATUS_3
                      ? isDarkMode
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                        : 'bg-gray-300 text-gray-400 cursor-not-allowed border border-gray-400'
                      : isDarkMode
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50 hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl border border-emerald-400 hover:scale-[1.02]'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      Submit Final Approval
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

export default Dim_Approvel2;