


// import React, { useState } from "react";
// import {
//   useGetPendingTransfersQuery,
//   useUpdateActualBankTransferMutation,
// } from '../../features/Payment/bank_to_bank_transfer_slice';
// import { X, FileText, Loader2 } from "lucide-react";

// const Transfer_bank_To_bank = () => {
//   const {
//     data: pendingTransfers = [],
//     isLoading,
//     isError,
//     refetch,
//   } = useGetPendingTransfersQuery();

//   const [updateActualBankTransfer, { isLoading: isUpdating }] = useUpdateActualBankTransferMutation();

//   const [selectedRow, setSelectedRow] = useState(null);
//   const [status, setStatus] = useState("");
//   const [remark, setRemark] = useState("");

//   const openUpdateModal = (row) => {
//     setSelectedRow(row);
//     setStatus("");
//     setRemark("");
//   };

//   const closeModal = () => {
//     setSelectedRow(null);
//     setStatus("");
//     setRemark("");
//   };

//   const handleUpdate = async () => {
//     if (!status.trim()) {
//       alert("Status is required!");
//       return;
//     }

//     try {
//       await updateActualBankTransfer({
//         UID: selectedRow.uid,
//         status: status.trim(),
//         remark: remark.trim(),
//       }).unwrap();

//       alert("Actual Bank Transfer updated successfully!");
//       closeModal();
//       refetch();
//     } catch (err) {
//       alert("Update failed: " + (err?.data?.message || "Server error"));
//     }
//   };

//   const totalAmount = pendingTransfers.reduce((sum, item) => {
//     return sum + Number(item.Amount?.replace(/[₹,]/g, "") || 0);
//   }, 0);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-5">
//           <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
//           <p className="text-xl font-medium text-indigo-300">Loading pending transfers...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading data</h2>
//           <p className="text-gray-300 mb-6">Unable to fetch pending bank transfers.</p>
//           <button 
//             onClick={refetch}
//             className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (pendingTransfers.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
//         <div className="text-center max-w-md">
//           <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Transfers</h2>
//           <p className="text-gray-400 mb-8">All bank-to-bank transfers have been updated with actual status.</p>
//           <button 
//             onClick={refetch}
//             className="px-8 py-3 bg-gray-800/70 text-gray-200 rounded-xl font-medium hover:bg-gray-700 transition border border-indigo-600/50"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full">

//       {/* Animated background orbs */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
//         <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
//         <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(25)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-15"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${12 + Math.random() * 15}s linear infinite`,
//               animationDelay: `${Math.random() * 10}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Main content – full width, no max restriction */}
//       <div className="relative z-10 w-full space-y-8 lg:space-y-10">

//         {/* Header */}
//         <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-indigo-700/40 p-6 sm:p-8 lg:p-10 xl:p-12 shadow-2xl w-full">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
//             <div>
//               <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
//                 Bank to Bank Transfer
//               </h1>
//               <p className="text-indigo-300/80 mt-2 text-base sm:text-lg lg:text-xl">
//                 Pending Actual Updates • {pendingTransfers.length} records
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 p-6 lg:p-8 rounded-2xl border border-emerald-700/40 shadow-xl min-w-[280px] lg:min-w-[360px] text-center lg:text-left">
//               <p className="text-xs uppercase tracking-wider text-emerald-200 font-semibold opacity-90 mb-2">
//                 Total Pending Amount
//               </p>
//               <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
//                 ₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Table – full width */}
//         <div className="overflow-x-auto rounded-2xl border border-indigo-700/40 bg-black/30 backdrop-blur-md shadow-2xl w-full">
//           <table className="w-full min-w-[1400px] border-collapse">
//             <thead>
//               <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
//                 {[
//                   "Planned",
//                   "UID",
//                   "From A/c",
//                   "To A/c",
//                   "Amount",
//                   "Mode",
//                   "Details",
//                   "Date",
//                   "Remark",
//                   "Action",
//                 ].map((header) => (
//                   <th
//                     key={header}
//                     className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/50 whitespace-nowrap"
//                   >
//                     {header}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-gray-800/50 bg-gray-900/10">
//               {pendingTransfers.map((row) => (
//                 <tr
//                   key={row.uid}
//                   className="hover:bg-indigo-950/30 transition-colors duration-150"
//                 >
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                     <span className="inline-block px-3 py-1.5 text-xs lg:text-sm bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
//                       {row.planned2 || "-"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6">
//                     <span className="inline-block px-3 py-1.5 text-xs lg:text-sm bg-indigo-900/50 rounded font-medium text-indigo-300 border border-indigo-700/40">
//                       {row.uid}
//                     </span>
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate" title={row.Transfer_A_C_Name}>
//                     {row.Transfer_A_C_Name || "-"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate" title={row.Transfer_Received_A_C_Name}>
//                     {row.Transfer_Received_A_C_Name || "-"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-emerald-400 font-medium text-base lg:text-lg">
//                     ₹{row.Amount || "0"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6">
//                     <span className="inline-block px-3 py-1.5 text-xs lg:text-sm bg-purple-900/50 text-purple-300 rounded border border-purple-700/40">
//                       {row.PaymentMode || "-"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-md truncate text-base">
//                     {row.PAYMENT_DETAILS || "-"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base">
//                     {row.PAYMENT_DATE || "-"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate text-base">
//                     {row.Remark || "-"}
//                   </td>
//                   <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
//                     <button
//                       onClick={() => openUpdateModal(row)}
//                       className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md hover:scale-105"
//                       title="Update Status"
//                     >
//                       <FileText className="w-6 h-6" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Modal – wider */}
//       {selectedRow && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
//           <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-3xl lg:max-w-5xl border border-indigo-700/40 overflow-hidden">
//             <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-6 lg:p-8 flex justify-between items-center border-b border-indigo-700/50">
//               <h3 className="text-2xl lg:text-3xl font-bold text-white">Update Actual Bank Transfer</h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-white transition p-2"
//               >
//                 <X className="w-8 h-8" />
//               </button>
//             </div>

