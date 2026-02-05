// import React, { useState, useEffect } from "react";
// import {
//   useGetRccPaymentsPendingQuery,
//   useUpdateRccPaymentMutation,
// } from "../../features/RCC_Office_Expenses/RccPayementSlice"; // apna path adjust kar lena

// import { Image as LucideImage, Loader2, CheckCircle, Edit3, X, IndianRupee } from "lucide-react";

// import Swal from "sweetalert2";

// function OfficeExpensesPayment() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetRccPaymentsPendingQuery();

//   const [updatePayment, { isLoading: isUpdating }] = useUpdateRccPaymentMutation();

//   const payments = response?.data || [];
//   const totalRecords = response?.totalRecords || payments.length;

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedPayment, setSelectedPayment] = useState(null);

//   const [formData, setFormData] = useState({
//     uid: "",
//     STATUS_4: "",
//     TOTAL_PAID_AMOUNT_4: "",
//     BASIC_AMOUNT_4: "",
//     GST_PERCENTAGE_4: "",
//     CGST_4: "",
//     SGST_4: "",
//     NET_AMOUNT_4: "",
//     PAYMENT_MODE_17: "",
//     BANK_DETAILS_17: "",
//     PAYMENT_DETAILS_17: "",
//     PAYMENT_DATE_17: new Date().toISOString().split("T")[0],
//     Remark_Blank: "",
//   });

//   // const openModal = (payment) => {
//   //   setSelectedPayment(payment);
//   //   setFormData({
//   //     uid: payment.Office_Bill_No?.trim() || "",
//   //     STATUS_4: "Done",
//   //     TOTAL_PAID_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.PLANNED_4 || "",
//   //     BASIC_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.PLANNED_4 || "",
//   //     GST_PERCENTAGE_4: "",
//   //     CGST_4: "",
//   //     SGST_4: "",
//   //     NET_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.PLANNED_4 || "",
//   //     PAYMENT_MODE_17: "",
//   //     BANK_DETAILS_17: "",
//   //     PAYMENT_DETAILS_17: "",
//   //     PAYMENT_DATE_17: new Date().toISOString().split("T")[0],
//   //     Remark_Blank: "",
//   //   });
//   //   setIsModalOpen(true);
//   // };



//   const openModal = (payment) => {
//   setSelectedPayment(payment);
  
//   setFormData({
//     uid: payment.Office_Bill_No?.trim() || "",
//     STATUS_4: " ",                      // ya "" agar force nahi karna
//     TOTAL_PAID_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.PLANNED_4 || "",
    
//     // Sab kuch empty
//     BASIC_AMOUNT_4: "",
//     GST_PERCENTAGE_4: "",
//     CGST_4: "",
//     SGST_4: "",
//     NET_AMOUNT_4: "",
//     PAYMENT_MODE_17: "",
//     BANK_DETAILS_17: "",
//     PAYMENT_DETAILS_17: "",
//     PAYMENT_DATE_17: "",
//     Remark_Blank: "",
//   });
  
//   setIsModalOpen(true);
// };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedPayment(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   useEffect(() => {
//     const basic = parseFloat(formData.BASIC_AMOUNT_4) || 0;
//     const gstPercent = parseFloat(formData.GST_PERCENTAGE_4) || 0;
//     const totalGst = basic * (gstPercent / 100);
//     const cgst = totalGst / 2;
//     const sgst = totalGst / 2;
//     const net = basic + cgst + sgst;

//     setFormData((prev) => ({
//       ...prev,
//       CGST_4: cgst.toFixed(2),
//       SGST_4: sgst.toFixed(2),
//       NET_AMOUNT_4: net.toFixed(2),
//     }));
//   }, [formData.BASIC_AMOUNT_4, formData.GST_PERCENTAGE_4]);


  
// const handleSubmit = async () => {
//   console.log("Payload to backend:", formData);

