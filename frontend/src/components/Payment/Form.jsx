
// import React, { useState, useEffect } from 'react';
// import { 
//   useAddPaymentMutation, 
//   useSubmitBankTransferMutation,  // Naya mutation for Transfer
//   useGetDropdownDataQuery 
// } from '../../features/Payment/FormSlice';

// const Form = () => {
//   const [activeTab, setActiveTab] = useState('client-in');

//   // Mutations
//   const [addPayment, { 
//     isLoading: isSubmittingClient, 
//     isSuccess: clientSuccess, 
//     isError: clientError, 
//     error: clientErr, 
//     data: clientData 
//   }] = useAddPaymentMutation();

//   const [submitBankTransfer, { 
//     isLoading: isSubmittingTransfer, 
//     isSuccess: transferSuccess, 
//     isError: transferError, 
//     error: transferErr,
//     data: transferData 
//   }] = useSubmitBankTransferMutation();

//   // Dropdown Data
//   const { 
//     data: dropdownData,
//     isLoading: isDropdownLoading,
//     isError: isDropdownError
//   } = useGetDropdownDataQuery();

//   const projects = dropdownData?.projects || [];
//   const accounts = dropdownData?.accounts || [];

//   // Client In Form State
//   const [clientFormData, setClientFormData] = useState({
//     SiteName: '',
//     Amount: '',
//     GST: '',
//     CGST: '',
//     SGST: '',
//     NetAmount: '',
//     RccCreditAccountName: '',
//     PaymentMode: '',
//     TransactionNo: '',
//     TransactionDate: '',
//     ChequePhoto: null,
//   });

//   // Transfer Form State
//   const [transferFormData, setTransferFormData] = useState({
//     Transfer_A_C_Name: '',
//     Transfer_Received_A_C_Name: '',
//     Amount: '',
//     PAYMENT_MODE: '',
//     PAYMENT_DETAILS: '',
//     PAYMENT_DATE: '',
//     Remark: '',
//   });

//   // Conditions
//   const showClientTransactionFields = ['Cheque', 'NEFT', 'RTGS'].includes(clientFormData.PaymentMode);
//   const showChequePhoto = clientFormData.PaymentMode === 'Cheque';
//   const showTransferDetails = ['Cheque', 'NEFT', 'RTGS'].includes(transferFormData.PAYMENT_MODE);

//   // GST Auto Calculation (Client In)
//   useEffect(() => {
//     if (clientFormData.Amount && clientFormData.GST === '18') {
//       const amount = Number(clientFormData.Amount);
//       const gstAmount = (amount * 18) / 100;
//       const halfGST = gstAmount / 2;

//       setClientFormData(prev => ({
//         ...prev,
//         CGST: halfGST.toFixed(2),
//         SGST: halfGST.toFixed(2),
//         NetAmount: (amount + gstAmount).toFixed(2),
//       }));
//     } else {
//       setClientFormData(prev => ({
//         ...prev,
//         CGST: '',
//         SGST: '',
//         NetAmount: clientFormData.Amount || '',
//       }));
//     }
//   }, [clientFormData.Amount, clientFormData.GST]);

//   // Handlers
//   const handleClientChange = (e) => {
//     const { name, value } = e.target;
//     setClientFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTransferChange = (e) => {
//     const { name, value } = e.target;
//     setTransferFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setClientFormData(prev => ({ ...prev, ChequePhoto: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const removePhoto = () => {
//     setClientFormData(prev => ({ ...prev, ChequePhoto: null }));
//   };

//   // Client In Submit
//   const handleClientSubmit = async () => {
//     if (!clientFormData.SiteName) return alert('Site Name is required');
//     if (!clientFormData.Amount || Number(clientFormData.Amount) <= 0) return alert('Valid Amount is required');
//     if (!clientFormData.RccCreditAccountName) return alert('Please select RCC Credit Account Name');
//     if (showClientTransactionFields && (!clientFormData.TransactionNo.trim() || !clientFormData.TransactionDate.trim())) {
//       return alert('Transaction No and Date are required for selected payment mode');
//     }

