
// import React, { useState, useMemo, useEffect } from 'react';
// import {
//   useGetPendingDimExpensesQuery,
//   useUpdateDimExpenseEntryMutation,
// } from '../../features/RCC_Office_Expenses/BillEntry';

// import { RefreshCw, Search, X, FileText } from 'lucide-react';

// export default function BillEntry() {
//   const { data: apiResponse, isLoading, isError, refetch } = useGetPendingDimExpensesQuery();
//   const [updateEntry, { isLoading: isSubmitting }] = useUpdateDimExpenseEntryMutation();
//   console.log(apiResponse);

//   const [selectedBillId, setSelectedBillId] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   // ✅ Form states - सब empty string रखो, 0 नहीं
//   const [status, setStatus] = useState('');
//   const [vendorName, setVendorName] = useState('');
//   const [billNo, setBillNo] = useState('');
//   const [billDate, setBillDate] = useState('');
//   const [items, setItems] = useState([]);
//   const [transportWOGST, setTransportWOGST] = useState('');      // ← empty
//   const [transportGSTPercent, setTransportGSTPercent] = useState('');  // ← empty
//   const [adjustment, setAdjustment] = useState('');               // ← empty
//   const [remark, setRemark] = useState('');

//   // ─── Data Preparation ────────────────────────────────────────
//   const rawData = useMemo(() => apiResponse?.data || [], [apiResponse]);

//   const parsedItems = useMemo(() => {
//     return rawData.map(item => ({
//       offBillUID: item.OFFBILLUID?.trim() || '',
//       itemUid: item.uid?.trim() || '',
//       office: item.OFFICE_NAME_1?.trim() || '',
//       payee: item.PAYEE_NAME_1?.trim() || '',
//       itemName: item.ITEM_NAME_1?.trim() || '',
//       plannedAmount: Number(item.Amount?.replace(/,/g, '')),
//       photo: item.Bill_Photo?.trim() || 'No file uploaded',
//     })).filter(i => i.offBillUID && i.itemUid);
//   }, [rawData]);

//   const billGroups = useMemo(() => {
//     const groups = {};
//     parsedItems.forEach(item => {
//       const key = item.offBillUID;
//       if (!groups[key]) groups[key] = [];
//       groups[key].push(item);
//     });
//     return groups;
//   }, [parsedItems]);

//   const filteredBills = useMemo(() => {
//     let bills = Object.keys(billGroups).map(id => ({
//       id,
//       label: `${id} • ${billGroups[id].length} items • ₹${billGroups[id].reduce((s, i) => s + i.plannedAmount, 0).toLocaleString('en-IN')}`,
//       total: billGroups[id].reduce((s, i) => s + i.plannedAmount, 0),
//     })).sort((a, b) => a.id.localeCompare(b.id));

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       bills = bills.filter(b => b.id.toLowerCase().includes(term));
//     }
//     return bills;
//   }, [billGroups, searchTerm]);

//   const currentGroup = billGroups[selectedBillId] || [];

//   // ✅ When bill selected → init form - amount EMPTY रखो
//   useEffect(() => {
//     if (!selectedBillId || !currentGroup.length) return;

//     const first = currentGroup[0];
//     setVendorName(first.payee || '');
//     setItems(currentGroup.map(it => ({
//       itemUid: it.itemUid,
//       itemName: it.itemName,
//       amount: '',               // ← EMPTY not 0
//       gstType: 'CGST+SGST',
//       gstPercent: 0,
//       cgstAmt: 0,
//       sgstAmt: 0,
//       igstAmt: 0,
//       rowTotal: 0,
//     })));

//     setStatus('');
//     setBillNo('');
//     setBillDate('');
//     setTransportWOGST('');       // ← EMPTY not 0
//     setTransportGSTPercent('');  // ← EMPTY not 0
//     setAdjustment('');           // ← EMPTY not 0
//     setRemark('');
//   }, [selectedBillId]);

//   // ✅ Live GST calculation - empty को 0 मानो
//   useEffect(() => {
//     setItems(prev => prev.map(item => {
//       const base = Number(item.amount) || 0;
//       const rate = (Number(item.gstPercent) || 0) / 100;
//       let cgstAmt = 0, sgstAmt = 0, igstAmt = 0;

//       if (item.gstType === 'CGST+SGST') {
//         cgstAmt = base * rate / 2;
//         sgstAmt = base * rate / 2;
//       } else if (item.gstType === 'IGST') {
//         igstAmt = base * rate;
//       }

