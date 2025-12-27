import React, { useState } from "react";
import {
  useGetPendingActualBankInQuery,
  useUpdateActualBankInMutation,
} from '../../features/Payment/Actual_Bank_In_Slice';
import { X, FileText, Eye, Loader2 } from "lucide-react";

const Actual_Payment_in = () => {
  const {
    data: pendingPayments = [],
    isLoading,
    isError,
    refetch,
  } = useGetPendingActualBankInQuery();

  const [updateActualBankIn, { isLoading: isUpdating }] = useUpdateActualBankInMutation();

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
      await updateActualBankIn({
        UID: selectedRow.uid,
        status: status.trim(),
        remark: remark.trim(),
      }).unwrap();

      alert("Actual Bank In updated successfully!");
      closeModal();
      refetch();
    } catch (err) {
      alert("Update failed: " + (err?.data?.message || "Server error"));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500">Please wait while we fetch the data</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading data</h2>
          <p className="text-gray-600 mb-4">Unable to fetch pending payments. Please try again.</p>
          <button 
            onClick={refetch} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (pendingPayments.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Pending Entries</h2>
          <p className="text-gray-500">All planned payments have actual status filled.</p>
          <button 
            onClick={refetch} 
            className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  const totalNetAmount = pendingPayments.reduce((sum, item) => {
    return sum + Number(item.NetAmount?.replace(/[₹,]/g, "") || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      {/* Header - Compact */}
      <div className="max-w-5xl mx-auto">

      
      <div className="p-4 bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Actual Bank In - Pending Updates
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {pendingPayments.length} pending entries
            </p>
          </div>
          
          {/* Stats Card - Compact */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg text-white shadow">
            <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">Total Pending</p>
            <p className="text-lg md:text-xl font-black mt-1">
              ₹{totalNetAmount.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-hidden p-3">
        <div className="bg-white rounded-lg shadow border border-gray-200 h-full overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full min-w-[1400px] text-sm border-collapse">
              <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">UID</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Site Name</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Amount</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">CGST</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">SGST</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Net Amount</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">RCC A/c</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Mode</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Cheque No</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Cheque Date</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Photo</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Planned Date</th>
                  <th className="px-3 py-3 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pendingPayments.map((row, index) => (
                  <tr key={row.uid} className="hover:bg-blue-50 transition-colors">
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs bg-blue-100 rounded font-bold text-blue-700">{row.uid}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="max-w-[180px] mx-auto truncate font-medium text-xs" title={row.SiteName}>
                        {row.SiteName}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-medium text-xs">{row.Amount}</td>
                    <td className="px-3 py-2 text-center text-xs">{row.CGST}</td>
                    <td className="px-3 py-2 text-center text-xs">{row.SGST}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs bg-green-100 rounded font-bold text-green-700">{row.NetAmount}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="max-w-[180px] mx-auto truncate text-xs" title={row.RccCreditAccountName}>
                        {row.RccCreditAccountName}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">{row.PaymentMode}</span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-xs font-mono">{row.ChequeNo || "-"}</span>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap text-xs">{row.ChequeDate || "-"}</td>
                    <td className="px-3 py-2 text-center">
                      {row.ChequePhoto ? (
                        <a 
                          href={row.ChequePhoto} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center justify-center p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                          title="View Photo"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <span className="inline-block px-2 py-0.5 text-xs font-semibold text-purple-700 bg-purple-100 rounded">
                        {row.planned2}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => openUpdateModal(row)}
                        className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                        title="Update Status"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedRow && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[999]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 flex justify-between items-center text-white rounded-t-xl sticky top-0">
              <h2 className="text-base font-bold">Update Actual Bank In</h2>
              <button onClick={closeModal} className="hover:bg-white/20 p-1 rounded transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
                  <p className="text-gray-500 text-xs uppercase font-bold mb-1">UID</p>
                  <p className="font-bold text-gray-800 text-sm">{selectedRow.uid}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                  <p className="text-blue-600 text-xs uppercase font-bold mb-1">Net Amount</p>
                  <p className="font-bold text-blue-800 text-sm">{selectedRow.NetAmount}</p>
                </div>
                <div className="col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
                  <p className="text-purple-600 text-xs uppercase font-bold mb-1">Site Name</p>
                  <p className="font-bold text-purple-800 text-sm">{selectedRow.SiteName}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">
                  Status <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="e.g., Received, Pending, Cleared"
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Remark (optional)</label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  rows="2"
                  placeholder="Add any note..."
                  className="w-full px-3 py-2.5 text-sm border-2 border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button 
                  onClick={closeModal} 
                  className="px-4 py-2 text-gray-600 font-medium text-sm hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg text-sm hover:from-green-700 hover:to-green-800 disabled:opacity-60 shadow-md"
                >
                  {isUpdating ? "Updating..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Actual_Payment_in;