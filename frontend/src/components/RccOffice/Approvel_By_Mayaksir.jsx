// import React, { useState } from 'react';
// import {
//   useGetPendingOfficeExpensesLevel2Query,
//   useUpdateOfficeExpenseFinalApprovalMutation,
// } from '../../features/RCC_Office_Expenses/approval2ApiSlice';
// import { Image, Loader2, CheckCircle, Edit3 } from 'lucide-react';

// function Approvel_By_Mayaksir() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//   } = useGetPendingOfficeExpensesLevel2Query();

//   const [updateFinalApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseFinalApprovalMutation();

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
//   };

//   const handleSubmit = async () => {
//     if (!formData.STATUS_3) {
//       alert('Please select "Done" to finalize');
//       return;
//     }

//     const payload = {
//       uid: selectedExpense.uid,
//       STATUS_3: formData.STATUS_3,
//       FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3,
//       REMARK_3: formData.REMARK_3,
//     };

//     try {
//       await updateFinalApproval(payload).unwrap();
//       alert('Final approval submitted successfully!');
//       closeModal();
//     } catch (err) {
//       console.error(err);
//       alert('Failed to submit final approval: ' + (err?.data?.message || err.message));
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-96">
//         <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
//         <span className="ml-3 text-lg text-gray-600">Loading Level 2 approvals...</span>
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
//         No expenses pending for Final Approval (Level 2)
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-3xl font-bold text-gray-800">
//           RCC Office Expenses - Final Approval (Level 2)
//         </h2>
//         <div className="bg-purple-100 text-purple-800 px-5 py-3 rounded-full font-semibold">
//           {totalRecords} Pending Record{totalRecords !== 1 ? 's' : ''}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
//         <table className="w-full table-auto bg-white">
//           <thead className=" bg-blue-400 text-white font-bold text-2xl">
//             <tr>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Planned</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">UID</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Office Name</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Payee</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Expenses Head</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Subhead</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">ITEM_NAME</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UNIT</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">SKU CODE</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">QTY</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Department</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Approval Doer</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Raised By</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Revised Amount</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Remark</th>
//               <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Bill</th>
//               <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {expenses.map((item) => (
//               <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-6 py-4 text-sm font-bold text-purple-800">{item.PLANNED_3 || '0'}</td>
//                 <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.uid}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.OFFICE_NAME_1}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.PAYEE_NAME_1}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.EXPENSES_HEAD_1}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.EXPENSES_SUBHEAD_1}</td>
//                  <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.ITEM_NAME_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.UNIT_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.SKU_CODE_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.Qty_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.Amount || '-'}</td>
              
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.DEPARTMENT_1 || '-'}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.APPROVAL_DOER_2 || '-'}</td>
//                 <td className="px-6 py-4 text-sm text-gray-700">{item.RAISED_BY_1 || '-'}</td>
//                 <td className="px-6 py-4 text-sm font-semibold text-indigo-700">₹{item.REVISED_AMOUNT_2 || 'N/A'}</td>
//                 <td className="px-6 py-4 text-sm text-gray-600 italic max-w-xs truncate">{item.REMARK_2 || '-'}</td>
//                 <td className="px-6 py-4 text-sm">
//                   {item.Bill_Photo ? (
//                     <a
//                       href={item.Bill_Photo}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
//                     >
//                       <Image className="w-4 h-4" />
//                       View
//                     </a>
//                   ) : (
//                     <span className="text-gray-400 text-xs">-</span>
//                   )}
//                 </td>
//                 <td className="px-6 py-4 text-center">
//                   <button
//                     onClick={() => openModal(item)}
//                     className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition text-sm"
//                   >
//                     <Edit3 className="w-4 h-4" />
//                     Final Review
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Final Approval Modal */}
//       {isModalOpen && selectedExpense && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Final Approval (Level 2) - Mayak Sir</h3>

//             <div className="space-y-4 mb-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Final Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.STATUS_3}
//                   onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                 >
//                   <option value="">Select Status</option>
//                   <option value="Done">Done</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Final Amount (if different)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.FINAL_AMOUNT_3}
//                   onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
//                   placeholder="Leave blank if same as revised"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Final Remark</label>
//                 <textarea
//                   value={formData.REMARK_3}
//                   onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
//                   rows="3"
//                   placeholder="Any final comments..."
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
//                 />
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
//                 className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70"
//               >
//                 {isUpdating ? (
//                   <>Submitting...</>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Submit Final Approval
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

// export default Approvel_By_Mayaksir;









import React, { useState } from "react";
import {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseFinalApprovalMutation,
} from '../../features/RCC_Office_Expenses/approval2ApiSlice';
import { Image, Loader2, CheckCircle, Edit3,X } from 'lucide-react';

