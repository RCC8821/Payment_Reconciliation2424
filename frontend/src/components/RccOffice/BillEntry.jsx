
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
    if (Array.isArray(apiResponse)) return apiResponse;
    if (Array.isArray(apiResponse.data)) return apiResponse.data;
    return [];
  }, [apiResponse]);

  // Debug - Check what data is coming from API
  useEffect(() => {
    if (rawData.length > 0) {
      console.log('=== RAW DATA SAMPLE ===');
      console.log('First item:', rawData[0]);
      console.log('All keys:', Object.keys(rawData[0]));
      console.log('EXPENSES_SUBHEAD_1:', rawData[0].EXPENSES_SUBHEAD_1);
      console.log('Amount:', rawData[0].Amount);
    }
  }, [rawData]);

  const parsedItems = useMemo(() => {
    return rawData.map((item, index) => {
      const offBillUID = (item.OFFBILLUID || item.offBillUID || item.offbilluid || '').toString().trim();
      const uid = (item.uid || item.UID || item.itemUid || '').toString().trim();
      const itemName = (item.ITEM_NAME_1 || item.itemName || item.item_name || '').toString().trim();
      const expensesSubhead = (item.EXPENSES_SUBHEAD_1 || item.expensesSubhead || item.expenses_subhead || '').toString().trim();
      const payee = (item.PAYEE_NAME_1 || item.payeeName || item.payee_name || '').toString().trim();
      const office = (item.OFFICE_NAME_1 || item.officeName || item.office_name || '').toString().trim();

      // Get Amount from API
      let amt = item.Amount || item.amount || item.AMOUNT || 0;
      if (typeof amt === 'string') {
        amt = amt.replace(/,/g, '');
        amt = parseFloat(amt) || 0;
      }
      amt = Number(amt) || 0;

      console.log(`Item ${index + 1} - Subhead: ${expensesSubhead}, Amount: ${amt}`);

      return {
        offBillUID,
        itemUid: uid,
        office,
        payee,
        itemName: itemName || `Item ${index + 1}`,
        expensesSubhead: expensesSubhead || '-',
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

  // Bill select hone par items set karo
  useEffect(() => {
    if (!selectedBillId || !currentGroup.length) return;

    const first = currentGroup[0];
    setVendorName(first.payee || '');

    console.log('Setting items with data:', currentGroup.map(it => ({
      itemName: it.itemName,
      expensesSubhead: it.expensesSubhead,
      plannedAmount: it.plannedAmount
    })));

    setItems(currentGroup.map(it => ({
      itemUid: it.itemUid,
      itemName: it.itemName,
      expensesSubhead: it.expensesSubhead, // Add expenses subhead
      plannedAmount: it.plannedAmount,
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
  }, [selectedBillId, currentGroup]);

  // GST calculation
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

  const handleSubmit = async () => {
    if (!billNo.trim() || !billDate || !status) {
      alert('Please fill: Status, Bill No., and Bill Date');
      return;
    }

    const hasAmount = items.some(item => Number(item.amount) > 0);
    if (!hasAmount) {
      alert('Please enter amount for at least one item');
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

      console.log('Submitting payload:', payload);
      
      await updateEntry(payload).unwrap();
      alert(`✓ Bill ${selectedBillId} updated successfully!`);
      
      setSelectedBillId('');
      setSearchTerm('');
      setStatus('');
      setVendorName('');
      setBillNo('');
      setBillDate('');
      setItems([]);
      setTransportWOGST('');
      setTransportGSTPercent('');
      setAdjustment('');
      setRemark('');
      
      refetch();
    } catch (err) {
      console.error('Submit error:', err);
      alert(`Error: ${err?.data?.message || err?.message || 'Something went wrong'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-3">Failed to load data</p>
          <button 
            onClick={refetch} 
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Bill Entry</h1>
            <p className="text-sm text-gray-500 mt-1">
              {parsedItems.length} items in {Object.keys(billGroups).length} bills
            </p>
          </div>
          <button 
            onClick={refetch} 
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <label className="font-medium block mb-2 text-gray-700">Select Bill</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setIsDropdownOpen(true); }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search by Bill ID..."
              className="w-full pl-10 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {selectedBillId && (
              <div className="mt-2 inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-full text-sm font-medium">
                Selected: {selectedBillId} ({currentGroup.length} items)
                <button onClick={() => setSelectedBillId('')} className="hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            )}

            {isDropdownOpen && filteredBills.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-64 overflow-auto z-50">
                  {filteredBills.map(bill => (
                    <div
                      key={bill.id}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b last:border-0 transition-colors"
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

        {selectedBillId && currentGroup.length > 0 && (
          <div className="bg-white rounded-xl border shadow-lg overflow-hidden">

            <div className="p-5 bg-indigo-50 flex justify-between items-center border-b">
              <div>
                <h2 className="text-xl font-bold text-indigo-900">
                  Bill: {selectedBillId}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {currentGroup.length} item{currentGroup.length > 1 ? 's' : ''} to process
                </p>
              </div>
              <button 
                onClick={() => setSelectedBillId('')}
                className="p-2 hover:bg-indigo-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500 hover:text-red-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">

              <div className="grid md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={status} 
                    onChange={e => setStatus(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">-- Select Status --</option>
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Vendor <span className="text-red-500">*</span>
                  </label>
                  <input 
                    value={vendorName} 
                    onChange={e => setVendorName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Bill No. <span className="text-red-500">*</span>
                  </label>
                  <input 
                    value={billNo} 
                    onChange={e => setBillNo(e.target.value)}
                    placeholder="e.g., INV-001"
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5 text-gray-700">
                    Bill Date <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="date" 
                    value={billDate} 
                    onChange={e => setBillDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" 
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={18} />
                  Bill Items
                </h3>
                <div className="overflow-x-auto border rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">#</th>
                        <th className="p-3 text-left">Item UID</th>
                        <th className="p-3 text-left">Expenses Subhead</th>
                        <th className="p-3 text-left">Item Name</th>
                        <th className="p-3 text-right">Planned Amount (₹)</th>
                        <th className="p-3 text-right">Bill Amount (₹)</th>
                        <th className="p-3">GST Type</th>
                        <th className="p-3">GST %</th>
                        <th className="p-3 text-right">CGST</th>
                        <th className="p-3 text-right">SGST</th>
                        <th className="p-3 text-right">IGST</th>
                        <th className="p-3 text-right">Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50">
                          <td className="p-3 text-gray-400">{i + 1}</td>
                          <td className="p-3 text-xs text-gray-500">{item.itemUid || '-'}</td>
                          <td className="p-3 text-sm text-gray-600">{item.expensesSubhead || '-'}</td>
                          <td className="p-3 font-medium">{item.itemName}</td>
                          <td className="p-3 text-right">
                            <input
                              type="number"
                              value={item.plannedAmount || 0}
                              disabled
                              className="w-28 p-1.5 border rounded text-right bg-gray-100 text-gray-600 cursor-not-allowed"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              step="0.01"
                              value={item.amount}
                              placeholder="Enter bill amount"
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], amount: e.target.value };
                                setItems(newItems);
                              }}
                              className="w-28 p-1.5 border rounded text-right outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                          </td>
                          <td className="p-3">
                            <select 
                              value={item.gstType}
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], gstType: e.target.value, gstPercent: e.target.value === 'No GST' ? 0 : item.gstPercent };
                                setItems(newItems);
                              }}
                              className="p-1.5 border rounded outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                              <option value="CGST+SGST">CGST+SGST</option>
                              <option value="IGST">IGST</option>
                              <option value="No GST">No GST</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <select 
                              value={item.gstPercent}
                              disabled={item.gstType === 'No GST'}
                              onChange={e => {
                                const newItems = [...items];
                                newItems[i] = { ...newItems[i], gstPercent: Number(e.target.value) };
                                setItems(newItems);
                              }}
                              className="p-1.5 border rounded outline-none disabled:bg-gray-100 focus:ring-2 focus:ring-indigo-400"
                            >
                              <option value={0}>0%</option>
                              <option value={5}>5%</option>
                              <option value={12}>12%</option>
                              <option value={18}>18%</option>
                              <option value={28}>28%</option>
                            </select>
                          </td>
                          <td className="p-3 text-right text-green-600">₹{item.cgstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right text-green-600">₹{item.sgstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right text-blue-600">₹{item.igstAmt.toFixed(2)}</td>
                          <td className="p-3 text-right font-semibold text-indigo-700">
                            ₹{item.rowTotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-right">
                  <span className="font-semibold">Items Subtotal: </span>
                  <span className="text-indigo-700 font-bold text-lg">₹{itemsTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-5 bg-gray-50 p-5 rounded-xl">
                <div>
                  <label className="block text-sm mb-1.5 text-gray-700">Transport (Excluding GST)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={transportWOGST} 
                    placeholder="0.00"
                    onChange={e => setTransportWOGST(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-gray-700">Transport GST %</label>
                  <select 
                    value={transportGSTPercent} 
                    onChange={e => setTransportGSTPercent(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">-- Select --</option>
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-gray-700">Transport GST Amount</label>
                  <div className="p-2.5 bg-white border rounded-lg font-medium">
                    ₹{transportGSTAmt.toFixed(2)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1.5 text-gray-700">Adjustment</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={adjustment} 
                    placeholder="0.00"
                    onChange={e => setAdjustment(e.target.value)}
                    className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400" 
                  />
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-indigo-900">GRAND TOTAL:</span>
                  <span className="text-3xl font-bold text-indigo-700">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Remark (Optional)</label>
                <textarea 
                  value={remark} 
                  onChange={e => setRemark(e.target.value)}
                  rows={2} 
                  placeholder="Any additional notes..."
                  className="w-full p-3 border rounded-lg outline-none resize-none focus:ring-2 focus:ring-indigo-400" 
                />
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t">
                <button 
                  onClick={() => {
                    setSelectedBillId('');
                    setSearchTerm('');
                  }}
                  className="px-6 py-3 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !billNo || !billDate || !status}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FileText size={18} />
                      Submit Bill
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {!selectedBillId && Object.keys(billGroups).length > 0 && (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium text-gray-700">No Bill Selected</h3>
            <p className="text-gray-500 mt-1">Search and select a bill from the dropdown above</p>
          </div>
        )}

        {Object.keys(billGroups).length === 0 && !isLoading && (
          <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
            <p className="text-gray-500">No pending bills found</p>
            <button 
              onClick={refetch}
              className="mt-3 text-indigo-600 hover:text-indigo-700"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
}