//     try {
//       const result = await addPayment({
//         SiteName: clientFormData.SiteName.trim(),
//         Amount: Number(clientFormData.Amount),
//         CGST: clientFormData.CGST ? Number(clientFormData.CGST) : 0,
//         SGST: clientFormData.SGST ? Number(clientFormData.SGST) : 0,
//         NetAmount: clientFormData.NetAmount ? Number(clientFormData.NetAmount) : 0,
//         RccCreditAccountName: clientFormData.RccCreditAccountName,
//         PaymentMode: clientFormData.PaymentMode,
//         ChequeNo: clientFormData.TransactionNo,
//         ChequeDate: clientFormData.TransactionDate,
//         ChequePhoto: clientFormData.ChequePhoto,
//       }).unwrap();

//       alert(`Payment added successfully! UID: ${result.uid || 'N/A'}`);

//       // Reset Client Form
//       setClientFormData({
//         SiteName: '', Amount: '', GST: '', CGST: '', SGST: '', NetAmount: '',
//         RccCreditAccountName: '', PaymentMode: '', TransactionNo: '', TransactionDate: '', ChequePhoto: null
//       });
//     } catch (err) {
//       console.error('Client payment error:', err);
//       alert(err?.data?.message || 'Failed to add payment. Please try again.');
//     }
//   };

//   // Transfer Submit - Calls /api/Bank_Transfer_form
//   const handleTransferSubmit = async () => {
//     if (!transferFormData.Transfer_A_C_Name) return alert('Please select From Account');
//     if (!transferFormData.Transfer_Received_A_C_Name) return alert('Please select To Account');
//     if (transferFormData.Transfer_A_C_Name === transferFormData.Transfer_Received_A_C_Name) 
//       return alert('From and To accounts cannot be the same');
//     if (!transferFormData.Amount || Number(transferFormData.Amount) <= 0) return alert('Valid Amount is required');
//     if (!transferFormData.PAYMENT_MODE) return alert('Please select Payment Mode');
//     if (showTransferDetails && (!transferFormData.PAYMENT_DETAILS.trim() || !transferFormData.PAYMENT_DATE.trim())) {
//       return alert('Payment Details and Date are required for selected mode');
//     }

//     try {
//       const result = await submitBankTransfer({
//         Transfer_A_C_Name: transferFormData.Transfer_A_C_Name,
//         Transfer_Received_A_C_Name: transferFormData.Transfer_Received_A_C_Name,
//         Amount: Number(transferFormData.Amount),
//         PAYMENT_MODE: transferFormData.PAYMENT_MODE,
//         PAYMENT_DETAILS: transferFormData.PAYMENT_DETAILS || null,
//         PAYMENT_DATE: transferFormData.PAYMENT_DATE || null,
//         Remark: transferFormData.Remark || null,
//       }).unwrap();

//       alert(`Bank transfer submitted successfully! ${result.message || ''}`);

//       // Reset Transfer Form
//       setTransferFormData({
//         Transfer_A_C_Name: '',
//         Transfer_Received_A_C_Name: '',
//         Amount: '',
//         PAYMENT_MODE: '',
//         PAYMENT_DETAILS: '',
//         PAYMENT_DATE: '',
//         Remark: '',
//       });
//     } catch (err) {
//       console.error('Transfer error:', err);
//       alert(err?.data?.message || 'Failed to submit bank transfer. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

//           {/* Header */}
//           <div className="bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg px-8 py-6">
//             <h2 className="text-3xl font-bold text-white text-center">Payment Management</h2>
//             <p className="text-blue-100 text-center mt-2">Receive client payment or transfer between bank accounts</p>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setActiveTab('client-in')}
//               className={`flex-1 py-4 text-center font-semibold text-lg transition-all ${
//                 activeTab === 'client-in'
//                   ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50'
//                   : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
//               }`}
//             >
//               Client In
//             </button>
//             <button
//               onClick={() => setActiveTab('transfer')}
//               className={`flex-1 py-4 text-center font-semibold text-lg transition-all ${
//                 activeTab === 'transfer'
//                   ? 'text-purple-600 border-b-4 border-purple-600 bg-purple-50'
//                   : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
//               }`}
//             >
//               Transfer
//             </button>
//           </div>

//           <div className="p-8 space-y-6">

