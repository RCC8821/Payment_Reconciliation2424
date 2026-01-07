import React, { useState } from "react";
import {
  useGetPendingTransfersQuery,
  useUpdateActualBankTransferMutation,
} from '../../features/Payment/bank_to_bank_transfer_slice'; // Path apne project ke hisab se adjust kar lena
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
      <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          <p className="text-xl font-bold text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error loading data</h2>
          <button 
            onClick={refetch} 
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pendingTransfers.length === 0) {
    return (
      <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">No Pending Transfers</h2>
          <p className="text-gray-500 mb-8">All bank-to-bank transfers have been updated.</p>
          <button 
            onClick={refetch} 
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full min-h-screen bg-gray-50 p-2 md:p-4 overflow-x-hidden box-border">
      <div className="max-w-full mx-auto space-y-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Bank to Bank Transfer - Pending Actual Updates
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 rounded-xl text-white shadow-md">
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
              Total Pending Amount
            </p>
            <p className="text-2xl font-black mt-2">
              ₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl border-l-4 border-yellow-400 shadow-sm">
            <p className="text-gray-400 text-[10px] font-bold uppercase">
              Pending Transfers
            </p>
            <p className="text-2xl font-black text-gray-800 mt-2">
              {pendingTransfers.length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-800 text-white">
                <tr>
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
                      className="px-3 py-3 text-[10px] font-bold uppercase whitespace-normal"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {pendingTransfers.map((row) => (
                  
                  <tr key={row.uid} className="hover:bg-gray-50">
                    <td className="px-3 py-4 text-center">
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                        {row.planned2 || "-"}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[11px] font-bold">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 rounded font-bold text-blue-700">
                        {row.uid}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">
                      {row.Transfer_A_C_Name}
                    </td>
                    <td className="px-3 py-4 text-[11px] break-words whitespace-normal align-top">
                      {row.Transfer_Received_A_C_Name}
                    </td>
                    <td className="px-3 py-4 text-[11px] font-medium text-blue-600">
                      ₹{row.Amount}
                    </td>
                    <td className="px-3 py-4 text-[11px]">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                        {row.PaymentMode}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-[11px] break-words max-w-xs">
                      {row.PAYMENT_DETAILS || "-"}
                    </td>
                    <td className="px-3 py-4 text-[11px] whitespace-nowrap">
                      {row.PAYMENT_DATE || "-"}
                    </td>
                    <td className="px-3 py-4 text-[11px] break-words">
                      {row.Remark || "-"}
                    </td>
                    
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => openUpdateModal(row)}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 z-[999]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
            <div className="bg-gray-800 p-4 flex justify-between items-center text-white">
              <h2 className="text-sm font-bold">Update Actual Bank Transfer</h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded border">
                  <p className="text-[8px] text-gray-400 uppercase font-bold">UID</p>
                  <p className="text-[10px] font-bold truncate">{selectedRow.uid}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-[8px] text-blue-600 uppercase font-bold">Amount</p>
                  <p className="text-sm font-black text-blue-700">₹{selectedRow.Amount}</p>
                </div>
                <div className="p-2 bg-purple-50 rounded border border-purple-200">
                  <p className="text-[8px] text-purple-600 uppercase font-bold">From → To</p>
                  <p className="text-[9px] font-bold truncate">
                    {selectedRow.Transfer_A_C_Name} → {selectedRow.Transfer_Received_A_C_Name}
                  </p>
                </div>
              </div>
<div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Status</label>
                    <select
                      value={status}
                       onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-2 border rounded-lg font-bold text-xs"
                    >
                      <option value=" ">----- Select----</option>
                      <option value="Done">Done</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </div>
              {/* <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Status <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g., Completed, Pending, Failed"
                  className="w-full p-3 mt-1 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div> */}

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Remark (optional)</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows="3"
                  placeholder="Add any note..."
                  className="w-full p-3 mt-1 border rounded-xl text-sm resize-none outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 font-bold text-gray-400 text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase hover:bg-blue-700 disabled:opacity-60"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer_bank_To_bank;
