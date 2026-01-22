// import React, { useState } from 'react';
// import {
//   useGetPendingOfficeExpensesQuery,
//   useUpdateOfficeExpenseApprovalMutation,
// } from '../../features/RCC_Office_Expenses/approval1ApiSlice';
// import { ExternalLink, Image, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';

// function RCC_Approvel() {
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
//         <h2 className="text-3xl font-bold text-gray-800">RCC Office Expenses - Level 1 Approval</h2>
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
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">ITEM_NAME</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UNIT</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">SKU CODE</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">QTY</th>
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
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.ITEM_NAME_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.UNIT_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.SKU_CODE_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.Qty_1 || '-'}</td>
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

// export default RCC_Approvel;

// import React, { useState } from 'react';
// import {
//   useGetPendingOfficeExpensesQuery,
//   useUpdateOfficeExpenseApprovalMutation,
// } from '../../features/RCC_Office_Expenses/approval1ApiSlice';
// import { ExternalLink, Image, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';

// function RCC_Approvel() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//   } = useGetPendingOfficeExpensesQuery();

//   const [updateApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseApprovalMutation();

//   // Get current user's name from sessionStorage
//   // Change "username" → whatever key you actually use (name, fullName, approver, etc.)
//   const currentApprover = sessionStorage.getItem('userName') || '';
// console.log(currentApprover)
//   const allExpenses = response?.data || [];
//   const totalRecords = response?.totalRecords || 0;

//   // Filter only expenses where APPROVAL_DOER matches the logged-in user
//   const myPendingExpenses = allExpenses.filter((item) =>
//     item.APPROVAL_DOER?.trim().toLowerCase() === currentApprover.trim().toLowerCase()
//   );

//   const myPendingCount = myPendingExpenses.length;

//   // Modal state
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
//       APPROVAL_DOER_2: selectedExpense.APPROVAL_DOER || 'Unknown',
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

//   if (!currentApprover) {
//     return (
//       <div className="text-center py-16 text-red-600 text-xl">
//         No user information found in session. Please login again.
//       </div>
//     );
//   }

//   if (myPendingExpenses.length === 0) {
//     return (
//       <div className="text-center py-16 text-gray-600 text-xl space-y-4">
//         <div>No pending approvals assigned to you at this time.</div>
//         <div className="text-base text-gray-500">
//           Logged in as: <strong>{currentApprover}</strong>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 p-4 ">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-3xl font-bold text-white">
//           RCC Office Expenses - Level 1 Approval
//         </h2>
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//           {/* <div className="bg-emerald-100 text-emerald-800 px-5 py-2 rounded-full font-semibold">
//             {myPendingCount} Pending for you
//           </div> */}
//           <div className="text-gray-400">
//             Approver: <span className="font-medium">{currentApprover}</span>
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
//         <table className="w-full table-auto bg-gray-400 min-w-max">
//           <thead className="bg-gradient-to-br from-black via-indigo-950 to-purple-950 text-white">
//             <tr>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Planned</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UID</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Office Name</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Payee</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES HEAD</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES SUBHEAD</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">ITEM NAME</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UNIT</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">SKU CODE</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">QTY</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">DEPARTMENT</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">APPROVAL DOER</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">RAISED BY</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">REMARK</th>
//               <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Bill</th>
//               <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200">
//             {myPendingExpenses.map((item) => (
//               <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.PLANNED_2 || '0'}</td>
//                 <td className="px-4 py-4 text-sm font-medium text-black">{item.uid}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.OFFICE_NAME_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.PAYEE_NAME_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.EXPENSES_HEAD_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.EXPENSES_SUBHEAD_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black max-w-xs truncate">{item.ITEM_NAME_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black max-w-xs truncate">{item.UNIT_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black max-w-xs truncate">{item.SKU_CODE_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black max-w-xs truncate">{item.Qty_1 || '-'}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black max-w-xs truncate">{item.Amount || '-'}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.DEPARTMENT_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.APPROVAL_DOER}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.RAISED_BY_1}</td>
//                 <td className="px-4 py-4 text-sm font-bold text-black">{item.REMARK_1}</td>
//                 <td className="px-4 py-4 text-sm">
//                   {item.Bill_Photo ? (
//                     <a
//                       href={item.Bill_Photo}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1"
//                     >
//                       <Image className="w-4 h-4" /> View
//                     </a>
//                   ) : (
//                     <span className="text-gray-400 text-xs">-</span>
//                   )}
//                 </td>
//                 <td className="px-4 py-4 text-center">
//                   <button
//                     onClick={() => openModal(item)}
//                     className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 mx-auto transition"
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
//         <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
//             <h3 className="text-2xl font-bold text-gray-800 mb-6">Level 1 Approval</h3>

