// import React, { useState, useEffect } from "react";
// import {
//   useGetDimPaymentsPendingQuery,
//   useUpdateDimPaymentMutation,
// } from "../../features/Dimension_Office_Expenses/DimPaymentSlice";
// import {
//   Image as LucideImage,
//   Loader2,
//   CheckCircle,
//   X,
//   IndianRupee,
// } from "lucide-react";

// import Swal from "sweetalert2";

// function Dim_Payment_Office() {
//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetDimPaymentsPendingQuery();

//   const [updatePayment, { isLoading: isUpdating }] =
//     useUpdateDimPaymentMutation();

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
//     PAYMENT_DATE_17: "",
//     Remark_Blank: "",
//   });

//   const openModal = (payment) => {
//     console.log("Opening modal for:", payment);

//     const recordId =
//       payment.Office_Bill_No ||
//       payment.OFFBILLUID ||
//       payment.uid ||
//       payment.id ||
//       "";

//     if (!recordId) {
//       alert("Error: Bill No / UID नहीं मिला इस रिकॉर्ड में।");
//       return;
//     }

//     setSelectedPayment(payment);
//     setFormData({
//       uid: recordId,
//       STATUS_4: "",
//       TOTAL_PAID_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.NET_AMOUNT_4 || "",
//       BASIC_AMOUNT_4: "",
//       GST_PERCENTAGE_4: "",
//       CGST_4: "",
//       SGST_4: "",
//       NET_AMOUNT_4: "",
//       PAYMENT_MODE_17: "",
//       BANK_DETAILS_17: "",
//       PAYMENT_DETAILS_17: "",
//       PAYMENT_DATE_17: "",
//       Remark_Blank: "",
//     });
//     setIsModalOpen(true);
//   };

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

//   const handleSubmit = async () => {
//     console.log("Payload to backend:", formData);

//     // 1. Client-side validations with SweetAlert2
//     if (!formData.uid) {
//       Swal.fire({
//         icon: "warning",
//         title: "Record ID Missing",
//         text: "Bill No / UID not found!",
//         confirmButtonColor: "#6366f1",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (!formData.STATUS_4) {
//       Swal.fire({
//         icon: "warning",
//         title: "Status Required",
//         text: "Please select Status (Done / Paid)",
//         confirmButtonColor: "#6366f1",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (
//       !formData.TOTAL_PAID_AMOUNT_4 ||
//       Number(formData.TOTAL_PAID_AMOUNT_4) <= 0
//     ) {
//       Swal.fire({
//         icon: "warning",
//         title: "Invalid Amount",
//         text: "Please enter a valid Total Paid Amount!",
//         confirmButtonColor: "#6366f1",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (!formData.PAYMENT_DATE_17) {
//       Swal.fire({
//         icon: "warning",
//         title: "Date Required",
//         text: "Please select Payment Date!",
//         confirmButtonColor: "#6366f1",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     if (!formData.PAYMENT_MODE_17) {
//       Swal.fire({
//         icon: "warning",
//         title: "Payment Mode Required",
//         text: "Please select Payment Mode!",
//         confirmButtonColor: "#6366f1",
//         confirmButtonText: "OK",
//       });
//       return;
//     }

//     // No confirmation dialog — directly proceed to saving

//     // Show loading state while API is running
//     Swal.fire({
//       title: "Saving...",
//       allowOutsideClick: false,
//       didOpen: () => {
//         Swal.showLoading();
//       },
//     });

//     try {
//       // API call
//       await updatePayment(formData).unwrap();

//       // Success message
//       await Swal.fire({
//         icon: "success",
//         title: "Success!",
//         text: "Payment details updated successfully!",
//         confirmButtonColor: "#10b981",
//         timer: 2200,
//         showConfirmButton: false,
//         position: "center",
//       });

//       // Close modal & refresh list
//       closeModal();
//       refetch();
//     } catch (err) {
//       console.error("Update error:", err);

