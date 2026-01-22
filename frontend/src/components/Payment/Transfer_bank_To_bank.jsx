// import React, { useState } from "react";
// import {
//   useGetPendingTransfersQuery,
//   useUpdateActualBankTransferMutation,
// } from '../../features/Payment/bank_to_bank_transfer_slice'; // Path apne project ke hisab se adjust kar lena
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
//       <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
//           <p className="text-xl font-bold text-gray-700">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading data</h2>
//           <button 
//             onClick={refetch} 
//             className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (pendingTransfers.length === 0) {
//     return (
//       <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-700 mb-4">No Pending Transfers</h2>
//           <p className="text-gray-500 mb-8">All bank-to-bank transfers have been updated.</p>
//           <button 
//             onClick={refetch} 
//             className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
//           >
//             Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border">
//       <div className="max-w-full mx-auto space-y-4">
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Bank to Bank Transfer - Pending Actual Updates
//           </h1>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-xl text-white shadow-md">
//             <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
//               Total Pending Amount
//             </p>
//             <p className="text-2xl font-black mt-2">
//               ₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
//             </p>
//           </div>
//           <div className="bg-white p-5 rounded-xl border-l-4 border-yellow-400 shadow-sm">
//             <p className="text-gray-400 text-[10px] font-bold uppercase">
//               Pending Transfers
//             </p>
//             <p className="text-2xl font-black text-gray-800 mt-2">
//               {pendingTransfers.length}
//             </p>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="w-full">
//             <table className="w-full text-left border-collapse">
//               <thead className="bg-gray-800 text-white">
//                 <tr>
//                   {[
//                     "Planned",
//                     "UID",
//                     "From A/c",
//                     "To A/c",
//                     "Amount",
//                     "Mode",
//                     "Details",
//                     "Date",
//                     "Remark",
//                     "Action",
//                   ].map((header) => (
//                     <th
//                       key={header}
//                       className="px-3 py-3 text-[10px] font-bold uppercase whitespace-normal"
//                     >
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-50">
//                 {pendingTransfers.map((row) => (
                  
//                   <tr key={row.uid} className="hover:bg-gray-50">
//                     <td className="px-3 py-4 text-center">
//                       <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
//                         {row.planned2 || "-"}
//                       </span>
//                     </td>
//                     <td className="px-3 py-4 text-[11px] font-bold">
//                       <span className="inline-block px-2 py-1 text-xs bg-blue-100 rounded font-bold text-blue-700">
//                         {row.uid}
//                       </span>
//                     </td>
//                     <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">
//                       {row.Transfer_A_C_Name}
//                     </td>
//                     <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">
//                       {row.Transfer_Received_A_C_Name}
//                     </td>
//                     <td className="px-3 py-4 text-[11px] font-medium text-blue-600">
//                       ₹{row.Amount}
//                     </td>
//                     <td className="px-3 py-4 text-[11px]">
//                       <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
//                         {row.PaymentMode}
//                       </span>
//                     </td>
//                     <td className="px-3 py-4 text-[11px] break-words max-w-xs">
//                       {row.PAYMENT_DETAILS || "-"}
//                     </td>
//                     <td className="px-3 py-4 text-[11px] whitespace-nowrap">
//                       {row.PAYMENT_DATE || "-"}
//                     </td>
//                     <td className="px-3 py-4 text-[11px] break-words">
//                       {row.Remark || "-"}
//                     </td>
                    
//                     <td className="px-3 py-4 text-center">
//                       <button
//                         onClick={() => openUpdateModal(row)}
//                         className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
//                       >
//                         <FileText className="w-3.5 h-3.5" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>

//       {/* Update Modal */}
//       {selectedRow && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-[999]">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
//             <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
//               <h2 className="text-sm font-bold">Update Actual Bank Transfer</h2>
//               <button onClick={closeModal}>
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-4 overflow-y-auto space-y-4">
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
//                 <div className="p-2 bg-gray-50 rounded border">
//                   <p className="text-[8px] text-gray-400 uppercase font-bold">UID</p>
//                   <p className="text-[10px] font-bold truncate">{selectedRow.uid}</p>
//                 </div>
//                 <div className="p-2 bg-blue-50 rounded border border-blue-200">
//                   <p className="text-[8px] text-blue-600 uppercase font-bold">Amount</p>
//                   <p className="text-sm font-black text-blue-700">₹{selectedRow.Amount}</p>
//                 </div>
//                 <div className="p-2 bg-purple-50 rounded border border-purple-200">
//                   <p className="text-[8px] text-purple-600 uppercase font-bold">From → To</p>
//                   <p className="text-[9px] font-bold truncate">
//                     {selectedRow.Transfer_A_C_Name} → {selectedRow.Transfer_Received_A_C_Name}
//                   </p>
//                 </div>
//               </div>
// <div>
//                     <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
//                     <select
//                       value={status}
//                        onChange={(e) => setStatus(e.target.value)}
//                       className="w-full p-2 border rounded-lg font-bold text-xs"
//                     >
//                       <option value=" ">----- Select----</option>
//                       <option value="Done">Done</option>
//                       <option value="Cancel">Cancel</option>
//                     </select>
//                   </div>
//               {/* <div>
//                 <label className="text-[10px] font-bold text-gray-500 uppercase">
//                   Status <span className="text-red-600">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={status}
//                   onChange={(e) => setStatus(e.target.value)}
//                   placeholder="e.g., Completed, Pending, Failed"
//                   className="w-full p-3 mt-1 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div> */}