//             <div className="space-y-5 mb-8">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Approval Status <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={formData.STATUS_2}
//                   onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
//                 <textarea
//                   value={formData.REMARK_2}
//                   onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
//                   rows="3"
//                   placeholder="Add any remark..."
//                   className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>

//               <div className="pt-2">
//                 <p className="text-sm text-gray-600">
//                   <strong>Approver:</strong> {selectedExpense.APPROVAL_DOER || 'Current User'} (Auto-filled)
//                 </p>
//               </div>
//             </div>

//             <div className="flex gap-4 justify-end">
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

// export default RCC_Approvel;

import React, { useState } from "react";
import {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} from "../../features/RCC_Office_Expenses/approval1ApiSlice";
import {
  ExternalLink,
  Image,
  Loader2,
  CheckCircle,
  XCircle,
  Edit3,
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

  // Get user info from sessionStorage
  const currentApprover = sessionStorage.getItem("userName") || "";
  const userType = sessionStorage.getItem("userType")?.toUpperCase() || ""; // ← added

  console.log("Current approver:", currentApprover, "User type:", userType);

  const allExpenses = response?.data || [];
  const totalRecords = response?.totalRecords || 0;

  // ────────────────────────────────────────────────
  // Decide which expenses to show
  // ────────────────────────────────────────────────
  const isAdmin = userType === "ADMIN";

  const expensesToShow = isAdmin
    ? allExpenses // ADMIN sees everything
    : allExpenses.filter(
        (item) =>
          item.APPROVAL_DOER?.trim().toLowerCase() ===
          currentApprover.trim().toLowerCase(),
      );

  const pendingCount = expensesToShow.length;

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    STATUS_2: "",
    REVISED_AMOUNT_3: "",
    REMARK_2: "",
  });

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      STATUS_2: "",
      REVISED_AMOUNT_3: expense.PLANNED_2 || "",
      REMARK_2: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_2) {
      alert("Please select a status");
      return;
    }

    const payload = {
      uid: selectedExpense.uid,
      STATUS_2: formData.STATUS_2,
      REVISED_AMOUNT_3: formData.REVISED_AMOUNT_3,
      APPROVAL_DOER_2:
        selectedExpense.APPROVAL_DOER || currentApprover || "Unknown",
      REMARK_2: formData.REMARK_2,
    };

    try {
      await updateApproval(payload).unwrap();
      alert("Approval updated successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      alert(
        "Failed to update approval: " + (err?.data?.message || err.message),
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="ml-3 text-lg text-gray-600">
          Loading pending approvals...
        </span>
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

  if (pendingCount === 0) {
    return (
      <div className="text-center py-16 text-gray-600 text-xl space-y-4">
        <div>
          No pending approvals {isAdmin ? "in the system" : "assigned to you"}{" "}
          at this time.
        </div>
        <div className="text-base text-gray-500">
          Logged in as: <strong>{currentApprover}</strong>
          {isAdmin && <span className="ml-2">(ADMIN)</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3 mt-10 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-2 border-b border-gray-700/50">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
          RCC Office Expenses
          <span className="block text-xl font-medium text-gray-400 mt-1">
            Level 1 Approval
          </span>
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div
            className={`px-5 py-2.5 rounded-full font-semibold text-sm shadow-md transition-all
      ${
        isAdmin
          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
      }`}
          >
            {pendingCount} Pending {isAdmin ? "Total" : "for you"}
          </div>

          <div className="flex items-center gap-3 bg-gray-800/60 px-4 py-2 rounded-lg border border-gray-700/50">
            <span className="text-gray-300 text-sm">Approver:</span>
            <span className="font-medium text-white">{currentApprover}</span>
            {isAdmin && (
              <span className="ml-1 px-2 py-0.5 bg-purple-700/70 text-purple-200 text-xs rounded-full font-semibold">
                ADMIN MODE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-700/40 bg-gray-900/40 backdrop-blur-sm">
        <table className="w-full table-auto min-w-max border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Planned
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                UID
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Office Name
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Payee
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                EXPENSES HEAD
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                EXPENSES SUBHEAD
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                ITEM NAME
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                UNIT
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                SKU CODE
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                QTY
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Amount
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                DEPARTMENT
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                APPROVAL DOER
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                RAISED BY
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                REMARK
              </th>
              <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Bill
              </th>
              <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/40 bg-gray-800/30">
            {expensesToShow.map((item) => (
              <tr
                key={item.uid}
                className="hover:bg-indigo-950/40 transition-colors duration-150"
              >
                <td className="px-5 py-4 text-sm  text-gray-200 border-r border-gray-700/30 last:border-r-0">
                  {item.PLANNED_2 || "0"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-200 border-r border-gray-700/30 last:border-r-0">
                  {item.uid}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-gray-100 border-r border-gray-700/30 last:border-r-0">
                  {item.OFFICE_NAME_1}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-gray-100 border-r border-gray-700/30 last:border-r-0">
                  {item.PAYEE_NAME_1}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-gray-100 border-r border-gray-700/30 last:border-r-0">
                  {item.EXPENSES_HEAD_1}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-gray-100 border-r border-gray-700/30 last:border-r-0">
                  {item.EXPENSES_SUBHEAD_1}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 max-w-xs truncate border-r border-gray-700/30 last:border-r-0">
                  {item.ITEM_NAME_1 || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.UNIT_1 || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.SKU_CODE_1 || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.Qty_1 || "-"}
                </td>
                <td className="px-5 py-4 text-sm font-medium text-emerald-400 border-r border-gray-700/30 last:border-r-0">
                  {item.Amount || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.DEPARTMENT_1}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.APPROVAL_DOER || "-"}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.RAISED_BY_1}
                </td>
                <td className="px-5 py-4 text-sm text-gray-300 border-r border-gray-700/30 last:border-r-0">
                  {item.REMARK_1}
                </td>
                <td className="px-5 py-4 text-sm border-r border-gray-700/30 last:border-r-0">
                  {item.Bill_Photo ? (
                    <a
                      href={item.Bill_Photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      View
                    </a>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => openModal(item)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ────────────────────────────────────────────────
          Modal remains almost same – just small safety improvement
      ──────────────────────────────────────────────── */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-2xl border border-indigo-700/40 overflow-hidden p-10">
            <h3 className="text-2xl font-bold text-white mb-6">
              Level 1 Approval
            </h3>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Approval Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.STATUS_2}
                  onChange={(e) =>
                    setFormData({ ...formData, STATUS_2: e.target.value })
                  }
                   className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option  value="">----- Select -----</option>
                  <option value="Approved">Done</option>
                  {/* You can add more options later: Rejected, Hold, etc. */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Revised Amount (if changed)
                </label>
                <input
                  type="number"
                  value={formData.REVISED_AMOUNT_3}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      REVISED_AMOUNT_3: e.target.value,
                    })
                  }
                  placeholder="Enter revised amount"
                   className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) =>
                    setFormData({ ...formData, REMARK_2: e.target.value })
                  }
                  rows="3"
                  placeholder="Add any remark..."
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <strong>Approver:</strong>{" "}
                  {selectedExpense.APPROVAL_DOER || currentApprover}
                  {isAdmin && <span className="text-purple-600"> (ADMIN)</span>}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70"
              >
                {isUpdating ? (
                  <>Updating...</>
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