//       let errorMessage = "Something went wrong! Please try again.";

//       // Try to show better backend error message if available
//       if (err?.data?.message) {
//         errorMessage = err.data.message;
//       } else if (err?.error) {
//         errorMessage = err.error;
//       }

//       Swal.fire({
//         icon: "error",
//         title: "Update Failed",
//         text: errorMessage,
//         confirmButtonColor: "#ef4444",
//         confirmButtonText: "OK",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
//       </div>
//     );
//   }

//   if (isError || payments.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-indigo-300">
//         No pending payments or error loading data
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
//       {/* Background effects */}
//       <div className="absolute inset-0 pointer-events-none">
//         <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
//         <div
//           className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse"
//           style={{ animationDelay: "4s" }}
//         ></div>
//       </div>

//       <div className="relative z-10 space-y-10">
//         {/* Header */}
//         <div className="bg-black/50 backdrop-blur-xl rounded-2xl border border-indigo-700/50 p-8 shadow-2xl">
//           <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
//             <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
//               Dimension Office Payment Processing
//             </h1>
//             <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 px-8 py-6 rounded-2xl border border-purple-600/40 text-center">
//               <p className="text-sm uppercase text-purple-200">Pending</p>
//               <p className="text-4xl font-black text-white">{totalRecords}</p>
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto rounded-2xl border border-indigo-700/50 bg-black/40 backdrop-blur-md shadow-2xl">
//           <table className="w-full min-w-[1800px] border-collapse">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Planned
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Bill No
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Office
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Payee
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Head
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Subhead
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Department
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Raised By
//                 </th>
//                 <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">
//                   Final Amount
//                 </th>
//                 <th className="px-6 py-6 text-center uppercase tracking-wider border-b border-indigo-700/60">
//                   Bill
//                 </th>
//                 <th className="px-6 py-6 text-center uppercase tracking-wider border-b border-indigo-700/60">
//                   Action
//                 </th>
//               </tr>
//             </thead>
//             <tbody
//               className={`divide-y ${
//                 isDarkMode
//                   ? "divide-gray-800/60 bg-gray-950/10"
//                   : "divide-gray-200 bg-white/50"
//               }`}
//             >
//               {payments.map((item) => {
//                 const rawUrl = item.Bill_Photo_1 || item.Bill_Photo || "";
//                 const photoUrl =
//                   typeof rawUrl === "string" ? rawUrl.trim() : "";

//                 // Check if photo URL is valid (not empty, not "No file uploaded", not null/undefined)
//                 const hasValidPhoto =
//                   photoUrl.length > 0 &&
//                   photoUrl !== "No file uploaded" &&
//                   photoUrl !== "null" &&
//                   photoUrl !== "undefined" &&
//                   !photoUrl.toLowerCase().includes("no file") &&
//                   photoUrl.startsWith("http");

//                 return (
//                   <tr
//                     key={item.Office_Bill_No || Math.random()}
//                     className={`hover transition-colors duration-150 ${
//                       isDarkMode
//                         ? "hover:bg-indigo-950/40"
//                         : "hover:bg-indigo-50/80"
//                     }`}
//                   >
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-purple-300" : "text-purple-600"} font-medium`}
//                     >
//                       {item.PLANNED_4 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 font-medium font-bold text-base ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}
//                     >
//                       {item.Office_Bill_No || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {item.OFFICE_NAME_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {item.PAYEE_NAME_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {item.EXPENSES_HEAD_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
//                     >
//                       {item.EXPENSES_SUBHEAD_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
//                     >
//                       {item.DEPARTMENT_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
//                     >
//                       {item.RAISED_BY_1 || "—"}
//                     </td>
//                     <td
//                       className={`px-4 py-5 lg:px-6 lg:py-6 font-medium text-base ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}
//                     >
//                       {item.FINAL_AMOUNT_3 || "—"}
//                     </td>