function Approvel_By_Mayaksir() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPendingOfficeExpensesLevel2Query();

  const [updateFinalApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseFinalApprovalMutation();

  const expenses = response?.data || [];
  const totalRecords = response?.totalRecords || 0;

  // Modal State
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
      FINAL_AMOUNT_3: expense.PLANNED_3 || expense.REVISED_AMOUNT_2 || '',
      REMARK_3: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_3) {
      alert('Please select "Done" to finalize');
      return;
    }

    const payload = {
      uid: selectedExpense.uid,
      STATUS_3: formData.STATUS_3,
      FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3 ? Number(formData.FINAL_AMOUNT_3) : null,
      REMARK_3: formData.REMARK_3.trim() || null,
    };

    try {
      await updateFinalApproval(payload).unwrap();
      alert('Final approval submitted successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to submit final approval: ' + (err?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
          <p className="text-xl font-medium text-indigo-300">Loading Level 2 approvals...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading data</h2>
          <p className="text-gray-300 mb-6">{error?.data?.message || 'Failed to load pending approvals'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Final Approvals</h2>
          <p className="text-gray-400 text-lg mb-8">
            All office expenses have been processed or no records are pending Level 2 approval.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-6 px-4 md:px-6">

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-indigo-700/40 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                RCC Office Expenses
              </h1>
              <p className="text-indigo-300/80 mt-2 text-lg">
                Final Approval (Level 2 - Mayak Sir) • {totalRecords} pending
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 px-6 py-4 rounded-xl border border-purple-700/40 shadow-lg">
              <p className="text-sm uppercase tracking-wider text-purple-200 font-semibold opacity-90 mb-1">
                Pending Records
              </p>
              <p className="text-3xl font-black text-white">{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-indigo-700/40 bg-black/30 backdrop-blur-md shadow-2xl">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Planned</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">UID</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Office Name</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Payee</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Head</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Subhead</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Item</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Unit</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">SKU</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Qty</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Amount</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Dept</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Approver</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Raised By</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Revised Amt</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Remark</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Bill</th>
                <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/50 bg-gray-900/10">
              {expenses.map((item) => (
                <tr
                  key={item.uid}
                  className="hover:bg-indigo-950/30 transition-colors duration-150"
                >
                  <td className="px-5 py-4 text-gray-300 font-medium">{item.PLANNED_3 || '0'}</td>
                  <td className="px-5 py-4 text-indigo-300 font-medium">{item.uid}</td>
                  <td className="px-5 py-4 text-gray-200">{item.OFFICE_NAME_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-200">{item.PAYEE_NAME_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-200">{item.EXPENSES_HEAD_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-200">{item.EXPENSES_SUBHEAD_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300 max-w-xs truncate">{item.ITEM_NAME_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.UNIT_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.SKU_CODE_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.Qty_1 || '-'}</td>
                  <td className="px-5 py-4 text-emerald-400 font-medium">₹{item.Amount || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.DEPARTMENT_1 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.APPROVAL_DOER_2 || '-'}</td>
                  <td className="px-5 py-4 text-gray-300">{item.RAISED_BY_1 || '-'}</td>
                  <td className="px-5 py-4 text-indigo-300 font-medium">₹{item.REVISED_AMOUNT_2 || 'N/A'}</td>
                  <td className="px-5 py-4 text-gray-400 italic max-w-xs truncate">{item.REMARK_2 || '-'}</td>
                  <td className="px-5 py-4 text-center">
                    {item.Bill_Photo ? (
                      <a
                        href={item.Bill_Photo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center p-2.5 bg-cyan-900/40 text-cyan-300 rounded-lg hover:bg-cyan-800/60 transition"
                        title="View Bill Photo"
                      >
                        <Image className="w-5 h-5" />
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => openModal(item)}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 mx-auto"
                    >
                      <Edit3 className="w-4 h-4" />
                      Final Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Approval Modal */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-lg border border-indigo-700/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 flex justify-between items-center border-b border-indigo-700/50">
              <h3 className="text-xl font-bold text-white">Final Approval (Level 2 - Mayak Sir)</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">UID</p>
                  <p className="text-lg font-medium text-indigo-300">{selectedExpense.uid}</p>
                </div>
                <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Revised Amount</p>
                  <p className="text-lg font-bold text-emerald-400">₹{selectedExpense.REVISED_AMOUNT_2 || 'N/A'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Final Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_3}
                  onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">──── Select Status ────</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Final Amount (if different)
                </label>
                <input
                  type="number"
                  value={formData.FINAL_AMOUNT_3}
                  onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
                  placeholder="Leave blank if same as revised"
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Final Remark</label>
                <textarea
                  value={formData.REMARK_3}
                  onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Any final comments or notes..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 transition-all ${
                    isUpdating
                      ? "bg-indigo-700/70 text-white cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Submit Final Approval
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animation keyframes */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, -60px); }
        }
        .animate-pulse-slow {
          animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default Approvel_By_Mayaksir;