//             {/* ====================== CLIENT IN FORM ====================== */}
//             {activeTab === 'client-in' && (
//               <>
//                 {/* Site Name / Project */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     Site Name / Project <span className="text-red-500">*</span>
//                   </label>
//                   {isDropdownLoading ? (
//                     <p className="text-gray-500 italic">Loading projects...</p>
//                   ) : projects.length === 0 ? (
//                     <p className="text-orange-600">No projects available</p>
//                   ) : (
//                     <select name="SiteName" value={clientFormData.SiteName} onChange={handleClientChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
//                       <option value="">-- Select Project --</option>
//                       {projects.map((project, i) => <option key={i} value={project}>{project}</option>)}
//                     </select>
//                   )}
//                 </div>

//                 {/* Amount & Payment Mode */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Amount <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
//                       <input type="number" name="Amount" value={clientFormData.Amount} onChange={handleClientChange} min="1" step="0.01"
//                         className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//                         placeholder="0.00" />
//                     </div>
//                   </div>
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Payment Mode</label>
//                     <select name="PaymentMode" value={clientFormData.PaymentMode} onChange={handleClientChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
//                       <option value="">---- Select ----</option>
//                       <option value="Cash">Cash</option>
//                       <option value="Cheque">Cheque</option>
//                       <option value="NEFT">NEFT</option>
//                       <option value="RTGS">RTGS</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Apply GST */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Apply GST</label>
//                   <select name="GST" value={clientFormData.GST} onChange={handleClientChange}
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
//                     <option value="">No GST</option>
//                     <option value="18">GST @ 18%</option>
//                   </select>
//                 </div>

//                 {/* CGST & SGST */}
//                 {clientFormData.GST === '18' && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-semibold text-gray-700">CGST (9%)</label>
//                       <input type="text" value={clientFormData.CGST ? `₹ ${Number(clientFormData.CGST).toLocaleString('en-IN')}` : ''}
//                         readOnly className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium" />
//                     </div>
//                     <div className="space-y-2">
//                       <label className="block text-sm font-semibold text-gray-700">SGST (9%)</label>
//                       <input type="text" value={clientFormData.SGST ? `₹ ${Number(clientFormData.SGST).toLocaleString('en-IN')}` : ''}
//                         readOnly className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-700 font-medium" />
//                     </div>
//                   </div>
//                 )}

//                 {/* Net Amount */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     Net Amount {clientFormData.GST === '18' ? '(Including GST)' : ''}
//                   </label>
//                   <div className="relative">
//                     <input type="text"
//                       value={clientFormData.NetAmount ? `₹ ${Number(clientFormData.NetAmount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
//                       readOnly className="w-full px-4 py-3 border-2 border-green-200 rounded-lg bg-green-50 text-green-700 font-bold text-lg" />
//                   </div>
//                 </div>

//                 {/* RCC Credit Account */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">
//                     RCC Credit Account Name <span className="text-red-500">*</span>
//                   </label>
//                   {isDropdownLoading ? <p className="text-gray-500 italic">Loading accounts...</p> : (
//                     <select name="RccCreditAccountName" value={clientFormData.RccCreditAccountName} onChange={handleClientChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 bg-white">
//                       <option value="">-- Select Account --</option>
//                       {accounts.map((acc, i) => <option key={i} value={acc}>{acc}</option>)}
//                     </select>
//                   )}
//                 </div>

//                 {/* Transaction Details */}
//                 {showClientTransactionFields && (
//                   <div className="space-y-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
//                     <h3 className="font-semibold text-blue-900 text-lg">
//                       {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Details' : 'Transaction Details'}
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-2">
//                         <label className="block text-sm font-semibold text-gray-700">
//                           {clientFormData.PaymentMode === 'Cheque' ? 'Cheque No' : 'Transaction No / UTR No'} <span className="text-red-500">*</span>
//                         </label>
//                         <input type="text" name="TransactionNo" value={clientFormData.TransactionNo} onChange={handleClientChange}
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="block text-sm font-semibold text-gray-700">
//                           {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Date' : 'Transaction Date'} <span className="text-red-500">*</span>
//                         </label>
//                         <input type="date" name="TransactionDate" value={clientFormData.TransactionDate} onChange={handleClientChange}
//                           className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" />
//                       </div>
//                     </div>