//   // 1. Client-side validations with SweetAlert2
//   if (!formData.uid) {
//     Swal.fire({
//       icon: "warning",
//       title: "Record ID Missing",
//       text: "Bill No / UID not found!",
//       confirmButtonColor: "#6366f1",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   if (!formData.STATUS_4) {
//     Swal.fire({
//       icon: "warning",
//       title: "Status Required",
//       text: "Please select Status (Done / Paid)",
//       confirmButtonColor: "#6366f1",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   if (!formData.TOTAL_PAID_AMOUNT_4 || Number(formData.TOTAL_PAID_AMOUNT_4) <= 0) {
//     Swal.fire({
//       icon: "warning",
//       title: "Invalid Amount",
//       text: "Please enter a valid Total Paid Amount!",
//       confirmButtonColor: "#6366f1",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   if (!formData.PAYMENT_DATE_17) {
//     Swal.fire({
//       icon: "warning",
//       title: "Date Required",
//       text: "Please select Payment Date!",
//       confirmButtonColor: "#6366f1",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   if (!formData.PAYMENT_MODE_17) {
//     Swal.fire({
//       icon: "warning",
//       title: "Payment Mode Required",
//       text: "Please select Payment Mode!",
//       confirmButtonColor: "#6366f1",
//       confirmButtonText: "OK",
//     });
//     return;
//   }

//   // No confirmation dialog — directly proceed to saving

//   // Show loading state while API is running
//   Swal.fire({
//     title: "Saving...",
//     allowOutsideClick: false,
//     didOpen: () => {
//       Swal.showLoading();
//     },
//   });

//   try {
//     // API call
//     await updatePayment(formData).unwrap();

//     // Success message
//     await Swal.fire({
//       icon: "success",
//       title: "Success!",
//       text: "Payment details updated successfully!",
//       confirmButtonColor: "#10b981",
//       timer: 2200,
//       showConfirmButton: false,
//       position: "center",
//     });

//     // Close modal & refresh list
//     closeModal();
//     refetch();

//   } catch (err) {
//     console.error("Update error:", err);

//     let errorMessage = "Something went wrong! Please try again.";

//     // Try to show better backend error message if available
//     if (err?.data?.message) {
//       errorMessage = err.data.message;
//     } else if (err?.error) {
//       errorMessage = err.error;
//     }

//     Swal.fire({
//       icon: "error",
//       title: "Update Failed",
//       text: errorMessage,
//       confirmButtonColor: "#ef4444",
//       confirmButtonText: "OK",
//     });
//   }
// };

//   // ────────────────────────────────────────────────
//   // Loading / Error / Empty states
//   // ────────────────────────────────────────────────

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-5">
//           <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
//           <p className="text-xl font-medium text-indigo-300">Loading pending payments...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Data loading failed</h2>
//           <p className="text-gray-300 mb-6">{error?.data?.message || "Cannot load pending records"}</p>
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

//   if (payments.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Payments</h2>
//           <p className="text-gray-400 text-lg">
//             All RCC office expenses payments are processed or no records are waiting.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // ────────────────────────────────────────────────
//   // Main UI
//   // ────────────────────────────────────────────────

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full">
//       {/* Background effects */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
//         <div
//           className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse"
//           style={{ animationDelay: "4s" }}
//         ></div>
//       </div>