//       const rowTotal = base + cgstAmt + sgstAmt + igstAmt;
//       return { ...item, cgstAmt, sgstAmt, igstAmt, rowTotal };
//     }));
//   }, [items.map(i => `${i.amount}|${i.gstType}|${i.gstPercent}`).join(';')]);

//   // ✅ Totals - safe Number conversion
//   const itemsTotal = items.reduce((sum, i) => sum + (i.rowTotal || 0), 0);
//   const transportGSTAmt = (Number(transportWOGST) || 0) * ((Number(transportGSTPercent) || 0) / 100);
//   const grandTotal = itemsTotal + (Number(transportWOGST) || 0) + transportGSTAmt + (Number(adjustment) || 0);

//   // ✅ Submit
//  const handleSubmit = async () => {
//   if (!billNo.trim() || !billDate || !status) {
//     alert('Status, Bill No. और Bill Date अनिवार्य हैं');
//     return;
//   }

//   try {
//     const tWOGST = Number(transportWOGST) || 0;
//     const tGSTAmt = tWOGST * ((Number(transportGSTPercent) || 0) / 100);
//     const adj = Number(adjustment) || 0;
//     const totalRow = items.reduce((sum, i) => sum + (i.rowTotal || 0), 0);
//     const netAmount = totalRow + tWOGST + tGSTAmt + adj;

//     // ✅ हर item का अपना data अलग भेजो
//     const itemsPayload = items.map((item) => ({
//       itemUid: item.itemUid,                              // ← C column uid
//       BASIC_AMOUNT_4: (Number(item.amount) || 0).toFixed(2),
//       CGST_4: (item.cgstAmt || 0).toFixed(2),
//       SGST_4: (item.sgstAmt || 0).toFixed(2),
//       IGST_4: (item.igstAmt || 0).toFixed(2),
//       TOTAL_AMOUNT_4: (item.rowTotal || 0).toFixed(2),
//     }));

//     const payload = {
//       uid: selectedBillId,                               // ← OFFBILLUID
//       STATUS_4: status,
//       Vendor_Name_4: vendorName.trim(),
//       BILL_NO_4: billNo.trim(),
//       BILL_DATE_4: billDate,
//       TRASNPORT_CHARGES_4: tWOGST.toFixed(2),
//       Transport_Gst_4: tGSTAmt.toFixed(2),
//       NET_AMOUNT_4: netAmount.toFixed(2),
//       Remark_4: remark.trim(),
//       items: itemsPayload,                               // ← items array
//     };

//     console.log('Submitting payload:', payload);

//     await updateEntry(payload).unwrap();

//     alert(`Bill ${selectedBillId} सफलतापूर्वक अपडेट हो गया (${items.length} items)`);
//     setSelectedBillId('');
//     refetch();
//   } catch (err) {
//     console.error("Update error:", err);
//     const msg = err?.data?.message || err?.message || "कुछ गलत हुआ";
//     alert(`Update failed: ${msg}`);
//   }
// };


//   // ─── UI ──────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="inline-block mb-4">
//             <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
//           </div>
//           <p className="text-slate-600 font-medium">Loading final approvals...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
//       <div className="max-w-7xl mx-auto space-y-6">

//         <div className="flex justify-between">
//           <h1 className="text-3xl font-bold text-indigo-900">Bill Entry</h1>
//           <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm">
//             <RefreshCw size={16} /> Refresh
//           </button>
//         </div>

//         <div className="bg-white p-6 rounded-xl border shadow-sm">
//           <label className="font-medium block mb-2">Select Bill (OFFBILLUID)</label>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               value={searchTerm}
//               onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
//               onFocus={() => setIsDropdownOpen(true)}
//               placeholder="Search bill..."
//               className="w-full pl-10 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
//             />
//             {isDropdownOpen && filteredBills.length > 0 && (
//               <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
//                 {filteredBills.map(bill => (
//                   <div
//                     key={bill.id}
//                     className="p-3 hover:bg-indigo-50 cursor-pointer"
//                     onClick={() => {
//                       setSelectedBillId(bill.id);
//                       setSearchTerm('');
//                       setIsDropdownOpen(false);
//                     }}
//                   >
//                     {bill.label}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {selectedBillId && currentGroup.length > 0 && (
//           <div className="bg-white rounded-xl border shadow-lg overflow-hidden">
//             <div className="p-5 bg-indigo-50 flex justify-between items-center border-b">
//               <h2 className="text-xl font-bold">Bill Entry – {selectedBillId}</h2>
//               <button onClick={() => setSelectedBillId('')} className="text-gray-600 hover:text-red-600">
//                 <X size={24} />
//               </button>
//             </div>