//               <div>
//                 <label className="text-[10px] font-bold text-gray-500 uppercase">Remark (optional)</label>
//                 <textarea
//                   value={remark}
//                   onChange={(e) => setRemark(e.target.value)}
//                   rows="3"
//                   placeholder="Add any note..."
//                   className="w-full p-3 mt-1 border rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="pt-4 border-t flex justify-end gap-3">
//                 <button
//                   onClick={closeModal}
//                   className="px-4 py-2 font-bold text-gray-400 text-xs uppercase"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleUpdate}
//                   disabled={isUpdating}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase hover:bg-blue-700 disabled:opacity-60"
//                 >
//                   {isUpdating ? "Updating..." : "Update"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Transfer_bank_To_bank;





import React, { useState } from "react";
import {
  useGetPendingTransfersQuery,
  useUpdateActualBankTransferMutation,
} from '../../features/Payment/bank_to_bank_transfer_slice';
import { X, FileText, Loader2 } from "lucide-react";

const Transfer_bank_To_bank = () => {
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
      alert("Status is required!");
      return;
    }

    try {
      await updateActualBankTransfer({
        UID: selectedRow.uid,
        status: status.trim(),
        remark: remark.trim(),
      }).unwrap();

      alert("Actual Bank Transfer updated successfully!");
      closeModal();
      refetch();
    } catch (err) {
      alert("Update failed: " + (err?.data?.message || "Server error"));
    }
  };

  const totalAmount = pendingTransfers.reduce((sum, item) => {
    return sum + Number(item.Amount?.replace(/[₹,]/g, "") || 0);
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-5">
          <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
          <p className="text-xl font-medium text-indigo-300">Loading pending transfers...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error loading data</h2>
          <p className="text-gray-300 mb-6">Unable to fetch pending bank transfers.</p>
          <button 
            onClick={refetch}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pendingTransfers.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Transfers</h2>
          <p className="text-gray-400 mb-8">All bank-to-bank transfers have been updated with actual status.</p>
          <button 
            onClick={refetch}
            className="px-8 py-3 bg-gray-800/70 text-gray-200 rounded-xl font-medium hover:bg-gray-700 transition border border-indigo-600/50"
          >
            Refresh
          </button>
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
              animation: `float ${12 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-indigo-700/40 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Bank to Bank Transfer
              </h1>
              <p className="text-indigo-300/80 mt-2">
                Pending Actual Updates • {pendingTransfers.length} records
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-900/60 to-teal-900/60 p-5 rounded-xl border border-emerald-700/40 shadow-lg min-w-[240px]">
              <p className="text-xs uppercase tracking-wider text-emerald-200 font-semibold opacity-90 mb-1">
                Total Pending Amount
              </p>
              <p className="text-3xl font-black text-white">
                ₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-indigo-700/40 bg-black/30 backdrop-blur-md shadow-2xl">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
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
                    className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/50 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/50 bg-gray-900/10">
              {pendingTransfers.map((row) => (
                <tr
                  key={row.uid}
                  className="hover:bg-indigo-950/30 transition-colors duration-150"
                >
                  <td className="px-5 py-4 text-center">
                    <span className="inline-block px-3 py-1 text-xs bg-purple-900/40 text-purple-300 rounded border border-purple-700/40">
                      {row.planned2 || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-3 py-1 text-xs bg-indigo-900/50 rounded font-medium text-indigo-300 border border-indigo-700/40">
                      {row.uid}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-200 max-w-xs truncate" title={row.Transfer_A_C_Name}>
                    {row.Transfer_A_C_Name || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-200 max-w-xs truncate" title={row.Transfer_Received_A_C_Name}>
                    {row.Transfer_Received_A_C_Name || "-"}
                  </td>
                  <td className="px-5 py-4 text-emerald-400 font-medium">
                    ₹{row.Amount || "0"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-3 py-1 text-xs bg-purple-900/50 text-purple-300 rounded border border-purple-700/40">
                      {row.PaymentMode || "-"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-200 max-w-md truncate">
                    {row.PAYMENT_DETAILS || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    {row.PAYMENT_DATE || "-"}
                  </td>
                  <td className="px-5 py-4 text-gray-200 max-w-xs truncate">
                    {row.Remark || "-"}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => openUpdateModal(row)}
                      className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
                      title="Update Status"
                    >
                      <FileText className="w-5 h-5" />
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-lg border border-indigo-700/40 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 flex justify-between items-center border-b border-indigo-700/50">
              <h3 className="text-xl font-bold text-white">Update Actual Bank Transfer</h3>
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
                  <p className="text-lg font-medium text-indigo-300">{selectedRow.uid}</p>
                </div>
                <div className="bg-gray-800/60 p-4 rounded-xl border border-gray-700/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Amount</p>
                  <p className="text-lg font-bold text-emerald-400">₹{selectedRow.Amount}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">──── Select Status ────</option>
                  <option value="Done">Done</option>
                  <option value="Cancel">Cancel</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Remark (optional)</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Add any note or reason..."
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
                  onClick={handleUpdate}
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