//             <div className="p-6 lg:p-10 space-y-8">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
//                 <div className="bg-gray-800/60 p-5 lg:p-6 rounded-xl border border-gray-700/50">
//                   <p className="text-sm lg:text-base text-gray-400 uppercase mb-2">UID</p>
//                   <p className="text-xl lg:text-2xl font-medium text-indigo-300 break-all">{selectedRow.uid}</p>
//                 </div>
//                 <div className="bg-gray-800/60 p-5 lg:p-6 rounded-xl border border-gray-700/50">
//                   <p className="text-sm lg:text-base text-gray-400 uppercase mb-2">Amount</p>
//                   <p className="text-2xl lg:text-3xl font-bold text-emerald-400">₹{selectedRow.Amount}</p>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-base lg:text-lg font-medium text-gray-200">
//                   Status <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   className="w-full px-5 py-4 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base lg:text-lg"
//                 >
//                   <option value="">──── Select Status ────</option>
//                   <option value="Done">Done</option>
//                   <option value="Cancel">Cancel</option>
//                   <option value="Pending">Pending</option>
//                   <option value="Failed">Failed</option>
//                 </select>
//               </div>

//               <div className="space-y-4">
//                 <label className="block text-base lg:text-lg font-medium text-gray-200">Remark (optional)</label>
//                 <textarea
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   rows={4}
//                   className="w-full px-5 py-4 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-base lg:text-lg"
//                   placeholder="Add any note or reason..."
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row justify-end gap-5 pt-6 border-t border-gray-800">
//                 <button
//                   onClick={closeModal}
//                   className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition text-base lg:text-lg font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdate}
//                   disabled={isUpdating}
//                   className={`px-10 py-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all text-base lg:text-lg min-w-[180px] ${
//                     isUpdating
//                       ? "bg-indigo-700/70 text-white cursor-not-allowed"
//                       : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02]"
//                   }`}
//                 >
//                   {isUpdating ? (
//                     <>
//                       <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
//                       Updating...
//                     </>
//                   ) : (
//                     "Update Status"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Animation keyframes */}
//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}30px, -60px); }
//         }
//         .animate-pulse-slow {
//           animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 0.25; transform: scale(1); }
//           50% { opacity: 0.45; transform: scale(1.1); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Transfer_bank_To_bank;




import React, { useState, useEffect } from "react";
import {
  useGetPendingTransfersQuery,
  useUpdateActualBankTransferMutation,
} from '../../features/Payment/bank_to_bank_transfer_slice';
import { X, FileText, Loader2 } from "lucide-react";
import Swal from 'sweetalert2';