//             <div className="p-6 space-y-8">
//               <div className="grid md:grid-cols-4 gap-5">
//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Status *</label>
//                   <select value={status} onChange={e => setStatus(e.target.value)} className="w-full p-2.5 border rounded-lg">
//                     <option value="">-- Select --</option>
//                     <option value="Done">Done</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Vendor / Payee *</label>
//                   <input value={vendorName} onChange={e => setVendorName(e.target.value)} className="w-full p-2.5 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Bill No. *</label>
//                   <input value={billNo} onChange={e => setBillNo(e.target.value)} className="w-full p-2.5 border rounded-lg" />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1.5">Bill Date *</label>
//                   <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} className="w-full p-2.5 border rounded-lg" />
//                 </div>
//               </div>

//               {/* ✅ Items Table - amount empty दिखेगा */}
//               <div>
//                 <h3 className="font-semibold mb-3">Item Details</h3>
//                 <div className="overflow-x-auto border rounded-lg">
//                   <table className="w-full text-sm min-w-[900px]">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="p-3 text-left">UID</th>
//                         <th className="p-3 text-left">Item</th>
//                         <th className="p-3 text-right">Amt</th>
//                         <th className="p-3">GST Type</th>
//                         <th className="p-3">GST %</th>
//                         <th className="p-3 text-right">CGST</th>
//                         <th className="p-3 text-right">SGST</th>
//                         <th className="p-3 text-right">IGST</th>
//                         <th className="p-3 text-right">Row Total</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {items.map((item, i) => (
//                         <tr key={item.itemUid} className="border-t">
//                           <td className="p-3">{item.itemUid}</td>
//                           <td className="p-3">{item.itemName}</td>
//                           <td className="p-3">
//                             {/* ✅ value empty string accept करेगा */}
//                             <input
//                               type="number"
//                               value={item.amount}
//                               placeholder="Enter amt"
//                               onChange={e => {
//                                 const newItems = [...items];
//                                 newItems[i] = { ...newItems[i], amount: e.target.value };
//                                 setItems(newItems);
//                               }}
//                               className="w-24 p-1.5 border rounded text-right"
//                             />
//                           </td>
//                           <td className="p-3">
//                             <select
//                               value={item.gstType}
//                               onChange={e => {
//                                 const newItems = [...items];
//                                 newItems[i] = { ...newItems[i], gstType: e.target.value };
//                                 setItems(newItems);
//                               }}
//                               className="w-full p-1.5 border rounded"
//                             >
//                               <option>CGST+SGST</option>
//                               <option>IGST</option>
//                               <option>No GST</option>
//                             </select>
//                           </td>
//                           <td className="p-3">
//                             <select
//                               value={item.gstPercent}
//                               onChange={e => {
//                                 const newItems = [...items];
//                                 newItems[i] = { ...newItems[i], gstPercent: Number(e.target.value) };
//                                 setItems(newItems);
//                               }}
//                               className="w-full p-1.5 border rounded"
//                             >
//                               <option value={0}>0%</option>
//                               <option value={5}>5%</option>
//                               <option value={12}>12%</option>
//                               <option value={18}>18%</option>
//                               <option value={28}>28%</option>
//                             </select>
//                           </td>
//                           <td className="p-3 text-right">{item.cgstAmt.toFixed(2)}</td>
//                           <td className="p-3 text-right">{item.sgstAmt.toFixed(2)}</td>
//                           <td className="p-3 text-right">{item.igstAmt.toFixed(2)}</td>
//                           <td className="p-3 text-right font-medium">{item.rowTotal.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <div className="mt-3 text-right font-semibold">
//                   Items Total: ₹{itemsTotal.toFixed(2)}
//                 </div>
//               </div>

