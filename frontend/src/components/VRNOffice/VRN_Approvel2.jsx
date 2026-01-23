import React, { useState } from 'react';
import {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseFinalApprovalMutation,
} from '../../features/VRN_OFFICE_Expenses/Vrn_Aapproval2ApiSlice';
import { Image as LucideImage, Loader2, CheckCircle, Edit3, X } from 'lucide-react';

function VRN_Approvel2() {
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
  uid: selectedExpense.Office_Bill_No,          //  ←←←  Most important change
  STATUS_3: formData.STATUS_3,
  FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3 ? Number(formData.FINAL_AMOUNT_3) : null,
  REMARK_3: formData.REMARK_3.trim() || null,
};

    try {
      await updateFinalApproval(payload).unwrap();
      alert('Final approval submitted successfully!');
      closeModal();
      // Optional: window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to submit: ' + (err?.data?.message || err.message));
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
          <h2 className="text-2xl font-bold text-red-400 mb-4">Data loading failed</h2>
          <p className="text-gray-300 mb-6">{error?.data?.message || 'Cannot load pending records'}</p>
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
          <h2 className="text-3xl font-bold text-indigo-300 mb-4">No Pending Approvals</h2>
          <p className="text-gray-400 text-lg">
            No expenses pending for Final Approval (Level 2)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-6 px-4 md:px-6">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply blur-3xl opacity-25 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-black/50 backdrop-blur-xl rounded-xl border border-indigo-700/50 p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                VRN Office Expenses – Level 2 Approval
              </h1>
              <p className="text-indigo-300/90 mt-1">
                Pending records for final review
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/70 to-indigo-900/70 px-6 py-4 rounded-xl border border-purple-600/40 shadow-lg min-w-[140px] text-center">
              <p className="text-sm uppercase tracking-wider text-purple-200 font-semibold mb-1">Pending</p>
              <p className="text-3xl font-black text-white">{totalRecords}</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-indigo-700/50 bg-black/40 backdrop-blur-md shadow-2xl">
          <table className="w-full min-w-max border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 text-white">
                 <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Timestamp</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill No</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Office</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Payee</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Head</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Subhead</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Department</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Approver</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Raised By</th>
                <th className="px-5 py-4 text-left text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Amount</th>
                <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Bill</th>
                <th className="px-5 py-4 text-center text-sm font-semibold uppercase tracking-wider border-b border-indigo-700/60">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-800/60 bg-gray-950/10">
                          {expenses.map((item) => (
                            <tr
                              key={item.Office_Bill_No || item.uid} // Bill No ko key bana diya
                              className="hover:bg-indigo-950/40 transition-colors duration-150"
                            >
                              <td className="px-5 py-4 text-gray-300">{item.Timestamp || '-'}</td>
                              <td className="px-5 py-4 text-indigo-300 font-medium font-bold">
                                {item.Office_Bill_No || '-'}
                              </td>
                              <td className="px-5 py-4 text-gray-200">{item.OFFICE_NAME_1 || '-'}</td>
                              <td className="px-5 py-4 text-gray-200">{item.PAYEE_NAME_1 || '-'}</td>
                              <td className="px-5 py-4 text-gray-200">{item.EXPENSES_HEAD_1 || '-'}</td>
                              <td className="px-5 py-4 text-gray-200">{item.EXPENSES_SUBHEAD_1 || '-'}</td>
                              <td className="px-5 py-4 text-gray-300">{item.DEPARTMENT_1 || '-'}</td>
                              <td className="px-5 py-4 text-gray-300">{item.APPROVAL_DOER || item.APPROVAL_DOER_2 || '-'}</td>
                              <td className="px-5 py-4 text-gray-300">{item.RAISED_BY_1 || '-'}</td>
                              <td className="px-5 py-4 text-emerald-400 font-medium">
                                ₹{(item.Total_Amount || item.Amount || '—').toLocaleString('en-IN')}
                              </td>
                              <td className="px-5 py-4 text-center">
                                {item.Bill_Photo_1 || item.Bill_Photo ? (
                                  <a
                                    href={item.Bill_Photo_1 || item.Bill_Photo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center p-2.5 bg-cyan-900/50 text-cyan-300 rounded-lg hover:bg-cyan-800/70 transition"
                                    title="View bill photo"
                                  >
                                    <LucideImage className="w-5 h-5" />
                                  </a>
                                ) : (
                                  <span className="text-gray-600">—</span>
                                )}
                              </td>
                              <td className="px-5 py-4 text-center">
                                <button
                                  onClick={() => openModal(item)}
                                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto min-w-[140px]"
                                  title={`Review ${item.Office_Bill_No}`}
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
      </div>

      {/* Modal - same dark modern style */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl w-full max-w-lg border border-indigo-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-950 to-purple-950 p-5 flex justify-between items-center border-b border-indigo-700/60">
              <h3 className="text-xl font-bold text-white">
                Final Approval – UID: {selectedExpense.uid}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Planned Amount</p>
                  <p className="text-lg font-bold text-emerald-400">
                    ₹{(selectedExpense.PLANNED_3 || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="bg-gray-900/60 p-4 rounded-xl border border-gray-800/50">
                  <p className="text-xs text-gray-400 uppercase mb-1">Revised Amount</p>
                  <p className="text-lg font-bold text-indigo-400">
                    ₹{(selectedExpense.Amount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div> */}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">
                  Final Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_3}
                  onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    formData.STATUS_3
                      ? 'bg-gray-800 border border-gray-700 focus:ring-emerald-500 border-emerald-500/50'
                      : 'bg-gray-800/70 border border-red-500/50 focus:ring-red-500'
                  }`}
                >
                  <option value="">----- Select ----- *</option>
                  <option value="Done">✅ Done</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Final Amount (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.FINAL_AMOUNT_3}
                  onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter if different from planned/revised"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-200">Final Remark (optional)</label>
                <textarea
                  value={formData.REMARK_3}
                  onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  placeholder="Any final comments or justification..."
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg font-medium transition"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUpdating || !formData.STATUS_3}
                  className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 min-w-[200px] justify-center transition-all ${
                    isUpdating || !formData.STATUS_3
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed border border-gray-600'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl border border-emerald-500/50'
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

export default VRN_Approvel2;