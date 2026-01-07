import React, { useState } from 'react';
import {
  useGetPendingOfficeExpensesLevel2Query,
  useUpdateOfficeExpenseFinalApprovalMutation,
} from '../../features/VRN_OFFICE_Expenses/Vrn_Aapproval2ApiSlice';
import { Image, Loader2, CheckCircle, Edit3 } from 'lucide-react';


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
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_3) {
      alert('Please select "Done" to finalize');
      return;
    }

    const payload = {
      uid: selectedExpense.uid,
      STATUS_3: formData.STATUS_3,
      FINAL_AMOUNT_3: formData.FINAL_AMOUNT_3,
      REMARK_3: formData.REMARK_3,
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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
        <span className="ml-3 text-lg text-gray-600">Loading Level 2 approvals...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600 text-lg">
        Error: {error?.data?.message || 'Failed to load data'}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 text-xl">
        No expenses pending for Final Approval (Level 2)
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-gray-800">
         VRN Office Expenses  Level 2 Approval
        </h2>
        <div className="bg-purple-100 text-purple-800 px-5 py-3 rounded-full font-semibold">
          {totalRecords} Pending Record{totalRecords !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full table-auto bg-white">
          <thead className=" bg-blue-400 text-white font-bold text-2xl">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Planned</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">UID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Office Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Payee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Expenses Head</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Subhead</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Details</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Approval Doer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Raised By</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Revised Amount</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Remark</th>
              <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Bill</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((item) => (
              <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-purple-800">₹{item.PLANNED_3 || '0'}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.uid}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.OFFICE_NAME_1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.PAYEE_NAME_1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.EXPENSES_HEAD_1}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.EXPENSES_SUBHEAD_1}</td>
                <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{item.EXPENSES_DETAILS_1 || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.Amount || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.DEPARTMENT_1 || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.APPROVAL_DOER_2 || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{item.RAISED_BY_1 || '-'}</td>
                <td className="px-6 py-4 text-sm font-semibold text-indigo-700">₹{item.REVISED_AMOUNT_2 || 'N/A'}</td>
                <td className="px-6 py-4 text-sm text-gray-600 italic max-w-xs truncate">{item.REMARK_2 || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  {item.Bill_Photo ? (
                    <a
                      href={item.Bill_Photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
                    >
                      <Image className="w-4 h-4" />
                      View
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => openModal(item)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition text-sm"
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

      {/* Final Approval Modal */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Final Approval (Level 2) - Mayak Sir</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.STATUS_3}
                  onChange={(e) => setFormData({ ...formData, STATUS_3: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Status</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Amount (if different)
                </label>
                <input
                  type="number"
                  value={formData.FINAL_AMOUNT_3}
                  onChange={(e) => setFormData({ ...formData, FINAL_AMOUNT_3: e.target.value })}
                  placeholder="Leave blank if same as revised"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Final Remark</label>
                <textarea
                  value={formData.REMARK_3}
                  onChange={(e) => setFormData({ ...formData, REMARK_3: e.target.value })}
                  rows="3"
                  placeholder="Any final comments..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition disabled:opacity-70"
              >
                {isUpdating ? (
                  <>Submitting...</>
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
      )}
    </div>
  );
}

export default VRN_Approvel2;