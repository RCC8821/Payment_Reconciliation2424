
import React, { useState, useEffect } from 'react';
import { 
  useAddPaymentMutation, 
  useSubmitCapitalMovementMutation,
  useGetDropdownDataQuery 
} from '../../features/Payment/FormSlice';

import Swal from 'sweetalert2';

const Form = () => {
  const [activeTab, setActiveTab] = useState('client-in');

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
  // Capital Movement Form State (matches backend exactly)
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

  // Conditions
  const showClientTransactionFields = ['Cheque', 'NEFT', 'RTGS'].includes(clientFormData.PaymentMode);
  const showChequePhoto = clientFormData.PaymentMode === 'Cheque';
  const showCapitalTransactionDetails = ['Cheque', 'NEFT', 'RTGS'].includes(capitalFormData.PAYMENT_MODE);

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
    if (!clientFormData.SiteName) return alert('Site Name is required');
    if (!clientFormData.Amount || Number(clientFormData.Amount) <= 0) return alert('Valid Amount is required');
    if (!clientFormData.RccCreditAccountName) return alert('Please select RCC Credit Account Name');
    if (showClientTransactionFields && (!clientFormData.TransactionNo.trim() || !clientFormData.TransactionDate.trim())) {
      return alert('Transaction No and Date are required for selected payment mode');
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
      alert(err?.data?.message || 'Failed to add payment. Please try again.');
    }
  };

  // ───────────────────────────────────────────────
  // Capital Movement Submit
  // ───────────────────────────────────────────────
  const handleCapitalSubmit = async () => {
    if (!capitalFormData.Capital_Movment) return alert('Capital Movement is required');
    if (!capitalFormData.Received_Account) return alert('Received Account is required');
    if (!capitalFormData.Amount || Number(capitalFormData.Amount) <= 0) return alert('Valid Amount is required');
    if (!capitalFormData.PAYMENT_MODE) return alert('Payment Mode is required');
    if (showCapitalTransactionDetails && (!capitalFormData.PAYMENT_DETAILS?.trim() || !capitalFormData.PAYMENT_DATE?.trim())) {
      return alert('Payment Details and Date are required for selected mode');
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
      alert(err?.data?.message || 'Failed to save capital movement. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-8 px-4 sm:px-6 lg:px-10 xl:px-12">

      {/* Background orbs */}
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
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full opacity-20"
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
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 px-6 py-8 sm:px-10 md:px-12 lg:px-16 border-b border-indigo-700/40">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent text-center">
              Payment Management
            </h2>
            <p className="text-indigo-300/80 text-center mt-3 text-base sm:text-lg md:text-xl">
              Receive client payment or manage capital / bank movements
            </p>
          </div>

          {/* Tabs - 3 tabs now */}
          <div className="flex border-b border-indigo-700/40 bg-black/20">
            <button
              onClick={() => setActiveTab('client-in')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'client-in'
                  ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 text-emerald-200 border-b-4 border-emerald-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Received From Client
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'transfer'
                  ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-purple-200 border-b-4 border-purple-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Bank Transfer
            </button>
            <button
              onClick={() => setActiveTab('capital')}
              className={`flex-1 py-5 text-center font-semibold text-base sm:text-lg transition-all ${
                activeTab === 'capital'
                  ? 'bg-gradient-to-r from-amber-900/60 to-yellow-900/60 text-amber-200 border-b-4 border-amber-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Capital A/C
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 space-y-8 lg:space-y-10">

            {/* ====================== CLIENT IN FORM ====================== */}
            {activeTab === 'client-in' && (
              <div className="space-y-7 lg:space-y-8">
                {/* Site Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">
                    Site Name / Project <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className="text-indigo-300 italic">Loading projects...</div>
                  ) : projects.length === 0 ? (
                    <div className="text-amber-400">No projects available</div>
                  ) : (
                    <select 
                      name="SiteName" 
                      value={clientFormData.SiteName} 
                      onChange={handleClientChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
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
                    <label className="block text-sm font-semibold text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                      <input 
                        type="number" 
                        name="Amount" 
                        value={clientFormData.Amount} 
                        onChange={handleClientChange} 
                        min="1" 
                        step="0.01"
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">Payment Mode</label>
                    <select 
                      name="PaymentMode" 
                      value={clientFormData.PaymentMode} 
                      onChange={handleClientChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
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
                  <label className="block text-sm font-semibold text-gray-200">Apply GST</label>
                  <select 
                    name="GST" 
                    value={clientFormData.GST} 
                    onChange={handleClientChange}
                    className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">No GST</option>
                    <option value="18">GST @ 18%</option>
                  </select>
                </div>

                {/* CGST + SGST */}
                {clientFormData.GST === '18' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">CGST (9%)</label>
                      <div className="px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-emerald-300 font-medium text-xl">
                        {clientFormData.CGST ? `₹ ${Number(clientFormData.CGST).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">SGST (9%)</label>
                      <div className="px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-emerald-300 font-medium text-xl">
                        {clientFormData.SGST ? `₹ ${Number(clientFormData.SGST).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Net Amount */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">
                    Net Amount {clientFormData.GST === '18' ? '(Including GST)' : ''}
                  </label>
                  <div className="px-6 py-5 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/40 rounded-xl text-emerald-300 font-bold text-2xl">
                    {clientFormData.NetAmount ? `₹ ${Number(clientFormData.NetAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—'}
                  </div>
                </div>

                {/* RCC Credit Account */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">
                    RCC Credit Account Name <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className="text-indigo-300 italic">Loading accounts...</div>
                  ) : (
                    <select 
                      name="RccCreditAccountName" 
                      value={clientFormData.RccCreditAccountName} 
                      onChange={handleClientChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
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
                  <div className="space-y-6 p-6 lg:p-8 bg-black/40 backdrop-blur-sm rounded-xl border border-indigo-700/40">
                    <h3 className="font-semibold text-indigo-300 text-xl lg:text-2xl">
                      {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Details' : 'Transaction Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-200">
                          {clientFormData.PaymentMode === 'Cheque' ? 'Cheque No' : 'Transaction No / UTR No'} <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="TransactionNo" 
                          value={clientFormData.TransactionNo} 
                          onChange={handleClientChange}
                          className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-200">
                          {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Date' : 'Transaction Date'} <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="date" 
                          name="TransactionDate" 
                          value={clientFormData.TransactionDate} 
                          onChange={handleClientChange}
                          className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        />
                      </div>
                    </div>

                    {showChequePhoto && (
                      <div className="space-y-4 pt-4">
                        <label className="block text-sm font-semibold text-gray-200">
                          Cheque Photo <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        {!clientFormData.ChequePhoto ? (
                          <label className="flex flex-col items-center justify-center w-full h-64 sm:h-72 lg:h-80 border-2 border-dashed border-indigo-600/50 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-950/30 transition-colors bg-black/30">
                            <svg className="w-16 h-16 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-indigo-300 text-center px-6 text-base">Click to upload cheque photo</p>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                          </label>
                        ) : (
                          <div className="relative max-w-2xl mx-auto">
                            <img 
                              src={clientFormData.ChequePhoto} 
                              alt="Cheque preview" 
                              className="w-full max-h-96 object-contain rounded-xl border border-indigo-700/40 shadow-2xl" 
                            />
                            <button 
                              onClick={removePhoto} 
                              className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition text-xl"
                            >
                              ✕
                            </button>
                            <p className="text-center mt-4 text-base text-emerald-400 font-medium">✓ Photo uploaded</p>
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
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 hover:shadow-2xl hover:scale-[1.02]'
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
                  <div className="p-6 lg:p-8 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-center">
                    <p className="text-emerald-300 font-bold text-xl lg:text-2xl">✓ Payment added successfully!</p>
                    {clientData?.uid && (
                      <p className="mt-4 text-emerald-200 text-lg">
                        UID: <span className="font-mono bg-emerald-950/70 px-5 py-2 rounded">{clientData.uid}</span>
                      </p>
                    )}
                  </div>
                )}
                {clientError && (
                  <div className="p-6 lg:p-8 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                    <p className="text-red-300 font-bold text-xl lg:text-2xl">✗ {clientErr?.data?.message || 'Failed to add payment'}</p>
                  </div>
                )}
              </div>
            )}

            {/* ====================== BANK TRANSFER FORM ====================== */}
            {activeTab === 'transfer' && (
              <div className="space-y-7 lg:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Transfer A/C Name (From) <span className="text-red-400">*</span>
                    </label>
                    {isDropdownLoading ? (
                      <div className="text-indigo-300 italic">Loading accounts...</div>
                    ) : (
                      <select 
                        name="Transfer_A_C_Name" 
                        value={capitalFormData.Transfer_A_C_Name || ''} // Note: this tab still uses old state - you may want separate state later
                        onChange={handleCapitalChange} // temporary - better to make separate handler/state
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                      >
                        <option value="">-- Select Account --</option>
                        {accounts.map((acc, i) => (
                          <option key={i} value={acc}>{acc}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Transfer Received A/C Name (To) <span className="text-red-400">*</span>
                    </label>
                    <select 
                      name="Transfer_Received_A_C_Name" 
                      value={capitalFormData.Transfer_Received_A_C_Name || ''} // temporary
                      onChange={handleCapitalChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount + Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                      <input 
                        type="number" 
                        name="Amount" 
                        value={capitalFormData.Amount} 
                        onChange={handleCapitalChange} 
                        min="1" 
                        step="0.01"
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        placeholder="0.00" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Payment Mode <span className="text-red-400">*</span>
                    </label>
                    <select 
                      name="PAYMENT_MODE" 
                      value={capitalFormData.PAYMENT_MODE} 
                      onChange={handleCapitalChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    >
                      <option value="">---- Select ----</option>
                      <option value="Cheque">Cheque</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </div>
                </div>

                {/* Payment Details + Date */}
                {showCapitalTransactionDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        Payment Details 
                        {capitalFormData.PAYMENT_MODE === 'Cheque' ? '(Cheque No)' : '(UTR No)'} 
                        <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="PAYMENT_DETAILS" 
                        value={capitalFormData.PAYMENT_DETAILS} 
                        onChange={handleCapitalChange}
                        placeholder={capitalFormData.PAYMENT_MODE === 'Cheque' ? 'Enter cheque number' : 'Enter UTR number'}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        Payment Date <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="PAYMENT_DATE" 
                        value={capitalFormData.PAYMENT_DATE} 
                        onChange={handleCapitalChange}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Remark */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Remark (Optional)</label>
                  <textarea 
                    name="Remark" 
                    value={capitalFormData.Remark} 
                    onChange={handleCapitalChange} 
                    rows="4"
                    className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[120px] text-base"
                    placeholder="Any additional notes..."
                  />
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleCapitalSubmit} 
                  disabled={isSubmittingCapital}
                  className={`w-full py-5 sm:py-6 mt-6 lg:mt-8 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform shadow-xl ${
                    isSubmittingCapital 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingCapital ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Transfer...
                    </span>
                  ) : '✓ Submit Transfer'}
                </button>

                {/* Feedback */}
                {capitalSuccess && (
                  <div className="p-6 lg:p-8 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-center">
                    <p className="text-emerald-300 font-bold text-xl lg:text-2xl">✓ Bank transfer submitted successfully!</p>
                  </div>
                )}
                {capitalError && (
                  <div className="p-6 lg:p-8 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                    <p className="text-red-300 font-bold text-xl lg:text-2xl">✗ {capitalErr?.data?.message || 'Failed to submit transfer'}</p>
                  </div>
                )}
              </div>
            )}

            {/* ====================== CAPITAL A/C FORM ====================== */}
            {activeTab === 'capital' && (
              <div className="space-y-7 lg:space-y-8">

                {/* Capital Movement */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">
                    Capital Movement <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className="text-indigo-300 italic">Loading movements...</div>
                  ) : capitalMovements.length === 0 ? (
                    <div className="text-amber-400">No capital movement options available</div>
                  ) : (
                    <select
                      name="Capital_Movment"
                      value={capitalFormData.Capital_Movment}
                      onChange={handleCapitalChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    >
                      <option value="">-- Select Movement --</option>
                      {capitalMovements.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Received Account */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">
                    Received Account <span className="text-red-400">*</span>
                  </label>
                  {isDropdownLoading ? (
                    <div className="text-indigo-300 italic">Loading accounts...</div>
                  ) : (
                    <select
                      name="Received_Account"
                      value={capitalFormData.Received_Account}
                      onChange={handleCapitalChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Amount + Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                      <input
                        type="number"
                        name="Amount"
                        value={capitalFormData.Amount}
                        onChange={handleCapitalChange}
                        min="1"
                        step="0.01"
                        className="w-full pl-12 pr-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Payment Mode <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="PAYMENT_MODE"
                      value={capitalFormData.PAYMENT_MODE}
                      onChange={handleCapitalChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
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

                {/* Conditional Payment Details + Date */}
                {showCapitalTransactionDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 p-6 bg-black/30 rounded-xl border border-indigo-800/40">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        {capitalFormData.PAYMENT_MODE === 'Cheque' ? 'Cheque No' : 'Payment Details / UTR No'} <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="PAYMENT_DETAILS"
                        value={capitalFormData.PAYMENT_DETAILS}
                        onChange={handleCapitalChange}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                        placeholder={capitalFormData.PAYMENT_MODE === 'Cheque' ? 'Cheque number' : 'UTR / Reference number'}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        Payment Date <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="date"
                        name="PAYMENT_DATE"
                        value={capitalFormData.PAYMENT_DATE}
                        onChange={handleCapitalChange}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                      />
                    </div>
                  </div>
                )}

                {/* Remark */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Remark (Optional)</label>
                  <textarea
                    name="Remark"
                    value={capitalFormData.Remark}
                    onChange={handleCapitalChange}
                    rows="4"
                    className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[120px] text-base"
                    placeholder="Any additional notes or reference..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCapitalSubmit}
                  disabled={isSubmittingCapital}
                  className={`w-full py-5 sm:py-6 mt-6 lg:mt-8 text-white font-bold rounded-xl text-lg sm:text-xl transition-all transform shadow-xl ${
                    isSubmittingCapital
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingCapital ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Capital Entry...
                    </span>
                  ) : '✓ Save Capital Movement'}
                </button>

                {/* Feedback Messages */}
                {capitalSuccess && (
                  <div className="p-6 lg:p-8 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-center">
                    <p className="text-emerald-300 font-bold text-xl lg:text-2xl">✓ Capital movement saved successfully!</p>
                    {capitalData?.data?.UID && (
                      <p className="mt-4 text-emerald-200 text-lg">
                        Generated UID: <span className="font-mono bg-emerald-950/70 px-4 py-1 rounded">{capitalData.data.UID}</span>
                      </p>
                    )}
                  </div>
                )}
                {capitalError && (
                  <div className="p-6 lg:p-8 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                    <p className="text-red-300 font-bold text-xl lg:text-2xl">
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