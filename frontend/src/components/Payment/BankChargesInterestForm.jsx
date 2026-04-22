import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Landmark,
  CalendarDays,
  IndianRupee,
  FileText,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Banknote,
} from 'lucide-react';


const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const BankChargesInterestForm = () => {
  // Theme detection
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    const checkTheme = () => {
      const saved = localStorage.getItem('isDarkMode');
      setIsDarkMode(saved ? JSON.parse(saved) : true);
    };
    const interval = setInterval(checkTheme, 500);
    return () => clearInterval(interval);
  }, []);

  // Bank Names from API
  const [bankNames, setBankNames] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    bankPayment: '',
    chargesInterestDetails: '',
    bankName: '',
    amount: '',
    paymentMode: '',
    paymentDate: '',
    remark: '',
  });

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Static Dropdown Options
  const bankPaymentOptions = ['Interest', 'Charges'];
  const paymentModeOptions = ['Bank'];

  // Fetch Bank Names from API
  useEffect(() => {
    fetchBankNames();
  }, []);

  const fetchBankNames = async () => {
    setLoadingBanks(true);
    try {
      const res = await axios.get(`${API_URL}/api/Bank-Interest-Dropdown-Data`);
      if (res.data.success) {
        setBankNames(res.data.accounts || []);
      }
    } catch (error) {
      console.error('Error fetching bank names:', error);
      showToast('error', 'Failed to load bank names');
    } finally {
      setLoadingBanks(false);
    }
  };

  // Toast Handler
  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.bankPayment ||
      !formData.chargesInterestDetails ||
      !formData.bankName ||
      !formData.amount ||
      !formData.paymentMode ||
      !formData.paymentDate
    ) {
      showToast('error', 'Please fill all required fields');
      return;
    }

    if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      showToast('error', 'Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/Bank-Interest-Add`, formData);
      if (res.data.success) {
        showToast(
          'success',
          `Data added! UID: ${res.data.data.uid} | Payment: ${res.data.data.paymentDetails}`
        );
        // Reset form
        setFormData({
          bankPayment: '',
          chargesInterestDetails: '',
          bankName: '',
          amount: '',
          paymentMode: '',
          paymentDate: '',
          remark: '',
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit data';
      showToast('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Theme Styles
  const cardBg = isDarkMode
    ? 'bg-white/5 border-white/10'
    : 'bg-white/80 border-gray-200 shadow-lg';

  const inputBg = isDarkMode
    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-indigo-400 focus:ring-indigo-400/30'
    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:ring-indigo-500/30';

  const labelColor = isDarkMode ? 'text-gray-300' : 'text-gray-700';
  const headingColor = isDarkMode
    ? 'bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent'
    : 'bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent';

  const selectBg = isDarkMode
    ? 'bg-white/10 border-white/20 text-white focus:border-indigo-400 focus:ring-indigo-400/30'
    : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500/30';

  const selectOptionBg = isDarkMode ? '#1e1b4b' : '#ffffff';

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl border backdrop-blur-xl max-w-sm ${
              toast.type === 'success'
                ? isDarkMode
                  ? 'bg-emerald-900/80 border-emerald-500/30 text-emerald-100'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : isDarkMode
                ? 'bg-red-900/80 border-red-500/30 text-red-100'
                : 'bg-red-50 border-red-300 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm font-medium flex-1">{toast.message}</span>
            <button onClick={() => setToast(null)}>
              <X className="w-4 h-4 opacity-60 hover:opacity-100" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div
            className={`p-3 rounded-xl ${
              isDarkMode
                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20'
                : 'bg-gradient-to-br from-indigo-100 to-purple-100'
            }`}
          >
            <Landmark
              className={`w-7 h-7 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}
            />
          </div>
        </div>
        <h2 className={`text-2xl sm:text-3xl font-bold ${headingColor}`}>
          Bank Charges & Interest
        </h2>
        <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Enter bank interest and charges details below
        </p>
      </div>

      {/* Form Card */}
      <div className={`rounded-2xl border p-5 sm:p-8 ${cardBg}`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Bank Payment & Charges/Interest Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bank Payment - Dropdown */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Bank Payment <span className="text-red-400">*</span>
                </div>
              </label>
              <select
                name="bankPayment"
                value={formData.bankPayment}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${selectBg}`}
                required
              >
                <option value="" style={{ backgroundColor: selectOptionBg }}>
                  -- Select --
                </option>
                {bankPaymentOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    style={{ backgroundColor: selectOptionBg }}
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Charges & Interest Details - Text Input */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Charges & Interest Details <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="text"
                name="chargesInterestDetails"
                value={formData.chargesInterestDetails}
                onChange={handleChange}
                placeholder="e.g. Monthly Interest, Service Charge"
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Row 2: Bank Name & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Bank Name - Dropdown from API */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  Bank Name <span className="text-red-400">*</span>
                </div>
              </label>
              <select
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${selectBg}`}
                required
                disabled={loadingBanks}
              >
                <option value="" style={{ backgroundColor: selectOptionBg }}>
                  {loadingBanks ? 'Loading banks...' : '-- Select Bank --'}
                </option>
                {bankNames.map((bank, index) => (
                  <option
                    key={index}
                    value={bank}
                    style={{ backgroundColor: selectOptionBg }}
                  >
                    {bank}
                  </option>
                ))}
              </select>
              {loadingBanks && (
                <div className="flex items-center gap-2 mt-1">
                  <Loader2
                    className={`w-3 h-3 animate-spin ${
                      isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
                    }`}
                  />
                  <span
                    className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                  >
                    Fetching bank names...
                  </span>
                </div>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  Amount <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Row 3: Payment Mode & Payment Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Payment Mode - Dropdown */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <Banknote className="w-4 h-4" />
                  Payment Mode <span className="text-red-400">*</span>
                </div>
              </label>
              <select
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${selectBg}`}
                required
              >
                <option value="" style={{ backgroundColor: selectOptionBg }}>
                  -- Select --
                </option>
                {paymentModeOptions.map((opt) => (
                  <option
                    key={opt}
                    value={opt}
                    style={{ backgroundColor: selectOptionBg }}
                  >
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Date */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  Payment Date <span className="text-red-400">*</span>
                </div>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${inputBg}`}
                required
              />
            </div>
          </div>

          {/* Row 4: Remark */}
          <div>
            <label className={`block text-sm font-semibold mb-2 ${labelColor}`}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Remark <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>(Optional)</span>
              </div>
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows={3}
              className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${inputBg}`}
            />
          </div>

          {/* Info Box */}
          <div
            className={`rounded-xl p-4 border ${
              isDarkMode
                ? 'bg-indigo-900/20 border-indigo-500/20'
                : 'bg-indigo-50 border-indigo-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  isDarkMode ? 'text-indigo-400' : 'text-indigo-500'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? 'text-indigo-300' : 'text-indigo-700'
                  }`}
                >
                  Auto-Generated Fields
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isDarkMode ? 'text-indigo-400/70' : 'text-indigo-500/80'
                  }`}
                >
                  <strong>UID</strong> (e.g., 0001) and{' '}
                  <strong>Payment Details</strong> (e.g., IC0001) will be
                  auto-generated. <strong>Timestamp</strong> is recorded
                  automatically in India time.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-base transition-all ${
                isSubmitting
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Entry
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BankChargesInterestForm;