//       <div className="relative z-10 w-full space-y-8 lg:space-y-10">
//         {/* Header */}
//         <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-indigo-700/50 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl w-full">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
//             <div>
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
//                 RCC Office Payment Processing
//               </h1>
//               <p className="text-indigo-300/90 mt-2 text-base sm:text-lg lg:text-xl">
//                 Pending Payments • {totalRecords} record{totalRecords !== 1 ? "s" : ""}
//               </p>
//             </div>
//             <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 px-6 py-4 lg:py-6 rounded-2xl border border-purple-600/40 shadow-lg min-w-[140px] lg:min-w-[180px] text-center">
//               <p className="text-sm uppercase tracking-wider text-purple-200 font-semibold mb-1">Pending</p>
//               <p className="text-3xl lg:text-4xl font-black text-white">{totalRecords}</p>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-2xl border border-indigo-700/50 bg-black/40 backdrop-blur-md shadow-2xl w-full">
//           <table className="w-full min-w-[1800px] border-collapse">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Planned
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Bill No
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Office
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Payee
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Head
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Subhead
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Department
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Raised By
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Final Amount
//                 </th>
                
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Bill
//                 </th>
//                 <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
//                   Action
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-800/60 bg-gray-950/10">
//               {payments.map((item) => (
//                 <tr
//                   key={item.Office_Bill_No || Math.random()}
//                   className="hover:bg-indigo-950/40 transition-colors duration-150"
//                 >
//                    <td className="px-4 py-5 lg:px-6 lg:py-6 text-purple-300 font-medium text-base">
//                     {item.PLANNED_4}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-indigo-300 font-medium font-bold text-base">
//                     {item.Office_Bill_No || "-"}
//                   </td>