//                     {/* Bill Photo Column - FIXED */}
//                     <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                       {hasValidPhoto ? (
//                         <a
//                           href={photoUrl}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                           }}
//                           className={`inline-flex items-center justify-center p-3 rounded-lg hover:scale-105 transition cursor-pointer ${
//                             isDarkMode
//                               ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70"
//                               : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
//                           }`}
//                           title="View bill photo"
//                         >
//                           <LucideImage className="w-6 h-6" />
//                         </a>
//                       ) : (
//                         <span
//                           className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} text-base font-medium select-none pointer-events-none`}
//                           onClick={(e) => {
//                             e.preventDefault();
//                             e.stopPropagation();
//                           }}
//                         >
//                           N/A
//                         </span>
//                       )}
//                     </td>

//                     <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                       <button
//                         onClick={() => openModal(item)}
//                         className={`px-5 py-3 lg:py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto min-w-[140px] lg:min-w-[160px] text-base lg:text-lg ${
//                           isDarkMode
//                             ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
//                             : "bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white"
//                         }`}
//                         title={`Process payment for ${item.Office_Bill_No}`}
//                       >
//                         <IndianRupee className="w-5 h-5" />
//                         Pay / Update
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal */}
//       {isModalOpen && selectedPayment && (
//         <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-5xl border border-indigo-700/50 max-h-[95vh] flex flex-col">
//             <div className="p-6 bg-gradient-to-r from-indigo-950 to-purple-950 flex justify-between items-center border-b border-indigo-700/60">
//               <h3 className="text-2xl font-bold text-white">
//                 Process Payment — {selectedPayment.Office_Bill_No || "Record"}
//               </h3>
//               <button onClick={closeModal}>
//                 <X className="w-8 h-8 text-gray-400 hover:text-white" />
//               </button>
//             </div>

//             <div className="flex-1 overflow-y-auto p-8 space-y-8">
//               {/* Quick info cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
//                 <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-sm text-gray-400 uppercase mb-2">Payee</p>
//                   <p className="text-2xl font-bold text-indigo-300">
//                     {selectedPayment.PAYEE_NAME_1 || "—"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-sm text-gray-400 uppercase mb-2">
//                     Final Amount
//                   </p>
//                   <p className="text-3xl font-bold text-emerald-400">
//                     ₹
//                     {selectedPayment.FINAL_AMOUNT_3
//                       ? Number(selectedPayment.FINAL_AMOUNT_3).toLocaleString(
//                           "en-IN",
//                         )
//                       : "—"}
//                   </p>
//                 </div>
//                 <div className="bg-gray-900/60 p-6 rounded-xl border border-gray-800/50">
//                   <p className="text-sm text-gray-400 uppercase mb-2">
//                     Planned
//                   </p>
//                   <p className="text-3xl font-bold text-purple-300">
//                     {selectedPayment.PLANNED_4 || "—"}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Status */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Status *
//                   </label>
//                   <select
//                     name="STATUS_4"
//                     value={formData.STATUS_4}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select</option>
//                     <option value="Done">Done</option>
//                     {/* <option value="Paid">Paid</option> */}
//                   </select>
//                 </div>

//                 {/* Total Paid Amount */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Total Paid Amount *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="TOTAL_PAID_AMOUNT_4"
//                     value={formData.TOTAL_PAID_AMOUNT_4}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* Basic Amount */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Basic Amount
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     name="BASIC_AMOUNT_4"
//                     value={formData.BASIC_AMOUNT_4}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* GST % Dropdown */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     GST %
//                   </label>
//                   <select
//                     name="GST_PERCENTAGE_4"
//                     value={formData.GST_PERCENTAGE_4}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select GST %</option>
//                     <option value="0">0%</option>
//                     <option value="5">5%</option>
//                     <option value="12">12%</option>
//                     <option value="18">18%</option>
//                   </select>
//                 </div>