//                     {/* Cheque Photo */}
//                     {showChequePhoto && (
//                       <div className="space-y-4">
//                         <label className="block text-sm font-semibold text-gray-700">Cheque Photo <span className="text-gray-500 text-xs">(Optional)</span></label>
//                         {!clientFormData.ChequePhoto ? (
//                           <label className="flex flex-col items-center justify-center w-full h-64 border-4 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 bg-gray-50">
//                             <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
//                             </svg>
//                             <p className="text-gray-600 text-center px-4">Click to upload cheque photo<br /><span className="text-sm">(JPG, PNG)</span></p>
//                             <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
//                           </label>
//                         ) : (
//                           <div className="relative max-w-md mx-auto">
//                             <img src={clientFormData.ChequePhoto} alt="Cheque preview" className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-300 shadow-md" />
//                             <button onClick={removePhoto} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700">✕</button>
//                             <p className="text-center mt-2 text-sm text-green-700 font-medium">✓ Photo uploaded</p>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Client Submit Button */}
//                 <button onClick={handleClientSubmit} disabled={isSubmittingClient}
//                   className={`w-full py-4 mt-8 text-white font-bold rounded-lg text-lg transition-all transform ${
//                     isSubmittingClient ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02]'
//                   }`}>
//                   {isSubmittingClient ? (
//                     <span className="flex items-center justify-center gap-3">
//                       <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Saving Payment...
//                     </span>
//                   ) : '✓ Add Payment'}
//                 </button>

//                 {/* Client Success/Error */}
//                 {clientSuccess && (
//                   <div className="p-5 bg-green-50 border-2 border-green-200 rounded-lg text-center">
//                     <p className="text-green-800 font-bold text-lg">✓ Payment added successfully!</p>
//                     {clientData?.uid && <p className="mt-2 text-sm">UID: <span className="font-mono bg-green-100 px-3 py-1 rounded">{clientData.uid}</span></p>}
//                   </div>
//                 )}
//                 {clientError && (
//                   <div className="p-5 bg-red-50 border-2 border-red-200 rounded-lg text-center">
//                     <p className="text-red-800 font-bold">✗ {clientErr?.data?.message || 'Something went wrong.'}</p>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* ====================== TRANSFER FORM ====================== */}
//             {activeTab === 'transfer' && (
//               <>
//                 {/* From & To Account */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Transfer A/C Name (From) <span className="text-red-500">*</span></label>
//                     {isDropdownLoading ? <p className="text-gray-500 italic">Loading accounts...</p> : (
//                       <select name="Transfer_A_C_Name" value={transferFormData.Transfer_A_C_Name} onChange={handleTransferChange}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white">
//                         <option value="">-- Select Account --</option>
//                         {accounts.map((acc, i) => <option key={i} value={acc}>{acc}</option>)}
//                       </select>
//                     )}
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Transfer Received A/C Name (To) <span className="text-red-500">*</span></label>
//                     <select name="Transfer_Received_A_C_Name" value={transferFormData.Transfer_Received_A_C_Name} onChange={handleTransferChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white">
//                       <option value="">-- Select Account --</option>
//                       {accounts.map((acc, i) => <option key={i} value={acc}>{acc}</option>)}
//                     </select>
//                   </div>
//                 </div>

//                 {/* Amount & Payment Mode */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Amount <span className="text-red-500">*</span></label>
//                     <div className="relative">
//                       <span className="absolute left-4 top-3.5 text-gray-500 font-medium">₹</span>
//                       <input type="number" name="Amount" value={transferFormData.Amount} onChange={handleTransferChange} min="1" step="0.01"
//                         className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
//                         placeholder="0.00" />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="block text-sm font-semibold text-gray-700">Payment Mode <span className="text-red-500">*</span></label>
//                     <select name="PAYMENT_MODE" value={transferFormData.PAYMENT_MODE} onChange={handleTransferChange}
//                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white">
//                       <option value="">---- Select ----</option>
//                       {/* <option value="Cash">Cash</option> */}
//                       <option value="Cheque">Cheque</option>
//                       <option value="NEFT">NEFT</option>
//                       <option value="RTGS">RTGS</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Payment Details & Date (Conditional) */}
//                 {showTransferDetails && (
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="space-y-2">
//                       <label className="block text-sm font-semibold text-gray-700">
//                         Payment Details {transferFormData.PAYMENT_MODE === 'Cheque' ? '(Cheque No)' : '(UTR No)'} <span className="text-red-500">*</span>
//                       </label>
//                       <input type="text" name="PAYMENT_DETAILS" value={transferFormData.PAYMENT_DETAILS} onChange={handleTransferChange}
//                         placeholder={transferFormData.PAYMENT_MODE === 'Cheque' ? 'Enter cheque number' : 'Enter UTR number'}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
//                     </div>