//               {/* ✅ Transport - empty दिखेगा */}
//               <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl">
//                 <div>
//                   <label className="block text-sm mb-1.5">Transport (w/o GST)</label>
//                   <input
//                     type="number"
//                     value={transportWOGST}
//                     placeholder="Enter transport charges"
//                     onChange={e => setTransportWOGST(e.target.value)}
//                     className="w-full p-2.5 border rounded-lg"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1.5">GST on Transport %</label>
//                   <select
//                     value={transportGSTPercent}
//                     onChange={e => setTransportGSTPercent(e.target.value)}
//                     className="w-full p-2.5 border rounded-lg"
//                   >
//                     <option value="">-- Select --</option>
//                     <option value={0}>0%</option>
//                     <option value={5}>5%</option>
//                     <option value={12}>12%</option>
//                     <option value={18}>18%</option>
//                     <option value={28}>28%</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm mb-1.5">Grand Total</label>
//                   <div className="p-3 bg-indigo-100 text-indigo-900 font-bold rounded-lg text-lg">
//                     ₹{grandTotal.toFixed(2)}
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1.5">Remark</label>
//                 <textarea value={remark} onChange={e => setRemark(e.target.value)} rows={3} className="w-full p-3 border rounded-lg" placeholder="Optional..." />
//               </div>

//               <div className="flex justify-end gap-4">
//                 <button onClick={() => setSelectedBillId('')} className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleSubmit}
//                   disabled={isSubmitting || !billNo || !billDate || !status}
//                   className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2"
//                 >
//                   {isSubmitting ? 'Saving...' : <><FileText size={18} /> Submit Bill</>}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useState, useMemo, useEffect } from 'react';
import {
  useGetPendingDimExpensesQuery,
  useUpdateDimExpenseEntryMutation,
} from '../../features/RCC_Office_Expenses/BillEntry';

import { RefreshCw, Search, X, FileText } from 'lucide-react';