//                 {/* CGST read only */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     CGST
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.CGST_4}
//                     readOnly
//                     className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* SGST read only */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     SGST
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.SGST_4}
//                     readOnly
//                     className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Net Amount read only */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Net Amount
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.NET_AMOUNT_4}
//                     readOnly
//                     className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Payment Mode Dropdown */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Payment Mode *
//                   </label>
//                   <select
//                     name="PAYMENT_MODE_17"
//                     value={formData.PAYMENT_MODE_17}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select Payment Mode</option>
//                     <option value="cash">Cash</option>
//                     <option value="cheque">Cheque</option>
//                     <option value="RTGS">RTGS</option>
//                     <option value="NEFT">NEFT</option>
//                   </select>
//                 </div>

//                 {/* Payment Details */}
//                 <div className="space-y-3 md:col-span-2">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Payment Details / Cheque / Voucher
//                   </label>
//                   <input
//                     type="text"
//                     name="PAYMENT_DETAILS_17"
//                     value={formData.PAYMENT_DETAILS_17}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Payment Details / Cheque / Voucher"
//                   />
//                 </div>

//                 {/* Bank Details Dropdown */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Bank Details
//                   </label>
//                   <select
//                     name="BANK_DETAILS_17"
//                     value={formData.BANK_DETAILS_17}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   >
//                     <option value="">Select Bank</option>
//                     <option value=" SVC Main A/C(202)">
//                       {" "}
//                       SVC Main A/C(202)
//                     </option>
//                     <option value="SVC Vendor Pay A/C(328)">
//                       SVC Vendor Pay A/C(328)
//                     </option>
//                     <option value="HDFC Kabir Ahuja(341)">
//                       HDFC Kabir Ahuja(341)
//                     </option>
//                     <option value="HDFC Rajeev Abott(313)">
//                       HDFC Rajeev Abott(313)
//                     </option>
//                     <option value="HDFC Madhav Gupta (375)">
//                       HDFC Madhav Gupta (375)
//                     </option>
//                     <option value="HDFC Scope Clg(215)">
//                       HDFC Scope Clg(215)
//                     </option>
//                     <option value="ICICI RNTU(914)">ICICI RNTU(914)</option>
//                     <option value="Cash">Cash</option>
//                   </select>
//                 </div>

//                 {/* Payment Date */}
//                 <div className="space-y-3">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Payment Date *
//                   </label>
//                   <input
//                     type="date"
//                     name="PAYMENT_DATE_17"
//                     value={formData.PAYMENT_DATE_17}
//                     onChange={handleInputChange}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                   />
//                 </div>

//                 {/* Remark */}
//                 <div className="space-y-3 md:col-span-2">
//                   <label className="block text-lg font-medium text-gray-200">
//                     Remark
//                   </label>
//                   <textarea
//                     name="Remark_Blank"
//                     value={formData.Remark_Blank}
//                     onChange={handleInputChange}
//                     rows={3}
//                     className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500"
//                     placeholder="Any notes..."
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="border-t border-gray-800 p-6 bg-black/90 sticky bottom-0">
//               <div className="flex justify-end gap-4">
//                 <button
//                   onClick={closeModal}
//                   disabled={isUpdating}
//                   className="px-10 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isUpdating}
//                   className={`px-10 py-4 rounded-lg flex items-center gap-3 min-w-[240px] justify-center ${isUpdating ? "bg-gray-700 text-gray-500" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"}`}
//                 >
//                   {isUpdating ? (
//                     <Loader2 className="w-6 h-6 animate-spin" />
//                   ) : (
//                     <CheckCircle className="w-6 h-6" />
//                   )}
//                   {isUpdating ? "Updating..." : "Save Payment"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dim_Payment_Office;




import React, { useState, useEffect } from "react";
import {
  useGetDimPaymentsPendingQuery,
  useUpdateDimPaymentMutation,
} from "../../features/Dimension_Office_Expenses/DimPaymentSlice";
import {
  Image as LucideImage,
  Loader2,
  CheckCircle,
  X,
  IndianRupee,
} from "lucide-react";
import Swal from "sweetalert2";