//                     <div className="space-y-2">
//                       <label className="block text-sm font-semibold text-gray-700">Payment Date <span className="text-red-500">*</span></label>
//                       <input type="date" name="PAYMENT_DATE" value={transferFormData.PAYMENT_DATE} onChange={handleTransferChange}
//                         className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200" />
//                     </div>
//                   </div>
//                 )}

//                 {/* Remark */}
//                 <div className="space-y-2">
//                   <label className="block text-sm font-semibold text-gray-700">Remark (Optional)</label>
//                   <textarea name="Remark" value={transferFormData.Remark} onChange={handleTransferChange} rows="3"
//                     className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
//                     placeholder="Any additional notes..."></textarea>
//                 </div>

//                 {/* Transfer Submit Button */}
//                 <button onClick={handleTransferSubmit} disabled={isSubmittingTransfer}
//                   className={`w-full py-4 mt-8 text-white font-bold rounded-lg text-lg transition-all transform ${
//                     isSubmittingTransfer
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
//                   }`}>
//                   {isSubmittingTransfer ? (
//                     <span className="flex items-center justify-center gap-3">
//                       <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                       </svg>
//                       Submitting Transfer...
//                     </span>
//                   ) : '✓ Submit Transfer'}
//                 </button>

//                 {/* Transfer Success/Error */}
//                 {transferSuccess && (
//                   <div className="p-5 bg-green-50 border-2 border-green-200 rounded-lg text-center">
//                     <p className="text-green-800 font-bold text-lg">✓ Bank transfer submitted successfully!</p>
//                     {transferData?.message && <p className="mt-2 text-sm">{transferData.message}</p>}
//                   </div>
//                 )}
//                 {transferError && (
//                   <div className="p-5 bg-red-50 border-2 border-red-200 rounded-lg text-center">
//                     <p className="text-red-800 font-bold">✗ {transferErr?.data?.message || 'Failed to submit transfer.'}</p>
//                   </div>
//                 )}
//               </>
//             )}

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Form;





