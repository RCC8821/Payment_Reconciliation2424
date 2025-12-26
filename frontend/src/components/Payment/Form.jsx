import React, { useState, useEffect } from 'react';
import { useAddPaymentMutation } from '../../features/Payment/FormSlice';

const Form = () => {
  const [addPayment, { isLoading, isSuccess, isError, error, data }] = useAddPaymentMutation();

  const [formData, setFormData] = useState({
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
    ChequePhoto: null, // base64 string ya null (optional)
  });

  const accountOptions = [
    "SVC Main A/C(202)",
    "SVC VENDER PAY A/C(328)",
    "HDFC Bank"
  ];

  // Conditions
  const showTransactionFields = ['Cheque', 'NEFT', 'RTGS'].includes(formData.PaymentMode);
  const showChequePhoto = formData.PaymentMode === 'Cheque';

  // GST Auto Calculation
  useEffect(() => {
    if (formData.Amount && formData.GST === '18') {
      const amount = Number(formData.Amount);
      const gstAmount = (amount * 18) / 100;
      const halfGST = gstAmount / 2;

      setFormData(prev => ({
        ...prev,
        CGST: halfGST.toFixed(2),
        SGST: halfGST.toFixed(2),
        NetAmount: (amount + gstAmount).toFixed(2),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        CGST: '',
        SGST: '',
        NetAmount: formData.Amount || '',
      }));
    }
  }, [formData.Amount, formData.GST]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Cheque Photo Upload → Convert to Base64
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          ChequePhoto: reader.result // data:image/...;base64,...
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded photo
  const removePhoto = () => {
    setFormData(prev => ({
      ...prev,
      ChequePhoto: null
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.SiteName.trim()) {
      alert('Site Name is required');
      return;
    }
    if (!formData.Amount || Number(formData.Amount) <= 0) {
      alert('Valid Amount is required');
      return;
    }
    if (!formData.RccCreditAccountName) {
      alert('Please select RCC Credit Account Name');
      return;
    }
    if (showTransactionFields && (!formData.TransactionNo.trim() || !formData.TransactionDate.trim())) {
      alert('Transaction No and Date are required for selected payment mode');
      return;
    }

    try {
      const result = await addPayment({
        SiteName: formData.SiteName.trim(),
        Amount: Number(formData.Amount),
        CGST: formData.CGST ? Number(formData.CGST) : 0,
        SGST: formData.SGST ? Number(formData.SGST) : 0,
        NetAmount: formData.NetAmount ? Number(formData.NetAmount) : 0,
        RccCreditAccountName: formData.RccCreditAccountName,
        PaymentMode: formData.PaymentMode,
        ChequeNo: formData.TransactionNo,
        ChequeDate: formData.TransactionDate,
        ChequePhoto: formData.ChequePhoto, // optional → null bhi jaayega
      }).unwrap();

      alert(`Payment added successfully! UID: ${result.uid || 'N/A'}`);

      // Reset form after success
      setFormData({
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
    } catch (err) {
      console.error('Add payment error:', err);
      alert(err?.data?.message || 'Failed to add payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center">Add New Payment</h2>
            <p className="text-blue-100 text-center mt-2">Fill in the payment details below</p>
          </div>

          <div className="p-8 space-y-6">
            {/* Site Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Site Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="SiteName"
                value={formData.SiteName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="Enter site name"
              />
            </div>

            {/* Amount & Payment Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
                  <input
                    type="number"
                    name="Amount"
                    value={formData.Amount}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Payment Mode</label>
                <select
                  name="PaymentMode"
                  value={formData.PaymentMode}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
                >
                  <option value="">---- Select ----</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                  <option value="NEFT">NEFT</option>
                  <option value="RTGS">RTGS</option>
                </select>
              </div>
            </div>

            {/* Apply GST */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Apply GST</label>
              <select
                name="GST"
                value={formData.GST}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <option value="">No GST</option>
                <option value="18">GST @ 18%</option>
              </select>
            </div>

            {/* CGST & SGST - Only if GST applied */}
            {formData.GST === '18' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">CGST (9%)</label>
                  <input
                    type="text"
                    value={formData.CGST ? `₹ ${Number(formData.CGST).toLocaleString('en-IN')}` : ''}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
                    placeholder="Auto calculated"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">SGST (9%)</label>
                  <input
                    type="text"
                    value={formData.SGST ? `₹ ${Number(formData.SGST).toLocaleString('en-IN')}` : ''}
                    readOnly
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium"
                    placeholder="Auto calculated"
                  />
                </div>
              </div>
            )}

            {/* Net Amount */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Net Amount {formData.GST === '18' ? '(Including GST)' : ''}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.NetAmount ? `₹ ${Number(formData.NetAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                  readOnly
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 text-green-700 font-bold text-lg"
                  placeholder="₹ 0.00"
                />
              </div>
            </div>

            {/* RCC Credit Account Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                RCC Credit Account Name <span className="text-red-500">*</span>
              </label>
              <select
                name="RccCreditAccountName"
                value={formData.RccCreditAccountName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              >
                <option value="">Select Account</option>
                {accountOptions.map((account, index) => (
                  <option key={index} value={account}>
                    {account}
                  </option>
                ))}
              </select>
            </div>

            {/* Transaction Details (Cheque / NEFT / RTGS) */}
            {showTransactionFields && (
              <div className="space-y-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
                <h3 className="font-semibold text-blue-900 text-lg">
                  {formData.PaymentMode === 'Cheque' ? 'Cheque Details' : 'Transaction Details'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {formData.PaymentMode === 'Cheque' ? 'Cheque No' : 'Transaction No / UTR No'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="TransactionNo"
                      value={formData.TransactionNo}
                      onChange={handleChange}
                      placeholder={formData.PaymentMode === 'Cheque' ? 'Enter cheque number' : 'Enter transaction/UTR number'}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      {formData.PaymentMode === 'Cheque' ? 'Cheque Date' : 'Transaction Date'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="TransactionDate"
                      value={formData.TransactionDate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                  </div>
                </div>

                {/* Optional Cheque Photo Upload - Only for Cheque */}
                {showChequePhoto && (
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Cheque Photo <span className="text-gray-500 text-xs font-normal">(Optional)</span>
                    </label>

                    {!formData.ChequePhoto ? (
                      <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all bg-gray-50">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 text-center px-4">
                          Click to upload cheque photo<br />
                          <span className="text-sm">(JPG, PNG supported)</span>
                        </p>
                        <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                      </label>
                    ) : (
                      <div className="relative max-w-md mx-auto">
                        <img
                          src={formData.ChequePhoto}
                          alt="Cheque preview"
                          className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-300 shadow-md"
                        />
                        <button
                          onClick={removePhoto}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition"
                          title="Remove photo"
                        >
                          ✕
                        </button>
                        <p className="text-center mt-2 text-sm text-green-700 font-medium">✓ Photo uploaded</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 mt-8 text-white font-bold rounded-lg text-lg transition-all transform ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving Payment...
                </span>
              ) : (
                '✓ Add Payment'
              )}
            </button>

            {/* Success Message */}
            {isSuccess && (
              <div className="p-5 bg-green-50 border-2 border-green-200 rounded-lg text-center">
                <p className="text-green-800 font-bold text-lg">
                  ✓ Payment added successfully!
                </p>
                {data?.uid && (
                  <p className="mt-2 text-sm">
                    UID: <span className="font-mono bg-green-100 px-3 py-1 rounded">{data.uid}</span>
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {isError && (
              <div className="p-5 bg-red-50 border-2 border-red-200 rounded-lg text-center">
                <p className="text-red-800 font-bold">
                  ✗ {error?.data?.message || 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;