function Dim_Payment_Office() {
  // Theme handling - वही जो तुम्हारे काम करने वाले कोड में है (interval + storage event)
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
  } = useGetDimPaymentsPendingQuery();

  const [updatePayment, { isLoading: isUpdating }] = useUpdateDimPaymentMutation();

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
    PAYMENT_DATE_17: "",
    Remark_Blank: "",
  });

  const openModal = (payment) => {
    console.log("Opening modal for:", payment);

    const recordId =
      payment.Office_Bill_No ||
      payment.OFFBILLUID ||
      payment.uid ||
      payment.id ||
      "";

    if (!recordId) {
      Swal.fire({
        icon: "warning",
        title: "Record ID Missing",
        text: "Bill No / UID not found in this record!",
        confirmButtonColor: "#6366f1",
      });
      return;
    }

    setSelectedPayment(payment);
    setFormData({
      uid: recordId,
      STATUS_4: "",
      TOTAL_PAID_AMOUNT_4: payment.FINAL_AMOUNT_3 || payment.NET_AMOUNT_4 || payment.PLANNED_4 || "",
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

  if (isError || payments.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>
            {isError ? "Data loading failed" : "No Pending Payments"}
          </h2>
          <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {isError ? (error?.data?.message || "Cannot load records") : "All payments are processed or no records available."}
          </p>
          <button 
            onClick={refetch}
            className={`px-8 py-3 rounded-xl font-medium transition border ${
              isDarkMode 
                ? 'bg-gray-800/70 text-gray-200 hover:bg-gray-700 border-indigo-600/50'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border-gray-400'
            }`}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 ${
      isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
    }`}>

      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "4s" }}></div>
        </div>
      )}

      <div className="relative z-10 space-y-10">

        {/* Header */}
        <div className={`rounded-2xl border shadow-2xl p-8 ${
          isDarkMode ? "bg-black/50 backdrop-blur-xl border-indigo-700/50" : "bg-white/80 backdrop-blur-md border-gray-200"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <h1 className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
              isDarkMode ? "from-indigo-200 to-purple-200" : "from-indigo-600 to-purple-700"
            }`}>
              Dimension Office Payment Processing
            </h1>
            <div className={`px-8 py-6 rounded-2xl border text-center min-w-[160px] ${
              isDarkMode ? "bg-gradient-to-br from-purple-900/70 to-indigo-900/70 border-purple-600/40" : "bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200"
            }`}>
              <p className={`text-sm uppercase tracking-wider font-semibold ${isDarkMode ? "text-purple-200" : "text-purple-800"}`}>Pending</p>
              <p className={`text-4xl font-black ${isDarkMode ? "text-white" : "text-indigo-900"}`}>{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-2xl border shadow-2xl ${
          isDarkMode ? "border-indigo-700/50 bg-black/40 backdrop-blur-md" : "border-gray-300 bg-white/70 backdrop-blur-md"
        }`}>
          <table className="w-full min-w-[1800px] border-collapse">
            <thead>
              <tr className={`text-white ${
                isDarkMode ? "bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950" : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600"
              }`}>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Planned</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Bill No</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Office</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Payee</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Head</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Subhead</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Department</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Raised By</th>
                <th className="px-6 py-6 text-left uppercase tracking-wider border-b border-indigo-700/60">Final Amount</th>
                <th className="px-6 py-6 text-center uppercase tracking-wider border-b border-indigo-700/60">Bill</th>
                <th className="px-6 py-6 text-center uppercase tracking-wider border-b border-indigo-700/60">Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDarkMode ? "divide-gray-800/60 bg-gray-950/10" : "divide-gray-200 bg-white/50"
            }`}>
              {payments.map((item) => {
                const rawUrl = item.Bill_Photo_1 || item.Bill_Photo || "";
                const photoUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";

                const hasValidPhoto =
                  photoUrl.length > 0 &&
                  photoUrl !== "No file uploaded" &&
                  photoUrl !== "null" &&
                  photoUrl !== "undefined" &&
                  !photoUrl.toLowerCase().includes("no file") &&
                  photoUrl.startsWith("http");

                return (
                  <tr
                    key={item.Office_Bill_No || Math.random()}
                    className={`hover transition-colors duration-150 ${
                      isDarkMode ? "hover:bg-indigo-950/40" : "hover:bg-indigo-50/70"
                    }`}
                  >
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-purple-300" : "text-purple-700"} font-medium`}>{item.PLANNED_4 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 font-bold text-base ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>{item.Office_Bill_No || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.OFFICE_NAME_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.PAYEE_NAME_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.EXPENSES_HEAD_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.EXPENSES_SUBHEAD_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.DEPARTMENT_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.RAISED_BY_1 || "—"}</td>
                    <td className={`px-4 py-5 lg:px-6 lg:py-6 font-medium text-base ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                      {item.FINAL_AMOUNT_3 ? `₹${Number(item.FINAL_AMOUNT_3).toLocaleString("en-IN")}` : "—"}
                    </td>

                    <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                      {hasValidPhoto ? (
                        <a
                          href={photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`inline-flex items-center justify-center p-3 rounded-lg hover:scale-105 transition cursor-pointer ${
                            isDarkMode ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70" : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                          }`}
                          title="View bill photo"
                        >
                          <LucideImage className="w-6 h-6" />
                        </a>
                      ) : (
                        <span
                          className={`${isDarkMode ? "text-gray-500" : "text-gray-400"} text-base font-medium select-none pointer-events-none`}
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
                        title={`Process payment for ${item.Office_Bill_No || "record"}`}
                      >
                        <IndianRupee className="w-5 h-5" />
                        Pay / Update
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
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-5xl max-h-[96vh] flex flex-col border overflow-hidden ${
              isDarkMode
                ? "bg-gradient-to-b from-gray-900 to-black border-indigo-700/50"
                : "bg-gradient-to-b from-white to-gray-50 border-gray-300 shadow-xl"
            }`}
          >
            <div
              className={`p-6 flex justify-between items-center border-b shrink-0 ${
                isDarkMode ? "bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/60" : "bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300"
              }`}
            >
              <h3 className={`text-2xl font-bold truncate ${isDarkMode ? "text-white" : "text-indigo-900"}`}>
                Process Payment — {selectedPayment.Office_Bill_No || "Record"}
              </h3>
              <button
                onClick={closeModal}
                className={`p-2 rounded-full transition ${isDarkMode ? "text-gray-400 hover:text-white hover:bg-gray-800/60" : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"}`}
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 scrollbar-thin ${isDarkMode ? "scrollbar-thumb-indigo-600 scrollbar-track-gray-900/40" : "scrollbar-thumb-indigo-400 scrollbar-track-gray-200"}`}>
              {/* Quick Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200 shadow-sm"}`}>
                  <p className={`text-sm uppercase mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Payee</p>
                  <p className={`text-2xl font-bold ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>{selectedPayment.PAYEE_NAME_1 || "—"}</p>
                </div>
                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200 shadow-sm"}`}>
                  <p className={`text-sm uppercase mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Final Amount</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                    ₹{selectedPayment.FINAL_AMOUNT_3 ? Number(selectedPayment.FINAL_AMOUNT_3).toLocaleString("en-IN") : "—"}
                  </p>
                </div>
                <div className={`p-6 rounded-xl border ${isDarkMode ? "bg-gray-900/60 border-gray-800/50" : "bg-white border-gray-200 shadow-sm"}`}>
                  <p className={`text-sm uppercase mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Planned</p>
                  <p className={`text-3xl font-bold ${isDarkMode ? "text-purple-300" : "text-purple-700"}`}>{selectedPayment.PLANNED_4 || "—"}</p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="STATUS_4"
                    value={formData.STATUS_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    <option value="">Select Status</option>
                    <option value="Done">Done</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Total Paid Amount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="TOTAL_PAID_AMOUNT_4"
                    value={formData.TOTAL_PAID_AMOUNT_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="Enter total paid amount"
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Basic Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    name="BASIC_AMOUNT_4"
                    value={formData.BASIC_AMOUNT_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="Enter basic amount"
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>GST Percentage (%)</label>
                  <select
                    name="GST_PERCENTAGE_4"
                    value={formData.GST_PERCENTAGE_4}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    <option value="">Select GST %</option>
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>CGST</label>
                  <input
                    type="text"
                    value={formData.CGST_4}
                    readOnly
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-900/40 border-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>SGST</label>
                  <input
                    type="text"
                    value={formData.SGST_4}
                    readOnly
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-900/40 border-gray-700 text-gray-400 cursor-not-allowed" : "bg-gray-100 border-gray-300 text-gray-600 cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Net Amount</label>
                  <input
                    type="text"
                    value={formData.NET_AMOUNT_4}
                    readOnly
                    className={`w-full px-4 py-3 rounded-lg border text-base font-bold ${isDarkMode ? "bg-gray-900/40 border-gray-700 text-emerald-400 cursor-not-allowed" : "bg-gray-100 border-gray-300 text-emerald-700 cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Payment Mode <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="PAYMENT_MODE_17"
                    value={formData.PAYMENT_MODE_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="cash">Cash</option>
                    <option value="cheque">Cheque</option>
                    <option value="RTGS">RTGS</option>
                    <option value="NEFT">NEFT</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Bank Details</label>
                  <select
                    name="BANK_DETAILS_17"
                    value={formData.BANK_DETAILS_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  >
                    <option value="">Select Bank</option>
                    <option value=" SVC Main A/C(202)">SVC Main A/C(202)</option>
                    <option value="SVC Vendor Pay A/C(328)">SVC Vendor Pay A/C(328)</option>
                    <option value="HDFC Kabir Ahuja(341)">HDFC Kabir Ahuja(341)</option>
                    <option value="HDFC Rajeev Abott(313)">HDFC Rajeev Abott(313)</option>
                    <option value="HDFC Madhav Gupta (375)">HDFC Madhav Gupta (375)</option>
                    <option value="HDFC Scope Clg(215)">HDFC Scope Clg(215)</option>
                    <option value="ICICI RNTU(914)">ICICI RNTU(914)</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Payment Details (Txn ID / Cheque No)</label>
                  <input
                    type="text"
                    name="PAYMENT_DETAILS_17"
                    value={formData.PAYMENT_DETAILS_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                    placeholder="Enter transaction ID or cheque number"
                  />
                </div>

                <div>
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Payment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="PAYMENT_DATE_17"
                    value={formData.PAYMENT_DATE_17}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-base font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Remark</label>
                  <textarea
                    name="Remark_Blank"
                    value={formData.Remark_Blank}
                    onChange={handleInputChange}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg border text-base ${isDarkMode ? "bg-gray-800 border-gray-700 text-white focus:border-indigo-500" : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500"} focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none`}
                    placeholder="Any additional remarks or notes..."
                  />
                </div>
              </div>
            </div>

            <div
              className={`border-t p-6 sticky bottom-0 z-10 ${
                isDarkMode ? "bg-gradient-to-t from-black via-black/95 to-transparent border-gray-800" : "bg-gradient-to-t from-white via-white/95 to-transparent border-gray-200"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={closeModal}
                  disabled={isUpdating}
                  className={`px-10 py-4 rounded-lg font-medium transition ${isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating}
                  className={`px-10 py-4 rounded-lg font-medium flex items-center justify-center gap-3 min-w-[240px] transition-all ${
                    isUpdating
                      ? isDarkMode
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                      : isDarkMode
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
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

export default Dim_Payment_Office;