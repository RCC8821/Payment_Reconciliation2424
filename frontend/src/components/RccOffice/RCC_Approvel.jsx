import React, { useState } from 'react';
import {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} from '../../features/RCC_Office_Expenses/approval1ApiSlice'; // Path adjust kar lena
import { ExternalLink, Image, Loader2, CheckCircle, XCircle, Edit3 } from 'lucide-react';

function RCC_Approvel() {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPendingOfficeExpensesQuery();

  const [updateApproval, { isLoading: isUpdating }] = useUpdateOfficeExpenseApprovalMutation();

  const expenses = response?.data || [];
  const totalRecords = response?.totalRecords || 0;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [formData, setFormData] = useState({
    STATUS_2: '',
    REVISED_AMOUNT_3: '',
    REMARK_2: '',
  });

  // Current logged in user (agar Redux mein user name hai to yahan se lo, warna APPROVAL_DOER use karo)
  // Example: const { userName } = useSelector(state => state.auth);
  // Abhi ke liye hum table ke APPROVAL_DOER ko hi use kar rahe hain
  // const currentUserName = userName || 'Admin';

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setFormData({
      STATUS_2: '',
      REVISED_AMOUNT_3: expense.PLANNED_2 || '',
      REMARK_2: '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_2) {
      alert('Please select a status');
      return;
    }

    const payload = {
      uid: selectedExpense.uid,
      STATUS_2: formData.STATUS_2,
      REVISED_AMOUNT_3: formData.REVISED_AMOUNT_3,
      APPROVAL_DOER_2: selectedExpense.APPROVAL_DOER || 'Unknown', // Auto-filled
      REMARK_2: formData.REMARK_2,
    };

    try {
      await updateApproval(payload).unwrap();
      alert('Approval updated successfully!');
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Failed to update approval: ' + (err?.data?.message || err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <span className="ml-3 text-lg text-gray-600">Loading pending approvals...</span>
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
        No pending approvals at Level 1
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">RCC Office Expenses - Level 1 Approval</h2>
        <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full font-semibold">
          {totalRecords} Pending Record{totalRecords !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
        <table className="w-full table-auto bg-white">
          <thead className=" bg-blue-400 text-white font-bold text-2xl">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Planned </th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">UID</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Office Name</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Payee</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES HEAD</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES SUBHEAD</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">EXPENSES Details</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Amount</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">DEPARTMENT</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">APPROVAL DOER</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">RAISED BY</th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">REMARK </th>
              <th className="px-4 py-4 text-left text-sm font-semibold uppercase tracking-wider">Bill</th>
              <th className="px-4 py-4 text-center text-sm font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.map((item) => (
              <tr key={item.uid} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 text-sm font-bold text-emerald-800">{item.PLANNED_2 || '0'}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{item.uid}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.OFFICE_NAME_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.PAYEE_NAME_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.EXPENSES_HEAD_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.EXPENSES_SUBHEAD_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.EXPENSES_DETAILS_1 || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{item.Amount || '-'}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.DEPARTMENT_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.APPROVAL_DOER}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.RAISED_BY_1}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{item.REMARK_1}</td>
                <td className="px-4 py-4 text-sm">
                  {item.Bill_Photo ? (
                    <a href={item.Bill_Photo} target="_blank" rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
                      <Image className="w-4 h-4" /> View
                    </a>
                  ) : <span className="text-gray-400 text-xs">-</span>}
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => openModal(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 mx-auto transition"
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

      {/* Approval Modal */}
      {isModalOpen && selectedExpense && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Level 1 Approval</h3>

            <div className="space-y-4 mb-6">
              

             

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Status <span className="text-red-500">*</span></label>
                <select
                  value={formData.STATUS_2}
                  onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Status</option>
                  <option value="Approved">Done</option>
                 
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Revised Amount (if changed)</label>
                <input
                  type="number"
                  value={formData.REVISED_AMOUNT_3}
                  onChange={(e) => setFormData({ ...formData, REVISED_AMOUNT_3: e.target.value })}
                  placeholder="Enter revised amount"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Remark</label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
                  rows="3"
                  placeholder="Add any remark..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <p className="text-sm text-gray-600">
                  <strong>Approver:</strong> {selectedExpense.APPROVAL_DOER || 'Current User'} (Auto-filled)
                </p>
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