const Transfer_bank_To_bank = () => {
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
    data: pendingTransfers = [],
    isLoading,
    isError,
    refetch,
  } = useGetPendingTransfersQuery();

  const [updateActualBankTransfer, { isLoading: isUpdating }] = useUpdateActualBankTransferMutation();

  const [selectedRow, setSelectedRow] = useState(null);
  const [status, setStatus] = useState("");
  const [remark, setRemark] = useState("");

  const openUpdateModal = (row) => {
    setSelectedRow(row);
    setStatus("");
    setRemark("");
  };

  const closeModal = () => {
    setSelectedRow(null);
    setStatus("");
    setRemark("");
  };

  const handleUpdate = async () => {
    if (!status.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Status Required',
        text: 'Please enter a status',
        confirmButtonColor: '#6366f1',
      });
      return;
    }

    Swal.fire({
      title: 'Updating...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await updateActualBankTransfer({
        UID: selectedRow.uid,
        status: status.trim(),
        remark: remark.trim(),
      }).unwrap();

      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Actual Bank Transfer updated successfully!',
        confirmButtonColor: '#10b981',
        timer: 2200,
        showConfirmButton: false,
      });

      closeModal();
      refetch();
    } catch (err) {
      console.error('Update failed:', err);

      let errorMessage = 'Something went wrong. Please try again.';
      if (err?.data?.message) errorMessage = err.data.message;
      else if (err?.error) errorMessage = err.error;

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const totalAmount = pendingTransfers.reduce((sum, item) => {
    return sum + Number(item.Amount?.replace(/[₹,]/g, "") || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className={`w-16 h-16 animate-spin ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <p className={`text-xl font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            Loading pending transfers...
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
            Error loading data
          </h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Unable to fetch pending bank transfers.
          </p>
          <button 
            onClick={refetch}
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

  if (pendingTransfers.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 ${
        isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="text-center max-w-md">
          <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
            No Pending Transfers
          </h2>
          <p className={`mb-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            All bank-to-bank transfers have been updated with actual status.
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
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full ${
      isDarkMode ? 'bg-gradient-to-br from-black via-indigo-950 to-purple-950' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>

      {/* Background orbs - only in dark mode */}
      {isDarkMode && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse-slow"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
          <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-15 ${
              isDarkMode ? 'bg-white' : 'bg-gray-900'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${12 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full space-y-8 lg:space-y-10">

        {/* Header */}
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 ${
          isDarkMode ? 'bg-black/40 backdrop-blur-xl border-indigo-700/40' : 'bg-white/80 backdrop-blur-md border-gray-300'
        }`}>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                isDarkMode ? 'from-indigo-200 via-purple-200 to-indigo-200' : 'from-indigo-600 via-purple-600 to-indigo-600'
              }`}>
                Bank to Bank Transfer
              </h1>
              <p className={`mt-2 text-base sm:text-lg lg:text-xl ${
                isDarkMode ? 'text-indigo-300/80' : 'text-indigo-700/80'
              }`}>
                Pending Actual Updates • {pendingTransfers.length} records
              </p>
            </div>

            <div className={`p-6 lg:p-8 rounded-2xl border shadow-xl min-w-[280px] lg:min-w-[360px] text-center lg:text-left ${
              isDarkMode 
                ? 'bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border-emerald-700/40' 
                : 'bg-gradient-to-br from-emerald-100/60 to-teal-100/60 border-emerald-300'
            }`}>
              <p className={`text-xs uppercase tracking-wider font-semibold mb-2 opacity-90 ${
                isDarkMode ? 'text-emerald-200' : 'text-emerald-800'
              }`}>
                Total Pending Amount
              </p>
              <p className={`text-3xl sm:text-4xl lg:text-5xl font-black ${
                isDarkMode ? 'text-white' : 'text-emerald-900'
              }`}>
                ₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto rounded-2xl border shadow-2xl w-full ${
          isDarkMode ? 'border-indigo-700/40 bg-black/30 backdrop-blur-md' : 'border-gray-300 bg-white/70 backdrop-blur-md'
        }`}>
          <table className="w-full min-w-[1400px] border-collapse">
            <thead>
              <tr className={`text-white ${
                isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600'
              }`}>
                {[
                  "Planned",
                  "UID",
                  "From A/c",
                  "To A/c",
                  "Amount",
                  "Mode",
                  "Details",
                  "Date",
                  "Remark",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-5 lg:px-6 lg:py-6 text-left text-sm lg:text-base font-semibold uppercase tracking-wider border-b border-indigo-700/50 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className={`divide-y ${
              isDarkMode ? 'divide-gray-800/50 bg-gray-900/10' : 'divide-gray-200 bg-white/50'
            }`}>
              {pendingTransfers.map((row) => (
                <tr
                  key={row.uid}
                  className={`hover transition-colors duration-150 ${
                    isDarkMode ? 'hover:bg-indigo-950/30' : 'hover:bg-indigo-50/30'
                  }`}
                >
                  <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                    <span className={`inline-block px-3 py-1.5 text-xs lg:text-sm bg-purple-900/40 text-purple-300 rounded border border-purple-700/40`}>
                      {row.planned2 || "-"}
                    </span>
                  </td>
                  <td className="px-4 py-5 lg:px-6 lg:py-6">
                    <span className={`inline-block px-3 py-1.5 text-xs lg:text-sm bg-indigo-900/50 rounded font-medium text-indigo-300 border border-indigo-700/40`}>
                      {row.uid}
                    </span>
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} title={row.Transfer_A_C_Name}>
                    {row.Transfer_A_C_Name || "-"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`} title={row.Transfer_Received_A_C_Name}>
                    {row.Transfer_Received_A_C_Name || "-"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-emerald-400 font-medium text-base lg:text-lg ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ₹{row.Amount || "0"}
                  </td>
                  <td className="px-4 py-5 lg:px-6 lg:py-6">
                    <span className={`inline-block px-3 py-1.5 text-xs lg:text-sm bg-purple-900/50 text-purple-300 rounded border border-purple-700/40`}>
                      {row.PaymentMode || "-"}
                    </span>
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-md truncate text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {row.PAYMENT_DETAILS || "-"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-gray-300 text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {row.PAYMENT_DATE || "-"}
                  </td>
                  <td className={`px-4 py-5 lg:px-6 lg:py-6 text-gray-200 max-w-xs lg:max-w-md truncate text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {row.Remark || "-"}
                  </td>
                  <td className="px-4 py-5 lg:px-6 lg:py-6 text-center">
                    <button
                      onClick={() => openUpdateModal(row)}
                      className={`p-3 rounded-lg transition shadow-md hover:scale-105 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600'
                      }`}
                      title="Update Status"
                    >
                      <FileText className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className={`rounded-2xl shadow-2xl w-full max-w-3xl lg:max-w-5xl border overflow-hidden ${
            isDarkMode ? 'bg-gradient-to-b from-gray-900 to-black border-indigo-700/40' : 'bg-gradient-to-b from-white to-gray-100 border-gray-300'
          }`}>
            <div className={`p-6 lg:p-8 flex justify-between items-center border-b ${
              isDarkMode ? 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700/50' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300'
            }`}>
              <h3 className={`text-2xl lg:text-3xl font-bold ${
                isDarkMode ? 'text-white' : 'text-indigo-800'
              }`}>
                Update Actual Bank Transfer
              </h3>
              <button
                onClick={closeModal}
                className={`transition p-2 ${
                  isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 lg:p-10 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div className={`p-5 lg:p-6 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm lg:text-base uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>UID</p>
                  <p className={`text-xl lg:text-2xl font-medium break-all ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    {selectedRow.uid}
                  </p>
                </div>
                <div className={`p-5 lg:p-6 rounded-xl border ${
                  isDarkMode ? 'bg-gray-800/60 border-gray-700/50' : 'bg-gray-50 border-gray-200'
                }`}>
                  <p className={`text-sm lg:text-base uppercase mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Amount</p>
                  <p className={`text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    ₹{selectedRow.Amount}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <label className={`block text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 text-base lg:text-lg ${
                    isDarkMode 
                      ? 'bg-gray-800/70 border-gray-700 text-gray-200 focus:ring-indigo-500'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'
                  }`}
                >
                  <option value="">──── Select Status ────</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancel</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className={`block text-base lg:text-lg font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Remark (optional)
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={4}
                  placeholder="Add any note or reason..."
                  className={`w-full px-5 py-4 rounded-lg focus:outline-none focus:ring-2 resize-y text-base lg:text-lg ${
                    isDarkMode 
                      ? 'bg-gray-800/70 border-gray-700 text-gray-200 focus:ring-indigo-500'
                      : 'bg-white border-gray-300 text-gray-800 focus:ring-indigo-500'
                  }`}
                />
              </div>

              <div className={`flex flex-col sm:flex-row justify-end gap-5 pt-6 border-t ${
                isDarkMode ? 'border-gray-800' : 'border-gray-200'
              }`}>
                <button
                  onClick={closeModal}
                  className={`px-8 py-4 rounded-lg transition text-base lg:text-lg font-medium ${
                    isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className={`px-10 py-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all text-base lg:text-lg min-w-[180px] ${
                    isUpdating
                      ? isDarkMode ? 'bg-indigo-700/70 text-white cursor-not-allowed' : 'bg-indigo-300 text-white cursor-not-allowed'
                      : isDarkMode 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isUpdating ? (
                    <>
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
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
};

export default Transfer_bank_To_bank;