//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.OFFICE_NAME_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.PAYEE_NAME_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.EXPENSES_HEAD_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 text-base">{item.EXPENSES_SUBHEAD_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.DEPARTMENT_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">{item.RAISED_BY_1 || "-"}</td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-emerald-400 font-medium text-base">
//                     {item.FINAL_AMOUNT_3 ? `₹${Number(item.FINAL_AMOUNT_3).toLocaleString("en-IN")}` : "—"}
//                   </td>
                 
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                     {item.Bill_Photo_1 ? (
//                       <a
//                         href={item.Bill_Photo_1}
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
//                       title={`Process payment for ${item.Office_Bill_No}`}
//                     >
//                       <IndianRupee className="w-5 h-5" />
//                       Pay / Update
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* ────────────────────────────────────────────────
//            MODAL - Payment Update (with proper scrolling + sticky buttons)
//       ──────────────────────────────────────────────── */}
//       {isModalOpen && selectedPayment && (
//         <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
//           <div
//             className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl 
//             w-full max-w-full sm:max-w-4xl lg:max-w-5xl 
//             border border-indigo-700/50 
//             max-h-[96vh] flex flex-col overflow-hidden"
//           >
//             {/* Header – fixed */}
//             <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 sm:p-6 lg:p-8 flex justify-between items-center border-b border-indigo-700/60 shrink-0">
//               <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">
//                 Process Payment — {selectedPayment.Office_Bill_No}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/80 transition shrink-0"
//               >
//                 <X className="w-7 h-7 sm:w-8 sm:h-8" />
//               </button>
//             </div>

//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-5 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-gray-900/40">
//               {/* Quick Info */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
//                 <div className="bg-gray-900/60 p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-xs sm:text-sm lg:text-base text-gray-400 uppercase mb-1 sm:mb-2">Payee</p>
//                   <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-300 break-words">
//                     {selectedPayment.PAYEE_NAME_1 || "—"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-900/60 p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-xs sm:text-sm lg:text-base text-gray-400 uppercase mb-1 sm:mb-2">Final Amount</p>
//                   <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-400">
//                     ₹
//                     {selectedPayment.FINAL_AMOUNT_3
//                       ? Number(selectedPayment.FINAL_AMOUNT_3).toLocaleString("en-IN")
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-900/60 p-4 sm:p-5 lg:p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-xs sm:text-sm lg:text-base text-gray-400 uppercase mb-1 sm:mb-2">Planned</p>
//                   <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-300">
                  
//                     {selectedPayment.PLANNED_4}
//                   </p>
//                 </div>
//               </div>

//               {/* Form Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">
//                     Status <span className="text-red-400">*</span>
//                   </label>
//                   <select
//                     name="STATUS_4"
//                     value={formData.STATUS_4}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   >
//                     <option value="Done">Done</option>
                    
//                   </select>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">
//                     Total Paid Amount <span className="text-red-400">*</span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="TOTAL_PAID_AMOUNT_4"
//                     value={formData.TOTAL_PAID_AMOUNT_4}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                     placeholder="Amount actually paid"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Basic Amount (without GST)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="BASIC_AMOUNT_4"
//                     value={formData.BASIC_AMOUNT_4}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                     placeholder="Basic amount"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">GST %</label>
//                   <select
//                     name="GST_PERCENTAGE_4"
//                     value={formData.GST_PERCENTAGE_4}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   >
//                     <option value="">Select GST %</option>
//                     <option value="5">5%</option>
//                     <option value="12">12%</option>
//                     <option value="18">18%</option>
//                   </select>
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">CGST</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="CGST_4"
//                     value={formData.CGST_4}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                     placeholder="CGST amount"
//                     disabled
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">SGST</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="SGST_4"
//                     value={formData.SGST_4}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                     placeholder="SGST amount"
//                     disabled
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Net Amount</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="NET_AMOUNT_4"
//                     value={formData.NET_AMOUNT_4}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                     placeholder="Net amount (after tax)"
//                     disabled
//                   />



//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Payment Mode</label>
//                   <select
//                     name="PAYMENT_MODE_17"
//                     value={formData.PAYMENT_MODE_17}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   >
//                     <option value="">Select Payment Mode</option>
//                     <option value="cash">Cash</option>
//                     <option value="cheque">Cheque</option>
//                     <option value="RTGS">RTGS</option>
//                     <option value="NEFT">NEFT</option>
//                   </select>


                  
//                 </div>

//                  <div className=" space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Payment Details / Cheque / Voucher </label>
//                   <input
//                     type="text"
//                     name="PAYMENT_DETAILS_17"
//                     value={formData.PAYMENT_DETAILS_17}
//                     onChange={handleInputChange}
//                     placeholder="UTR / Transaction ID / Ref No"
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Payment Date</label>
//                   <input
//                     type="date"
//                     name="PAYMENT_DATE_17"
//                     value={formData.PAYMENT_DATE_17}
//                     onChange={handleInputChange}


//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   />
//                 </div>

//                 <div className="md:col-span-2 space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Bank Details</label>
//                   <select
//                     name="BANK_DETAILS_17"
//                     value={formData.BANK_DETAILS_17}
//                     onChange={handleInputChange}
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base sm:text-lg"
//                   >

  
//                     <option value="">Select Bank</option>
//                     <option value=" SVC Main A/C(202)"> SVC Main A/C(202)</option>
//                     <option value="SVC Vendor Pay A/C(328)">SVC Vendor Pay A/C(328)</option>
//                     <option value="HDFC Kabir Ahuja(341)">HDFC Kabir Ahuja(341)</option>
//                     <option value="HDFC Rajeev Abott(313)">HDFC Rajeev Abott(313)</option>
//                     <option value="HDFC Madhav Gupta (375)">HDFC Madhav Gupta (375)</option>
//                     <option value="HDFC Scope Clg(215)">HDFC Scope Clg(215)</option>
//                     <option value="ICICI RNTU(914)">ICICI RNTU(914)</option>
//                     <option value="Cash">Cash</option>
//                   </select>
//                 </div>

               

//                 <div className="md:col-span-2 space-y-3">
//                   <label className="block text-base sm:text-lg font-medium text-gray-200">Remark</label>
//                   <textarea
//                     name="Remark_Blank"
//                     value={formData.Remark_Blank}
//                     onChange={handleInputChange}
//                     rows={4}
//                     placeholder="Transaction note, reason for partial payment, etc."
//                     className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-base sm:text-lg"
//                   />
//                 </div>
//               </div>

//               {/* Extra space for scroll */}
//               <div className="h-16 lg:h-24"></div>
//             </div>

//             {/* Sticky Bottom Buttons */}
//             <div className="shrink-0 border-t border-gray-800 p-5 sm:p-6 lg:p-8 bg-gradient-to-t from-black via-black/95 to-transparent sticky bottom-0 z-10">
//               <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5">
//                 <button
//                   onClick={closeModal}
//                   disabled={isUpdating}
//                   className="px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition text-base sm:text-lg w-full sm:w-auto"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isUpdating}
//                   className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center gap-3 w-full sm:w-auto min-w-[220px] transition-all text-base sm:text-lg ${
//                     isUpdating
//                       ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600"
//                       : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50 hover:scale-[1.02]"
//                   }`}
//                 >
//                   {isUpdating ? (
//                     <>
//                       <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     <>
//                       <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
//                       Save Payment Details
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

// export default OfficeExpensesPayment;




import React, { useState, useEffect } from "react";
import {
  useGetRccPaymentsPendingQuery,
  useUpdateRccPaymentMutation,
} from "../../features/RCC_Office_Expenses/RccPayementSlice";

import { Image as LucideImage, Loader2, CheckCircle, Edit3, X, IndianRupee } from "lucide-react";

import Swal from "sweetalert2";

function OfficeExpensesPayment() {
  // ── Theme handling (same as VRN_Approvel1 & VRN_Approvel2) ────────────────────────────────
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

    // Initial apply
    applyTheme();

    // Listen to storage changes from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "isDarkMode") {
        applyTheme();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Extra safety interval (in case storage event is missed in some browsers)
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
  } = useGetRccPaymentsPendingQuery();

  const [updatePayment, { isLoading: isUpdating }] = useUpdateRccPaymentMutation();

  const payments = response?.data || [];
  const totalRecords = response?.totalRecords || payments.length;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [formData, setFormData] = useState({
    uid: "",
    STATUS_4: "",
    TOTAL_PAID_AMOUNT_4: "",
    BASIC_AMOUNT_4: "",
    GST_PERCENTAGE_4: "",
    CGST_4: "",
    SGST_4: "",
    NET_AMOUNT_4: "",
    PAYMENT_MODE_17: "",
    BANK_DETAILS_17: "",
    PAYMENT_DETAILS_17: "",
    PAYMENT_DATE_17: new Date().toISOString().split("T")[0],
    Remark_Blank: "",
  });

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setFormData({
      uid: payment.Office_Bill_No?.trim() || "",
      STATUS_4: "",
      TOTAL_PAID_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.PLANNED_4 || "",
      BASIC_AMOUNT_4: "",
      GST_PERCENTAGE_4: "",
      CGST_4: "",
      SGST_4: "",
      NET_AMOUNT_4: "",
      PAYMENT_MODE_17: "",
      BANK_DETAILS_17: "",
      PAYMENT_DETAILS_17: "",
      PAYMENT_DATE_17: new Date().toISOString().split("T")[0],
      Remark_Blank: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const basic = parseFloat(formData.BASIC_AMOUNT_4) || 0;
    const gstPercent = parseFloat(formData.GST_PERCENTAGE_4) || 0;
    const totalGst = basic * (gstPercent / 100);
    const cgst = totalGst / 2;
    const sgst = totalGst / 2;
    const net = basic + cgst + sgst;

    setFormData((prev) => ({
      ...prev,
      CGST_4: cgst.toFixed(2),
      SGST_4: sgst.toFixed(2),
      NET_AMOUNT_4: net.toFixed(2),
    }));
  }, [formData.BASIC_AMOUNT_4, formData.GST_PERCENTAGE_4]);

  const handleSubmit = async () => {
    console.log("Payload to backend:", formData);

    if (!formData.uid) {
      Swal.fire({
        icon: "warning",
        title: "Record ID Missing",
        text: "Bill No / UID not found!",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!formData.STATUS_4) {
      Swal.fire({
        icon: "warning",
        title: "Status Required",
        text: "Please select Status",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!formData.TOTAL_PAID_AMOUNT_4 || Number(formData.TOTAL_PAID_AMOUNT_4) <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Amount",
        text: "Please enter a valid Total Paid Amount!",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!formData.PAYMENT_DATE_17) {
      Swal.fire({
        icon: "warning",
        title: "Date Required",
        text: "Please select Payment Date!",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    if (!formData.PAYMENT_MODE_17) {
      Swal.fire({
        icon: "warning",
        title: "Payment Mode Required",
        text: "Please select Payment Mode!",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    Swal.fire({
      title: "Saving...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await updatePayment(formData).unwrap();

      await Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Payment details updated successfully!",
        confirmButtonColor: "#10b981",
        timer: 2200,
        showConfirmButton: false,
      });

      closeModal();
      refetch();
    } catch (err) {
      console.error("Update error:", err);

      let errorMessage = "Something went wrong! Please try again.";
      if (err?.data?.message) errorMessage = err.data.message;
      else if (err?.error) errorMessage = err.error;

      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: errorMessage,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className={`w-16 h-16 animate-spin ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <p className={`text-xl font-medium ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            Loading pending payments...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
            Data loading failed
          </h2>
          <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            {error?.data?.message || "Cannot load pending records"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-8 py-3 rounded-xl font-medium shadow-lg transition-all ${
              isDarkMode
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            No Pending Payments
          </h2>
          <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            All RCC office expenses payments are processed or no records are waiting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full ${
      isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>

      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>
      )}

      <div className="relative z-10 w-full space-y-8 lg:space-y-10">

        {/* Header */}
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 ${
          isDarkMode ? "bg-black/50 backdrop-blur-xl border-indigo-700/50" : "bg-white/80 backdrop-blur-md border-gray-200"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode ? "from-indigo-200 to-purple-200" : "from-indigo-600 to-purple-600"
              }`}>
                RCC Office Payment Processing
              </h1>
              <p className={`mt-2 text-base sm:text-lg lg:text-xl ${
                isDarkMode ? "text-indigo-300/90" : "text-indigo-700/90"
              }`}>
                Pending Payments • {totalRecords} record{totalRecords !== 1 ? "s" : ""}
              </p>
            </div>

            <div className={`px-6 py-4 lg:py-6 rounded-2xl border shadow-lg min-w-[140px] lg:min-w-[180px] text-center ${
              isDarkMode ? "bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-600/40" : "bg-gradient-to-br from-indigo-100 to-purple-100 border-indigo-300"
            }`}>
              <p className={`text-sm uppercase tracking-wider font-semibold mb-1 ${
                isDarkMode ? "text-purple-200" : "text-purple-800"
              }`}>Pending</p>
              <p className={`text-3xl lg:text-4xl font-black ${
                isDarkMode ? "text-white" : "text-indigo-800"
              }`}>{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-2xl border shadow-2xl w-full ${
          isDarkMode ? "border-indigo-700/50 bg-black/40 backdrop-blur-md" : "border-gray-300 bg-white/70 backdrop-blur-md"
        }`}>
          <table className="w-full min-w-[1800px] border-collapse">
            <thead>
              <tr className={`text-white ${
                isDarkMode ? "bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950" : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
              }`}>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Planned
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Bill No
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Office
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Payee
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Head
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Subhead
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Department
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Raised By
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Final Amount
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Bill
                </th>
                <th className="px-4 py-5 lg:px-6 lg:py-6 text-center text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/60">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className={`divide-y ${
              isDarkMode ? "divide-gray-800/60 bg-gray-950/10" : "divide-gray-200 bg-white/50"
            }`}>
              {payments.map((item) => (
                <tr
                  key={item.Office_Bill_No || Math.random()}
                  className={`hover transition-colors duration-150 ${
                    isDarkMode ? "hover:bg-indigo-950/40" : "hover:bg-indigo-50/80"
                  }`}
                >
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-purple-300" : "text-purple-600"} font-medium`}>
                    {item.PLANNED_4 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 font-medium font-bold text-base ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                    {item.Office_Bill_No || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {item.OFFICE_NAME_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {item.PAYEE_NAME_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {item.EXPENSES_HEAD_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    {item.EXPENSES_SUBHEAD_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.DEPARTMENT_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    {item.RAISED_BY_1 || "—"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 font-medium text-base ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                    {item.FINAL_AMOUNT_3 ? `₹${Number(item.FINAL_AMOUNT_3).toLocaleString("en-IN")}` : "—"}
                  </td>
                  <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                    {item.Bill_Photo_1 ? (
                      <a
                        href={item.Bill_Photo_1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center justify-center p-3 rounded-lg hover:scale-105 transition ${
                          isDarkMode ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70" : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                        }`}
                        title="View bill photo"
                      >
                        <LucideImage className="w-6 h-6" />
                      </a>
                    ) : (
                      <span className={`${isDarkMode ? "text-gray-600" : "text-gray-400"} text-xl`}>—</span>
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
                      title={`Process payment for ${item.Office_Bill_No}`}
                    >
                      <IndianRupee className="w-5 h-5" />
                      Pay / Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-full sm:max-w-4xl lg:max-w-5xl border max-h-[96vh] flex flex-col overflow-hidden ${
              isDarkMode ? "bg-gradient-to-b from-gray-900 to-black border-indigo-700/50" : "bg-gradient-to-b from-white to-gray-100 border-gray-300"
            }`}
          >
            {/* Header */}
            <div className={`p-5 sm:p-6 lg:p-8 flex justify-between items-center border-b shrink-0 ${
              isDarkMode ? "bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60" : "bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300"
            }`}>
              <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold truncate ${
                isDarkMode ? "text-white" : "text-indigo-800"
              }`}>
                Process Payment — {selectedPayment.Office_Bill_No}
              </h3>
              <button
                onClick={closeModal}
                className={`p-2 rounded-lg transition shrink-0 ${
                  isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800/80" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                <X className="w-7 h-7 sm:w-8 sm:h-8" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className={`flex-1 overflow-y-auto p-5 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 scrollbar-thin ${
              isDarkMode ? "scrollbar-thumb-indigo-600 scrollbar-track-gray-900/40" : "scrollbar-thumb-indigo-400 scrollbar-track-gray-200"
            }`}>
              {/* Quick Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
                <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border ${
                  isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200"
                }`}>
                  <p className={`text-xs sm:text-sm lg:text-base uppercase mb-1 sm:mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Payee
                  </p>
                  <p className={`text-lg sm:text-xl lg:text-2xl font-bold break-words ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                    {selectedPayment.PAYEE_NAME_1 || "—"}
                  </p>
                </div>
                <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border ${
                  isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200"
                }`}>
                  <p className={`text-xs sm:text-sm lg:text-base uppercase mb-1 sm:mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Final Amount
                  </p>
                  <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                    ₹{selectedPayment.FINAL_AMOUNT_3 ? Number(selectedPayment.FINAL_AMOUNT_3).toLocaleString("en-IN") : "—"}
                  </p>
                </div>
                <div className={`p-4 sm:p-5 lg:p-6 rounded-xl border ${
                  isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200"
                }`}>
                  <p className={`text-xs sm:text-sm lg:text-base uppercase mb-1 sm:mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Planned
                  </p>
                  <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-600"}`}>
                    {selectedPayment.PLANNED_4 || "—"}
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="STATUS_4"
                    value={formData.STATUS_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select Status</option>
                    <option value="Done">Done</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Total Paid Amount <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="TOTAL_PAID_AMOUNT_4"
                    value={formData.TOTAL_PAID_AMOUNT_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Amount actually paid"
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Basic Amount (without GST)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="BASIC_AMOUNT_4"
                    value={formData.BASIC_AMOUNT_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                    placeholder="Basic amount"
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    GST %
                  </label>
                  <select
                    name="GST_PERCENTAGE_4"
                    value={formData.GST_PERCENTAGE_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select GST %</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    CGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="CGST_4"
                    value={formData.CGST_4}
                    disabled
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg cursor-not-allowed ${
                      isDarkMode ? "bg-gray-800/70 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    SGST
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="SGST_4"
                    value={formData.SGST_4}
                    disabled
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg cursor-not-allowed ${
                      isDarkMode ? "bg-gray-800/70 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Net Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="NET_AMOUNT_4"
                    value={formData.NET_AMOUNT_4}
                    disabled
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg cursor-not-allowed ${
                      isDarkMode ? "bg-gray-800/70 border-gray-700 text-gray-100" : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Payment Mode
                  </label>
                  <select
                    name="PAYMENT_MODE_17"
                    value={formData.PAYMENT_MODE_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="RTGS">RTGS</option>
                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Payment Details / Cheque / Voucher
                  </label>
                  <input
                    type="text"
                    name="PAYMENT_DETAILS_17"
                    value={formData.PAYMENT_DETAILS_17}
                    onChange={handleInputChange}
                    placeholder="UTR / Transaction ID / Ref No"
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Payment Date
                  </label>
                  <input
                    type="date"
                    name="PAYMENT_DATE_17"
                    value={formData.PAYMENT_DATE_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  />
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Bank Details
                  </label>
                  <select
                    name="BANK_DETAILS_17"
                    value={formData.BANK_DETAILS_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 transition-all text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  >
                    <option value="">Select Bank</option>
                    <option value="SVC Main A/C(202)">SVC Main A/C(202)</option>
                    <option value="SVC Vendor Pay A/C(328)">SVC Vendor Pay A/C(328)</option>
                    <option value="HDFC Kabir Ahuja(341)">HDFC Kabir Ahuja(341)</option>
                    <option value="HDFC Rajeev Abott(313)">HDFC Rajeev Abott(313)</option>
                    <option value="HDFC Madhav Gupta (375)">HDFC Madhav Gupta (375)</option>
                    <option value="HDFC Scope Clg(215)">HDFC Scope Clg(215)</option>
                    <option value="ICICI RNTU(914)">ICICI RNTU(914)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className={`block text-base sm:text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                    Remark
                  </label>
                  <textarea
                    name="Remark_Blank"
                    value={formData.Remark_Blank}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Transaction note, reason for partial payment, etc."
                    className={`w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg focus:outline-none focus:ring-2 resize-y text-base sm:text-lg ${
                      isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:ring-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>

              <div className="h-16 lg:h-24"></div>
            </div>

            {/* Sticky Bottom Buttons */}
            <div className={`shrink-0 border-t p-5 sm:p-6 lg:p-8 sticky bottom-0 z-10 ${
              isDarkMode ? "bg-gradient-to-t from-black via-black/95 to-transparent border-gray-800" : "bg-gradient-to-t from-white via-white/95 to-transparent border-gray-200"
            }`}>
              <div className="flex flex-col sm:flex-row justify-end gap-4 sm:gap-5">
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className={`px-8 py-3 sm:py-4 rounded-lg font-medium transition text-base sm:text-lg w-full sm:w-auto ${
                    isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  className={`px-8 sm:px-10 py-3 sm:py-4 rounded-lg font-medium flex items-center justify-center gap-3 w-full sm:w-auto min-w-[220px] transition-all text-base sm:text-lg ${
                    isUpdating
                      ? isDarkMode ? "bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600" : "bg-gray-300 text-gray-400 cursor-not-allowed border border-gray-400"
                      : isDarkMode ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50 hover:scale-[1.02]"
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl border border-emerald-400 hover:scale-[1.02]"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                      Save Payment Details
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

export default OfficeExpensesPayment;