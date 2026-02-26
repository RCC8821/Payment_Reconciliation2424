
import React, { useState, useEffect } from 'react';
import {
  useAddPaymentMutation,
  useSubmitCapitalMovementMutation,
  useSubmitBankTransferMutation,
  useGetDropdownDataQuery
} from '../../features/Payment/FormSlice';
import Swal from 'sweetalert2';

const Form = () => {
  const [activeTab, setActiveTab] = useState('client-in');

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

  // Mutations
  const [addPayment, { 
    isLoading: isSubmittingClient,
    isSuccess: clientSuccess,
    isError: clientError,
    error: clientErr,
    data: clientData 
  }] = useAddPaymentMutation();

  const [submitCapitalMovement, { 
    isLoading: isSubmittingCapital,
    isSuccess: capitalSuccess,
    isError: capitalError,
    error: capitalErr,
    data: capitalData 
  }] = useSubmitCapitalMovementMutation();

  const [submitBankTransfer, { 
    isLoading: isSubmittingTransfer,
    isSuccess: transferSuccess,
    isError: transferError,
    error: transferErr,
    data: transferData 
  }] = useSubmitBankTransferMutation();

  // Dropdown Data
  const { 
    data: dropdownData,
    isLoading: isDropdownLoading,
    isError: isDropdownError 
  } = useGetDropdownDataQuery();

  const projects = dropdownData?.projects || [];
  const accounts = dropdownData?.accounts || [];
  const capitalMovements = dropdownData?.capitalMovements || [];

  // ───────────────────────────────────────────────
  // Client In Form State
  // ───────────────────────────────────────────────
  const [clientFormData, setClientFormData] = useState({
    SiteName: '',
    Amount: '',
    GST: '',
    CGST: '',
    SGST: '',
    NetAmount: '',
    RccCreditAccountName: '',
    PaymentMode: '',
    TransactionNo: '',
    TransactionDate: '',
    ChequePhoto: null,
  });

  // ───────────────────────────────────────────────
  // Capital Movement Form State
  // ───────────────────────────────────────────────
  const [capitalFormData, setCapitalFormData] = useState({
    Capital_Movment: '',
    Received_Account: '',
    Amount: '',
    PAYMENT_MODE: '',
    PAYMENT_DETAILS: '',
    PAYMENT_DATE: '',
    Remark: '',
  });

  // ───────────────────────────────────────────────
  // Bank Transfer Form State
  // ───────────────────────────────────────────────
  const [transferFormData, setTransferFormData] = useState({
    Transfer_A_C_Name: '',
    Transfer_Received_A_C_Name: '',
    Amount: '',
    PAYMENT_MODE: '',
    PAYMENT_DETAILS: '',
    PAYMENT_DATE: '',
    Remark: '',
  });

  // Conditions
  const showClientTransactionFields = ['Cheque', 'NEFT', 'RTGS'].includes(clientFormData.PaymentMode);
  const showChequePhoto = clientFormData.PaymentMode === 'Cheque';
  const showCapitalTransactionDetails = ['Cheque', 'NEFT', 'RTGS'].includes(capitalFormData.PAYMENT_MODE);
  const showTransferTransactionDetails = ['Cheque', 'NEFT', 'RTGS'].includes(transferFormData.PAYMENT_MODE);

  // GST Auto Calculation - Client In
  useEffect(() => {
    if (clientFormData.Amount && clientFormData.GST === '18') {
      const amount = Number(clientFormData.Amount);
      const gstAmount = (amount * 18) / 100;
      const halfGST = gstAmount / 2;
      setClientFormData(prev => ({
        ...prev,
        CGST: halfGST.toFixed(2),
        SGST: halfGST.toFixed(2),
        NetAmount: (amount + gstAmount).toFixed(2),
      }));
    } else {
      setClientFormData(prev => ({
        ...prev,
        CGST: '',
        SGST: '',
        NetAmount: clientFormData.Amount || '',
      }));
    }
  }, [clientFormData.Amount, clientFormData.GST]);

  // Handlers
  const handleClientChange = (e) => {
    const { name, value } = e.target;
    setClientFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapitalChange = (e) => {
    const { name, value } = e.target;
    setCapitalFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setClientFormData(prev => ({ ...prev, ChequePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setClientFormData(prev => ({ ...prev, ChequePhoto: null }));
  };

  // ───────────────────────────────────────────────
  // Client Payment Submit
  // ───────────────────────────────────────────────
  const handleClientSubmit = async () => {
    if (!clientFormData.SiteName) return Swal.fire({ icon: 'warning', title: 'Site Name Required', text: 'Site Name is required' });
    if (!clientFormData.Amount || Number(clientFormData.Amount) <= 0) return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Valid Amount is required' });
    if (!clientFormData.RccCreditAccountName) return Swal.fire({ icon: 'warning', title: 'Account Required', text: 'Please select RCC Credit Account Name' });
    if (showClientTransactionFields && (!clientFormData.TransactionNo.trim() || !clientFormData.TransactionDate.trim())) {
      return Swal.fire({ icon: 'warning', title: 'Transaction Details Required', text: 'Transaction No and Date are required for selected payment mode' });
    }

    try {
      const result = await addPayment({
        SiteName: clientFormData.SiteName.trim(),
        Amount: Number(clientFormData.Amount),
        CGST: clientFormData.CGST ? Number(clientFormData.CGST) : 0,
        SGST: clientFormData.SGST ? Number(clientFormData.SGST) : 0,
        NetAmount: clientFormData.NetAmount ? Number(clientFormData.NetAmount) : 0,
        RccCreditAccountName: clientFormData.RccCreditAccountName,
        PaymentMode: clientFormData.PaymentMode,
        ChequeNo: clientFormData.TransactionNo,
        ChequeDate: clientFormData.TransactionDate,
        ChequePhoto: clientFormData.ChequePhoto,
      }).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Payment Added!',
        text: `Payment added successfully! UID: ${result.uid || 'N/A'}`,
        confirmButtonColor: '#10b981',
        timer: 2500,
        showConfirmButton: false,
      });

      setClientFormData({
        SiteName: '', Amount: '', GST: '', CGST: '', SGST: '', NetAmount: '',
        RccCreditAccountName: '', PaymentMode: '', TransactionNo: '', TransactionDate: '', ChequePhoto: null
      });
    } catch (err) {
      console.error('Client payment error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.data?.message || 'Failed to add payment. Please try again.',
      });
    }
  };

  // ───────────────────────────────────────────────
  // Capital Movement Submit
  // ───────────────────────────────────────────────
  const handleCapitalSubmit = async () => {
    if (!capitalFormData.Capital_Movment) return Swal.fire({ icon: 'warning', title: 'Required', text: 'Capital Movement is required' });
    if (!capitalFormData.Received_Account) return Swal.fire({ icon: 'warning', title: 'Required', text: 'Received Account is required' });
    if (!capitalFormData.Amount || Number(capitalFormData.Amount) <= 0) return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Valid Amount is required' });
    if (!capitalFormData.PAYMENT_MODE) return Swal.fire({ icon: 'warning', title: 'Required', text: 'Payment Mode is required' });
    if (showCapitalTransactionDetails && (!capitalFormData.PAYMENT_DETAILS?.trim() || !capitalFormData.PAYMENT_DATE?.trim())) {
      return Swal.fire({ icon: 'warning', title: 'Required', text: 'Payment Details and Date are required for selected mode' });
    }

    try {
      const result = await submitCapitalMovement(capitalFormData).unwrap();
      Swal.fire({
        icon: 'success',
        title: 'Capital Entry Saved!',
        text: `UID: ${result.data?.UID || 'Generated'}`,
        confirmButtonColor: '#10b981',
        timer: 2800,
        showConfirmButton: false,
      });

      setCapitalFormData({
        Capital_Movment: '',
        Received_Account: '',
        Amount: '',
        PAYMENT_MODE: '',
        PAYMENT_DETAILS: '',
        PAYMENT_DATE: '',
        Remark: '',
      });
    } catch (err) {
      console.error('Capital movement error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.data?.message || 'Failed to save capital movement.',
      });
    }
  };

  // ───────────────────────────────────────────────
  // Bank Transfer Submit
  // ───────────────────────────────────────────────
  const handleTransferSubmit = async () => {
    if (!transferFormData.Transfer_A_C_Name) return Swal.fire({ icon: 'warning', title: 'Required', text: 'From Account is required' });
    if (!transferFormData.Transfer_Received_A_C_Name) return Swal.fire({ icon: 'warning', title: 'Required', text: 'To Account is required' });
    if (transferFormData.Transfer_A_C_Name === transferFormData.Transfer_Received_A_C_Name) {
      return Swal.fire({ icon: 'warning', title: 'Invalid', text: 'From and To accounts cannot be the same' });
    }
    if (!transferFormData.Amount || Number(transferFormData.Amount) <= 0) return Swal.fire({ icon: 'warning', title: 'Invalid Amount', text: 'Valid Amount is required' });
    if (!transferFormData.PAYMENT_MODE) return Swal.fire({ icon: 'warning', title: 'Required', text: 'Payment Mode is required' });
    if (showTransferTransactionDetails && (!transferFormData.PAYMENT_DETAILS?.trim() || !transferFormData.PAYMENT_DATE?.trim())) {
      return Swal.fire({ icon: 'warning', title: 'Required', text: 'Payment Details / UTR and Date are required for selected mode' });
    }

    try {
      const payload = {
        Transfer_A_C_Name: transferFormData.Transfer_A_C_Name,
        Transfer_Received_A_C_Name: transferFormData.Transfer_Received_A_C_Name,
        Amount: Number(transferFormData.Amount),
        PAYMENT_MODE: transferFormData.PAYMENT_MODE,
        PAYMENT_DETAILS: transferFormData.PAYMENT_DETAILS || '',
        PAYMENT_DATE: transferFormData.PAYMENT_DATE || '',
        Remark: transferFormData.Remark || '',
      };

      const result = await submitBankTransfer(payload).unwrap();

      Swal.fire({
        icon: 'success',
        title: 'Bank Transfer Saved!',
        text: `UID: ${result?.UID || result?.uid || result?.data?.UID || 'Generated'}`,
        confirmButtonColor: '#10b981',
        timer: 2800,
        showConfirmButton: false,
      });

      setTransferFormData({
        Transfer_A_C_Name: '',
        Transfer_Received_A_C_Name: '',
        Amount: '',
        PAYMENT_MODE: '',
        PAYMENT_DETAILS: '',
        PAYMENT_DATE: '',
        Remark: '',
      });
    } catch (err) {
      console.error('Bank transfer error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: err?.data?.message || 'Failed to submit bank transfer.',
      });
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-10 xl:px-12 ${
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
            className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full opacity-20 ${
              isDarkMode ? 'bg-white' : 'bg-gray-900'
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-screen-2xl mx-auto">
        <div className={`bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode ? 'border-white/10' : 'border-gray-200'
        }`}>

          {/* Header */}
          <div className={`px-6 py-8 sm:px-10 md:px-12 lg:px-16 border-b ${
            isDarkMode ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 border-indigo-700/40' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border-gray-300'
          }`}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent text-center ${
              isDarkMode ? 'from-indigo-200 via-purple-200 to-indigo-200' : 'from-indigo-600 via-purple-600 to-indigo-600'
            }`}>
              Payment Management
            </h2>
            <p className={`text-center mt-3 text-base sm:text-lg md:text-xl ${
              isDarkMode ? 'text-indigo-300/80' : 'text-indigo-700/80'
            }`}>
              Receive client payment or manage capital / bank movements
            </p>
          </div>

          {/* Tabs */}
          <div className={`flex border-b ${
            isDarkMode ? 'border-indigo-700/40 bg-black/20' : 'border-gray-300 bg-gray-50/20'
          }`}>
            <button
              onClick={() => setActiveTab('client-in')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'client-in'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 text-emerald-200 border-b-4 border-emerald-500'
                    : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-b-4 border-emerald-500'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Received From Client
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'transfer'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-purple-200 border-b-4 border-purple-500'
                    : 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-b-4 border-purple-500'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Bank Transfer
            </button>
            <button
              onClick={() => setActiveTab('capital')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'capital'
                  ? isDarkMode 
                    ? 'bg-gradient-to-r from-amber-900/60 to-yellow-900/60 text-amber-200 border-b-4 border-amber-500'
                    : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border-b-4 border-amber-500'
                  : isDarkMode 
                    ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              Capital A/C
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 space-y-8 lg:space-y-10">
            {/* CLIENT IN FORM */}
            {activeTab === 'client-in' && (
              <div className="space-y-7 lg:space-y-8">
                {/* Site Name */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Site Name / Project <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className={isDarkMode ? "text-indigo-300 italic" : "text-indigo-600 italic"}>Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className={isDarkMode ? "text-amber-400" : "text-amber-600"}>No projects available</div>
                  ) : (
                    <select
                      name="SiteName"
                      value={clientFormData.SiteName}
                      onChange={handleClientChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((project, i) => (
                        <option key={i} value={project}>{project}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Amount + Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>₹</span>
                      <input
                        type="number"
                        name="Amount"
                        value={clientFormData.Amount}
                        onChange={handleClientChange}
                        min="1"
                        step="0.01"
                        className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Payment Mode</label>
                    <select
                      name="PaymentMode"
                      value={clientFormData.PaymentMode}
                      onChange={handleClientChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">---- Select ----</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </div>
                </div>

                {/* GST */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Apply GST</label>
                  <select
                    name="GST"
                    value={clientFormData.GST}
                    onChange={handleClientChange}
                    className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                    }`}
                  >
                    <option value="">No GST</option>
                    <option value="18">GST @ 18%</option>
                  </select>
                </div>

                {/* CGST + SGST */}
                {clientFormData.GST === '18' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>CGST (9%)</label>
                      <div className={`px-5 py-4 border rounded-lg font-medium text-xl ${
                        isDarkMode ? 'bg-gray-800/50 border-gray-700 text-emerald-300' : 'bg-gray-100 border-gray-300 text-emerald-600'
                      }`}>
                        {clientFormData.CGST ? `₹ ${Number(clientFormData.CGST).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>SGST (9%)</label>
                      <div className={`px-5 py-4 border rounded-lg font-medium text-xl ${
                        isDarkMode ? 'bg-gray-800/50 border-gray-700 text-emerald-300' : 'bg-gray-100 border-gray-300 text-emerald-600'
                      }`}>
                        {clientFormData.SGST ? `₹ ${Number(clientFormData.SGST).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Amount */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Net Amount {clientFormData.GST === '18' ? '(Including GST)' : ''}
                  </label>
                  <div className={`px-6 py-5 border rounded-xl font-bold text-2xl ${
                    isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border-emerald-700/40 text-emerald-300' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-300 text-emerald-700'
                  }`}>
                    {clientFormData.NetAmount ? `₹ ${Number(clientFormData.NetAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                  </div>
                </div>

                {/* RCC Credit Account */}
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    RCC Credit Account Name <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className={isDarkMode ? "text-indigo-300 italic" : "text-indigo-600 italic"}>Loading accounts...</div>
                  ) : (
                    <select
                      name="RccCreditAccountName"
                      value={clientFormData.RccCreditAccountName}
                      onChange={handleClientChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Transaction Details */}
                {showClientTransactionFields && (
                  <div className={`space-y-6 p-6 lg:p-8 rounded-xl border ${
                    isDarkMode ? 'bg-black/40 border-indigo-700/40' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <h3 className={`font-semibold text-xl lg:text-2xl ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Details' : 'Transaction Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-2">
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {clientFormData.PaymentMode === 'Cheque' ? 'Cheque No' : 'Transaction No / UTR No'} <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          name="TransactionNo"
                          value={clientFormData.TransactionNo}
                          onChange={handleClientChange}
                          className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                            isDarkMode 
                              ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                          }`}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Date' : 'Transaction Date'} <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="date"
                          name="TransactionDate"
                          value={clientFormData.TransactionDate}
                          onChange={handleClientChange}
                          className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                            isDarkMode 
                              ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                          }`}
                        />
                      </div>
                    </div>

                    {showChequePhoto && (
                      <div className="space-y-4 pt-4">
                        <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                          Cheque Photo <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        {!clientFormData.ChequePhoto ? (
                          <label className={`flex flex-col items-center justify-center w-full h-64 sm:h-72 lg:h-80 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                            isDarkMode 
                              ? 'border-indigo-600/50 hover:border-indigo-400 hover:bg-indigo-950/30 bg-black/30'
                              : 'border-indigo-400 hover:border-indigo-500 hover:bg-indigo-50 bg-gray-50'
                          }`}>
                            <svg className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className={`text-center px-6 text-base ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                              Click to upload cheque photo
                            </p>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                          </label>
                        ) : (
                          <div className="relative max-w-2xl mx-auto">
                            <img
                              src={clientFormData.ChequePhoto}
                              alt="Cheque preview"
                              className={`w-full max-h-96 object-contain rounded-xl border shadow-2xl ${
                                isDarkMode ? 'border-indigo-700/40' : 'border-indigo-300'
                              }`}
                            />
                            <button
                              onClick={removePhoto}
                              className={`absolute top-4 right-4 rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition text-xl ${
                                isDarkMode ? 'bg-red-600/90 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                              }`}
                            >
                              ✕
                            </button>
                            <p className={`text-center mt-4 text-base font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                              ✓ Photo uploaded
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleClientSubmit}
                  disabled={isSubmittingClient}
                  className={`w-full py-5 sm:py-6 mt-6 lg:mt-8 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform shadow-xl ${
                    isSubmittingClient
                      ? 'bg-gray-700 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-2xl hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingClient ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Payment...
                    </span>
                  ) : '✓ Add Payment'}
                </button>

                {/* Feedback */}
                {clientSuccess && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-emerald-900/40 border-emerald-700/50' : 'bg-emerald-50 border-emerald-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      ✓ Payment added successfully!
                    </p>
                    {clientData?.uid && (
                      <p className={`mt-4 text-lg ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                        UID: <span className={`font-mono px-5 py-2 rounded ${isDarkMode ? 'bg-emerald-950/70' : 'bg-emerald-100'}`}>{clientData.uid}</span>
                      </p>
                    )}
                  </div>
                )}
                {clientError && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-red-900/40 border-red-700/50' : 'bg-red-50 border-red-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      ✗ {clientErr?.data?.message || 'Failed to add payment'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* BANK TRANSFER FORM */}
            {activeTab === 'transfer' && (
              <div className="space-y-7 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Transfer A/C Name (From) <span className="text-red-400">*</span>
                    </label>
                    {isDropdownLoading ? (
                      <div className={isDarkMode ? "text-indigo-300 italic" : "text-indigo-600 italic"}>Loading accounts...</div>
                    ) : (
                      <select
                        name="Transfer_A_C_Name"
                        value={transferFormData.Transfer_A_C_Name}
                        onChange={handleTransferChange}
                        className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                      >
                        <option value="">-- Select Account --</option>
                        {accounts.map((acc, i) => (
                          <option key={i} value={acc}>{acc}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Transfer Received A/C Name (To) <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="Transfer_Received_A_C_Name"
                      value={transferFormData.Transfer_Received_A_C_Name}
                      onChange={handleTransferChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>₹</span>
                      <input
                        type="number"
                        name="Amount"
                        value={transferFormData.Amount}
                        onChange={handleTransferChange}
                        min="1"
                        step="0.01"
                        className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Payment Mode <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="PAYMENT_MODE"
                      value={transferFormData.PAYMENT_MODE}
                      onChange={handleTransferChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">---- Select ----</option>
                      <option value="Cheque">Cheque</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </div>
                </div>

                {showTransferTransactionDetails && (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 rounded-xl border ${
                    isDarkMode ? 'bg-black/30 border-indigo-800/40' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {transferFormData.PAYMENT_MODE === 'Cheque' ? 'Cheque No' : 'UTR No / Ref No'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="PAYMENT_DETAILS"
                        value={transferFormData.PAYMENT_DETAILS}
                        onChange={handleTransferChange}
                        placeholder={transferFormData.PAYMENT_MODE === 'Cheque' ? 'Enter cheque number' : 'Enter UTR / reference'}
                        className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Payment Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="PAYMENT_DATE"
                        value={transferFormData.PAYMENT_DATE}
                        onChange={handleTransferChange}
                        className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Remark (Optional)</label>
                  <textarea
                    name="Remark"
                    value={transferFormData.Remark}
                    onChange={handleTransferChange}
                    rows="4"
                    className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 resize-y min-h-[120px] text-base ${
                      isDarkMode 
                        ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                    }`}
                    placeholder="Any additional notes..."
                  />
                </div>

                <button
                  onClick={handleTransferSubmit}
                  disabled={isSubmittingTransfer}
                  className={`w-full py-5 sm:py-6 mt-6 lg:mt-8 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform shadow-xl ${
                    isSubmittingTransfer
                      ? 'bg-gray-700 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingTransfer ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Transfer...
                    </span>
                  ) : '✓ Submit Bank Transfer'}
                </button>

                {transferSuccess && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-emerald-900/40 border-emerald-700/50' : 'bg-emerald-50 border-emerald-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      ✓ Bank transfer submitted successfully!
                    </p>
                    {transferData?.UID && (
                      <p className={`mt-4 text-lg ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                        UID: <span className={`font-mono px-5 py-2 rounded ${isDarkMode ? 'bg-emerald-950/70' : 'bg-emerald-100'}`}>{transferData.UID}</span>
                      </p>
                    )}
                  </div>
                )}

                {transferError && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-red-900/40 border-red-700/50' : 'bg-red-50 border-red-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      ✗ {transferErr?.data?.message || 'Failed to submit transfer'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* CAPITAL A/C FORM */}
            {activeTab === 'capital' && (
              <div className="space-y-7 lg:space-y-8">
                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Capital Movement <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className={isDarkMode ? "text-indigo-300 italic" : "text-indigo-600 italic"}>Loading movements...</div>
                  ) : capitalMovements.length === 0 ? (
                    <div className={isDarkMode ? "text-amber-400" : "text-amber-600"}>No capital movement options available</div>
                  ) : (
                    <select
                      name="Capital_Movment"
                      value={capitalFormData.Capital_Movment}
                      onChange={handleCapitalChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">-- Select Movement --</option>
                      {capitalMovements.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Received Account <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className={isDarkMode ? "text-indigo-300 italic" : "text-indigo-600 italic"}>Loading accounts...</div>
                  ) : (
                    <select
                      name="Received_Account"
                      value={capitalFormData.Received_Account}
                      onChange={handleCapitalChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-medium text-lg ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>₹</span>
                      <input
                        type="number"
                        name="Amount"
                        value={capitalFormData.Amount}
                        onChange={handleCapitalChange}
                        min="1"
                        step="0.01"
                        className={`w-full pl-12 pr-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Payment Mode <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="PAYMENT_MODE"
                      value={capitalFormData.PAYMENT_MODE}
                      onChange={handleCapitalChange}
                      className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                        isDarkMode 
                          ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                      }`}
                    >
                      <option value="">---- Select ----</option>
                      <option value="Cash">Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                </div>

                {showCapitalTransactionDetails && (
                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 rounded-xl border ${
                    isDarkMode ? 'bg-black/30 border-indigo-800/40' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {capitalFormData.PAYMENT_MODE === 'Cheque' ? 'Cheque No' : 'Payment Details / UTR No'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="PAYMENT_DETAILS"
                        value={capitalFormData.PAYMENT_DETAILS}
                        onChange={handleCapitalChange}
                        className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                        placeholder={capitalFormData.PAYMENT_MODE === 'Cheque' ? 'Cheque number' : 'UTR / Reference number'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Payment Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="PAYMENT_DATE"
                        value={capitalFormData.PAYMENT_DATE}
                        onChange={handleCapitalChange}
                        className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 text-base ${
                          isDarkMode 
                            ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                            : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                        }`}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className={`block text-sm font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Remark (Optional)</label>
                  <textarea
                    name="Remark"
                    value={capitalFormData.Remark}
                    onChange={handleCapitalChange}
                    rows="4"
                    className={`w-full px-5 py-3.5 border rounded-lg focus:outline-none focus:ring-2 resize-y min-h-[120px] text-base ${
                      isDarkMode 
                        ? 'bg-gray-900/70 border-indigo-600/50 text-gray-200 focus:ring-indigo-500'
                        : 'bg-white border-gray-300 text-gray-900 focus:ring-indigo-400'
                    }`}
                    placeholder="Any additional notes or reference..."
                  />
                </div>

                <button
                  onClick={handleCapitalSubmit}
                  disabled={isSubmittingCapital}
                  className={`w-full py-5 sm:py-6 mt-6 lg:mt-8 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform shadow-xl ${
                    isSubmittingCapital
                      ? 'bg-gray-700 cursor-not-allowed'
                      : isDarkMode
                        ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 hover:shadow-2xl hover:scale-[1.02]'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingCapital ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Capital Entry...
                    </span>
                  ) : '✓ Save Capital Movement'}
                </button>

                {capitalSuccess && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-emerald-900/40 border-emerald-700/50' : 'bg-emerald-50 border-emerald-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      ✓ Capital movement saved successfully!
                    </p>
                    {capitalData?.data?.UID && (
                      <p className={`mt-4 text-lg ${isDarkMode ? 'text-emerald-200' : 'text-emerald-800'}`}>
                        Generated UID: <span className={`font-mono px-4 py-1 rounded ${isDarkMode ? 'bg-emerald-950/70' : 'bg-emerald-100'}`}>{capitalData.data.UID}</span>
                      </p>
                    )}
                  </div>
                )}

                {capitalError && (
                  <div className={`p-6 lg:p-8 border rounded-xl text-center ${
                    isDarkMode ? 'bg-red-900/40 border-red-700/50' : 'bg-red-50 border-red-300'
                  }`}>
                    <p className={`font-bold text-xl lg:text-2xl ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                      ✗ {capitalErr?.data?.message || 'Failed to save capital entry'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global animation keyframes */}
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

export default Form;