import React, { useState, useEffect } from 'react';
import { 
  useAddPaymentMutation, 
  useSubmitBankTransferMutation,
  useGetDropdownDataQuery 
} from '../../features/Payment/FormSlice';

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

  // Client In Form State
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

  // Transfer Form State
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
  const showTransferDetails = ['Cheque', 'NEFT', 'RTGS'].includes(transferFormData.PAYMENT_MODE);

  // GST Auto Calculation (Client In)
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

  // Client In Submit
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

      alert(`Payment added successfully! UID: ${result.uid || 'N/A'}`);

      setClientFormData({
        SiteName: '', Amount: '', GST: '', CGST: '', SGST: '', NetAmount: '',
        RccCreditAccountName: '', PaymentMode: '', TransactionNo: '', TransactionDate: '', ChequePhoto: null
      });
    } catch (err) {
      console.error('Client payment error:', err);
      alert(err?.data?.message || 'Failed to add payment. Please try again.');
    }
  };

  // Transfer Submit
  const handleTransferSubmit = async () => {
    if (!transferFormData.Transfer_A_C_Name) return alert('Please select From Account');
    if (!transferFormData.Transfer_Received_A_C_Name) return alert('Please select To Account');
    if (transferFormData.Transfer_A_C_Name === transferFormData.Transfer_Received_A_C_Name) 
      return alert('From and To accounts cannot be the same');
    if (!transferFormData.Amount || Number(transferFormData.Amount) <= 0) return alert('Valid Amount is required');
    if (!transferFormData.PAYMENT_MODE) return alert('Please select Payment Mode');
    if (showTransferDetails && (!transferFormData.PAYMENT_DETAILS.trim() || !transferFormData.PAYMENT_DATE.trim())) {
      return alert('Payment Details and Date are required for selected mode');
    }

    try {
      const result = await submitBankTransfer({
        Transfer_A_C_Name: transferFormData.Transfer_A_C_Name,
        Transfer_Received_A_C_Name: transferFormData.Transfer_Received_A_C_Name,
        Amount: Number(transferFormData.Amount),
        PAYMENT_MODE: transferFormData.PAYMENT_MODE,
        PAYMENT_DETAILS: transferFormData.PAYMENT_DETAILS || null,
        PAYMENT_DATE: transferFormData.PAYMENT_DATE || null,
        Remark: transferFormData.Remark || null,
      }).unwrap();

      alert(`Bank transfer submitted successfully! ${result.message || ''}`);

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
      console.error('Transfer error:', err);
      alert(err?.data?.message || 'Failed to submit bank transfer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-indigo-950 to-purple-950 relative overflow-hidden py-6 px-4 md:px-6 mt-10">

      {/* Background orbs & particles - same as Dashboard */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
      </div>

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

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 px-6 py-8 md:px-10 md:py-10 border-b border-indigo-700/40">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200 bg-clip-text text-transparent text-center">
              Payment Management
            </h2>
            <p className="text-indigo-300/80 text-center mt-2 text-lg">
              Receive client payment or transfer between bank accounts
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-indigo-700/40 bg-black/20">
            <button
              onClick={() => setActiveTab('client-in')}
              className={`flex-1 py-5 text-center font-semibold text-base md:text-lg transition-all ${
                activeTab === 'client-in'
                  ? 'bg-gradient-to-r from-emerald-900/60 to-teal-900/60 text-emerald-200 border-b-4 border-emerald-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Client In
            </button>
            <button
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-5 text-center font-semibold text-base md:text-lg transition-all ${
                activeTab === 'transfer'
                  ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 text-purple-200 border-b-4 border-purple-500'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Transfer
            </button>
          </div>

          <div className="p-6 md:p-10 space-y-8">

            {/* ====================== CLIENT IN FORM ====================== */}
            {activeTab === 'client-in' && (
              <div className="space-y-7">
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
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">-- Select Project --</option>
                      {projects.map((project, i) => (
                        <option key={i} value={project}>{project}</option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Amount + Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                      <input 
                        type="number" 
                        name="Amount" 
                        value={clientFormData.Amount} 
                        onChange={handleClientChange} 
                        min="1" 
                        step="0.01"
                        className="w-full pl-10 pr-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">CGST (9%)</label>
                      <div className="px-5 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg text-emerald-300 font-medium">
                        {clientFormData.CGST ? `₹ ${Number(clientFormData.CGST).toLocaleString('en-IN')}` : '—'}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">SGST (9%)</label>
                      <div className="px-5 py-3.5 bg-gray-800/50 border border-gray-700 rounded-lg text-emerald-300 font-medium">
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
                  <div className="px-5 py-4 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-700/40 rounded-lg text-emerald-300 font-bold text-xl">
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
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  <div className="space-y-6 p-6 bg-black/40 backdrop-blur-sm rounded-xl border border-indigo-700/40">
                    <h3 className="font-semibold text-indigo-300 text-xl">
                      {clientFormData.PaymentMode === 'Cheque' ? 'Cheque Details' : 'Transaction Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-200">
                          {clientFormData.PaymentMode === 'Cheque' ? 'Cheque No' : 'Transaction No / UTR No'} <span className="text-red-400">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="TransactionNo" 
                          value={clientFormData.TransactionNo} 
                          onChange={handleClientChange}
                          className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                          className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {showChequePhoto && (
                      <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-200">
                          Cheque Photo <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        {!clientFormData.ChequePhoto ? (
                          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-indigo-600/50 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-950/30 transition-colors bg-black/30">
                            <svg className="w-16 h-16 text-indigo-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-indigo-300 text-center px-6">Click to upload cheque photo</p>
                            <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                          </label>
                        ) : (
                          <div className="relative max-w-md mx-auto">
                            <img 
                              src={clientFormData.ChequePhoto} 
                              alt="Cheque preview" 
                              className="w-full max-h-80 object-contain rounded-xl border border-indigo-700/40 shadow-2xl" 
                            />
                            <button 
                              onClick={removePhoto} 
                              className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg transition"
                            >
                              ✕
                            </button>
                            <p className="text-center mt-3 text-sm text-emerald-400 font-medium">✓ Photo uploaded</p>
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
                  className={`w-full py-5 mt-6 text-white font-bold rounded-xl text-lg transition-all transform shadow-xl ${
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
                  <div className="p-6 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-center">
                    <p className="text-emerald-300 font-bold text-xl">✓ Payment added successfully!</p>
                    {clientData?.uid && (
                      <p className="mt-3 text-emerald-200">
                        UID: <span className="font-mono bg-emerald-950/70 px-4 py-1.5 rounded">{clientData.uid}</span>
                      </p>
                    )}
                  </div>
                )}
                {clientError && (
                  <div className="p-6 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                    <p className="text-red-300 font-bold">✗ {clientErr?.data?.message || 'Failed to add payment'}</p>
                  </div>
                )}
              </div>
            )}

            {/* ====================== TRANSFER FORM ====================== */}
            {activeTab === 'transfer' && (
              <div className="space-y-7">
                {/* From + To Account */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Transfer A/C Name (From) <span className="text-red-400">*</span>
                    </label>
                    {isDropdownLoading ? (
                      <div className="text-indigo-300 italic">Loading accounts...</div>
                    ) : (
                      <select 
                        name="Transfer_A_C_Name" 
                        value={transferFormData.Transfer_A_C_Name} 
                        onChange={handleTransferChange}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      value={transferFormData.Transfer_Received_A_C_Name} 
                      onChange={handleTransferChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">-- Select Account --</option>
                      {accounts.map((acc, i) => (
                        <option key={i} value={acc}>{acc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Amount + Payment Mode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-200">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">₹</span>
                      <input 
                        type="number" 
                        name="Amount" 
                        value={transferFormData.Amount} 
                        onChange={handleTransferChange} 
                        min="1" 
                        step="0.01"
                        className="w-full pl-10 pr-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                      value={transferFormData.PAYMENT_MODE} 
                      onChange={handleTransferChange}
                      className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">---- Select ----</option>
                      <option value="Cheque">Cheque</option>
                      <option value="NEFT">NEFT</option>
                      <option value="RTGS">RTGS</option>
                    </select>
                  </div>
                </div>

                {/* Payment Details + Date */}
                {showTransferDetails && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        Payment Details 
                        {transferFormData.PAYMENT_MODE === 'Cheque' ? '(Cheque No)' : '(UTR No)'} 
                        <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="PAYMENT_DETAILS" 
                        value={transferFormData.PAYMENT_DETAILS} 
                        onChange={handleTransferChange}
                        placeholder={transferFormData.PAYMENT_MODE === 'Cheque' ? 'Enter cheque number' : 'Enter UTR number'}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-200">
                        Payment Date <span className="text-red-400">*</span>
                      </label>
                      <input 
                        type="date" 
                        name="PAYMENT_DATE" 
                        value={transferFormData.PAYMENT_DATE} 
                        onChange={handleTransferChange}
                        className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}

                {/* Remark */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-200">Remark (Optional)</label>
                  <textarea 
                    name="Remark" 
                    value={transferFormData.Remark} 
                    onChange={handleTransferChange} 
                    rows="3"
                    className="w-full px-5 py-3.5 bg-gray-900/70 border border-indigo-600/50 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y min-h-[100px]"
                    placeholder="Any additional notes..."
                  />
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleTransferSubmit} 
                  disabled={isSubmittingTransfer}
                  className={`w-full py-5 mt-6 text-white font-bold rounded-xl text-lg transition-all transform shadow-xl ${
                    isSubmittingTransfer 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:shadow-2xl hover:scale-[1.02]'
                  }`}
                >
                  {isSubmittingTransfer ? (
                    <span className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting Transfer...
                    </span>
                  ) : '✓ Submit Transfer'}
                </button>

                {/* Feedback */}
                {transferSuccess && (
                  <div className="p-6 bg-emerald-900/40 border border-emerald-700/50 rounded-xl text-center">
                    <p className="text-emerald-300 font-bold text-xl">✓ Bank transfer submitted successfully!</p>
                    {transferData?.message && (
                      <p className="mt-3 text-emerald-200">{transferData.message}</p>
                    )}
                  </div>
                )}
                {transferError && (
                  <div className="p-6 bg-red-900/40 border border-red-700/50 rounded-xl text-center">
                    <p className="text-red-300 font-bold">✗ {transferErr?.data?.message || 'Failed to submit transfer'}</p>
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