export default function BillEntry() {
  const { data: apiResponse, isLoading, isError, refetch } = useGetPendingDimExpensesQuery();
  const [updateEntry, { isLoading: isSubmitting }] = useUpdateDimExpenseEntryMutation();

  const [selectedBillId, setSelectedBillId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [status, setStatus] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [billNo, setBillNo] = useState('');
  const [billDate, setBillDate] = useState('');
  const [items, setItems] = useState([]);
  const [transportWOGST, setTransportWOGST] = useState('');
  const [transportGSTPercent, setTransportGSTPercent] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [remark, setRemark] = useState('');

  // ─── Data ────────────────────────────────────────
  const rawData = useMemo(() => {
    if (!apiResponse) return [];
    // handle both apiResponse.data and direct array
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse.data)) return apiResponse.data;
    return [];
  }, [apiResponse]);

  // ✅ Debug - dekho data kya aa raha hai
  useEffect(() => {
    if (rawData.length > 0) {
      console.log('=== RAW DATA SAMPLE ===');
      console.log('First item:', rawData[0]);
      console.log('All keys:', Object.keys(rawData[0]));
      console.log('Total items:', rawData.length);
    }
  }, [rawData]);

  const parsedItems = useMemo(() => {
    return rawData.map((item, index) => {
      const offBillUID = (item.OFFBILLUID || item.offBillUID || item.offbilluid || '').toString().trim();
      const uid = (item.uid || item.UID || item.itemUid || '').toString().trim();
      const itemName = (item.ITEM_NAME_1 || item.itemName || item.item_name || '').toString().trim();
      const payee = (item.PAYEE_NAME_1 || item.payeeName || item.payee_name || '').toString().trim();
      const office = (item.OFFICE_NAME_1 || item.officeName || item.office_name || '').toString().trim();

      // Amount - try multiple keys
      let amt = item.Amount || item.amount || item.AMOUNT || item.planned_amount || 0;
      if (typeof amt === 'string') amt = amt.replace(/,/g, '');
      amt = Number(amt) || 0;

      return {
        offBillUID,
        itemUid: uid,
        office,
        payee,
        itemName: itemName || `Item ${index + 1}`,
        plannedAmount: amt,
        photo: (item.Bill_Photo || item.bill_photo || '').toString().trim() || 'No file',
      };
    }).filter(i => i.offBillUID);
  }, [rawData]);

  const billGroups = useMemo(() => {
    const groups = {};
    parsedItems.forEach(item => {
      const key = item.offBillUID;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [parsedItems]);

  const filteredBills = useMemo(() => {
    let bills = Object.keys(billGroups).map(id => ({
      id,
      itemCount: billGroups[id].length,
      items: billGroups[id],
    })).sort((a, b) => a.id.localeCompare(b.id));

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      bills = bills.filter(b => b.id.toLowerCase().includes(term));
    }
    return bills;
  }, [billGroups, searchTerm]);

  const currentGroup = billGroups[selectedBillId] || [];

  // ✅ Bill select hone par items set karo
  useEffect(() => {
    if (!selectedBillId || !currentGroup.length) return;

    const first = currentGroup[0];
    setVendorName(first.payee || '');

    setItems(currentGroup.map(it => ({
      itemUid: it.itemUid,
      itemName: it.itemName,
      amount: '',
      gstType: 'CGST+SGST',
      gstPercent: 0,
      cgstAmt: 0,
      sgstAmt: 0,
      igstAmt: 0,
      rowTotal: 0,
    })));

    setStatus('');
    setBillNo('');
    setBillDate('');
    setTransportWOGST('');
    setTransportGSTPercent('');
    setAdjustment('');
    setRemark('');
  }, [selectedBillId]);

  // GST calc
  useEffect(() => {
    setItems(prev => prev.map(item => {
      const base = Number(item.amount) || 0;
      const rate = (Number(item.gstPercent) || 0) / 100;
      let cgstAmt = 0, sgstAmt = 0, igstAmt = 0;
      if (item.gstType === 'CGST+SGST') {
        cgstAmt = base * rate / 2;
        sgstAmt = base * rate / 2;
      } else if (item.gstType === 'IGST') {
        igstAmt = base * rate;
      }
      const rowTotal = base + cgstAmt + sgstAmt + igstAmt;
      return { ...item, cgstAmt, sgstAmt, igstAmt, rowTotal };
    }));
  }, [items.map(i => `${i.amount}|${i.gstType}|${i.gstPercent}`).join(';')]);

  const itemsTotal = items.reduce((sum, i) => sum + (i.rowTotal || 0), 0);
  const transportGSTAmt = (Number(transportWOGST) || 0) * ((Number(transportGSTPercent) || 0) / 100);
  const grandTotal = itemsTotal + (Number(transportWOGST) || 0) + transportGSTAmt + (Number(adjustment) || 0);

  // Submit
  const handleSubmit = async () => {
    if (!billNo.trim() || !billDate || !status) {
      alert('Status, Bill No. और Bill Date भरें');
      return;
    }
    try {
      const tWOGST = Number(transportWOGST) || 0;
      const tGSTAmt = tWOGST * ((Number(transportGSTPercent) || 0) / 100);
      const adj = Number(adjustment) || 0;
      const netAmount = itemsTotal + tWOGST + tGSTAmt + adj;

      const itemsPayload = items.map(item => ({
        itemUid: item.itemUid,
        BASIC_AMOUNT_4: (Number(item.amount) || 0).toFixed(2),
        CGST_4: (item.cgstAmt || 0).toFixed(2),
        SGST_4: (item.sgstAmt || 0).toFixed(2),
        IGST_4: (item.igstAmt || 0).toFixed(2),
        TOTAL_AMOUNT_4: (item.rowTotal || 0).toFixed(2),
      }));

      const payload = {
        uid: selectedBillId,
        STATUS_4: status,
        Vendor_Name_4: vendorName.trim(),
        BILL_NO_4: billNo.trim(),
        BILL_DATE_4: billDate,
        TRASNPORT_CHARGES_4: tWOGST.toFixed(2),
        Transport_Gst_4: tGSTAmt.toFixed(2),
        NET_AMOUNT_4: netAmount.toFixed(2),
        Remark_4: remark.trim(),
        items: itemsPayload,
      };

      await updateEntry(payload).unwrap();
      alert(`Bill ${selectedBillId} updated!`);
      setSelectedBillId('');
      refetch();
    } catch (err) {
      alert(`Error: ${err?.data?.message || err?.message || 'Something went wrong'}`);
    }
  };

  // ─── Loading / Error ─────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-3">Data load failed</p>
          <button onClick={refetch} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main UI ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Bill Entry</h1>
            <p className="text-sm text-gray-500 mt-1">
              {parsedItems.length} items in {Object.keys(billGroups).length} bills
            </p>
          </div>
          <button onClick={refetch} className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        {/* Bill Selector */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <label className="font-medium block mb-2">Select Bill</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search bill ID..."
              className="w-full pl-10 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {selectedBillId && (
              <div className="mt-2 inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium">
                Selected: {selectedBillId} ({currentGroup.length} items)
                <button onClick={() => setSelectedBillId('')}><X size={14} /></button>
              </div>
            )}

            {isDropdownOpen && filteredBills.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                  {filteredBills.map(bill => (
                    <div
                      key={bill.id}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0"
                      onClick={() => {
                        setSelectedBillId(bill.id);
                        setSearchTerm('');
                        setIsDropdownOpen(false);
                      }}
                    >
                      <span className="font-medium">{bill.id}</span>
                      <span className="text-gray-500 ml-2">• {bill.itemCount} items</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {isDropdownOpen && filteredBills.length === 0 && searchTerm && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-gray-500 z-50">
                No bills found for "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* ── Bill Form ── */}
        {selectedBillId && currentGroup.length > 0 && (
          <div className="bg-white rounded-xl border shadow-lg overflow-hidden">

            <div className="p-5 bg-indigo-50 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold text-indigo-900">
                {selectedBillId} — {currentGroup.length} items
              </h2>
              <button onClick={() => setSelectedBillId('')}>
                <X size={24} className="text-gray-500 hover:text-red-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">

              {/* Basic Info */}
              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status *</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none">
                    <option value="">-- Select --</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Vendor *</label>
                  <input value={vendorName} onChange={e => setVendorName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Bill No. *</label>
                  <input value={billNo} onChange={e => setBillNo(e.target.value)}
                    placeholder="INV-001"
                    className="w-full p-2.5 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Bill Date *</label>
                  <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none" />
                </div>
              </div>

              {/* ✅ Items - Simple Table */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Items in this Bill</h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Item UID</th>
                        <th className="p-3 text-left">Item Name</th>
                        <th className="p-3 text-right">Bill Amount</th>
                        <th className="p-3">GST Type</th>
                        <th className="p-3">GST %</th>
                        <th className="p-3 text-right">CGST</th>
                        <th className="p-3 text-right">SGST</th>
                        <th className="p-3 text-right">IGST</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{i + 1}</td>
                          <td className="p-3 text-xs text-gray-500">{item.itemUid || '-'}</td>
                          <td className="p-3 font-medium">{item.itemName}</td>
                          <td className="p-3">
                            <input
                              type="number"
                              value={item.amount}
                              placeholder="Enter"
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], amount: e.target.value };
                                setItems(newItems);
                              }}
                              className="w-28 p-1.5 border rounded text-right outline-none"
                            />
                          </td>
                          <td className="p-3">
                            <select value={item.gstType}
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], gstType: e.target.value };
                                setItems(newItems);
                              }}
                              className="p-1.5 border rounded outline-none">
                              <option value="CGST+SGST">CGST+SGST</option>
                              <option value="IGST">IGST</option>
                              <option value="No GST">No GST</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select value={item.gstPercent}
                              disabled={item.gstType === 'No GST'}
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], gstPercent: Number(e.target.value) };
                                setItems(newItems);
                              }}
                              className="p-1.5 border rounded outline-none disabled:bg-gray-100">
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={12}>12%</option>
                              <option value={18}>18%</option>
                              <option value={28}>28%</option>
                            </select>
                          </td>
                          <td className="p-3 text-right">{item.cgstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right">{item.sgstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right">{item.igstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right font-semibold text-green-700">
                            ₹{item.rowTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-right font-semibold">
                  Items Total: <span className="text-indigo-700">₹{itemsTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Transport */}
              <div className="grid md:grid-cols-4 gap-5 bg-gray-50 p-5 rounded-xl">
                <div>
                  <label className="block text-sm mb-1.5">Transport (w/o GST)</label>
                  <input type="number" value={transportWOGST} placeholder="0"
                    onChange={e => setTransportWOGST(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Transport GST %</label>
                  <select value={transportGSTPercent} onChange={e => setTransportGSTPercent(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none">
                    <option value="">-- Select --</option>
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Transport GST Amt</label>
                  <div className="p-2.5 bg-white border rounded-lg">₹{transportGSTAmt.toFixed(2)}</div>
                </div>
                <div>
                  <label className="block text-sm mb-1.5">Grand Total</label>
                  <div className="p-3 bg-indigo-600 text-white font-bold rounded-lg text-lg text-center">
                    ₹{grandTotal.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Remark</label>
                <textarea value={remark} onChange={e => setRemark(e.target.value)}
                  rows={2} placeholder="Optional..."
                  className="w-full p-3 border rounded-lg outline-none resize-none" />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t">
                <button onClick={() => setSelectedBillId('')}
                  className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300">
                  Cancel
                </button>
                <button onClick={handleSubmit}
                  disabled={isSubmitting || !billNo || !billDate || !status}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center gap-2">
                  {isSubmitting ? 'Saving...' : <><FileText size={18} /> Submit Bill</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}