
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  useGetGstDataQuery,
  useUpdateGstFollowupMutation,
} from '../../features/GST/GstSlice';
import { PencilIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';

// ─── Helpers ────────────────────────────────────────────────────────────────

const parseBillDateISO = (dateStr) => {
  if (!dateStr) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    return isNaN(dt) ? null : dt;
  }
  const [d, m, y] = dateStr.split('/').map(Number);
  if (!d || !m || !y) return null;
  const dt = new Date(y, m - 1, d);
  return isNaN(dt) ? null : dt;
};

const parseAmt = (val) => parseFloat((val || '0').replace(/,/g, '')) || 0;
const fmtINR = (num) => num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const statusColors = {
  Pending: 'bg-amber-100 text-amber-800 border-amber-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  Completed: 'bg-green-100 text-green-800 border-green-200',
  Rejected: 'bg-red-100 text-red-800 border-red-200',
  Done: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

// ─── Component ───────────────────────────────────────────────────────────────

const GstData = () => {
  const { data: gstData = [], isLoading, isError, error } = useGetGstDataQuery();
  const [updateFollowup, { isLoading: isUpdating }] = useUpdateGstFollowupMutation();

  const [activeTab, setActiveTab] = useState('followup');

  // Pagination
  const [page, setPage] = useState(1);
  const [summaryPage, setSummaryPage] = useState(1);
  const itemsPerPage = 10;

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formStatus, setFormStatus] = useState('Pending');
  const [formRemark, setFormRemark] = useState('');
  const [formFollowUpDate, setFormFollowUpDate] = useState('');
  const modalInitialFocusRef = useRef(null);

  // Hover popup
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const hoverTimerRef = useRef(null);

  // FollowUp filters
  const [selectedFilingPeriods, setSelectedFilingPeriods] = useState([]);
  const [selectedInOut, setSelectedInOut] = useState(['IN', 'OUT']);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);

  // Follow-up date range filter
  const [followupFromDate, setFollowupFromDate] = useState('');
  const [followupToDate, setFollowupToDate] = useState('');

  // Summary filters
  const [summaryFromDate, setSummaryFromDate] = useState('');
  const [summaryToDate, setSummaryToDate] = useState('');
  const [summaryFillFromDate, setSummaryFillFromDate] = useState('');
  const [summaryFillToDate, setSummaryFillToDate] = useState('');
  const [summaryInOut, setSummaryInOut] = useState(['IN', 'OUT']);
  const [summaryProjects, setSummaryProjects] = useState([]);
  const [summaryVendors, setSummaryVendors] = useState([]);

  useEffect(() => {
    if (isModalOpen) setTimeout(() => modalInitialFocusRef.current?.focus(), 100);
  }, [isModalOpen]);

  const projectOptions = useMemo(() => {
    const unique = [...new Set(gstData.map(i => i.Project_Name_1).filter(Boolean))];
    return unique.map(n => ({ value: n, label: n }));
  }, [gstData]);

  const vendorOptions = useMemo(() => {
    const unique = [...new Set(gstData.map(i => i.Contractor_Vendor_Name_1).filter(Boolean))];
    return unique.map(n => ({ value: n, label: n }));
  }, [gstData]);

  const inOutOptions = [{ value: 'IN', label: 'IN' }, { value: 'OUT', label: 'OUT' }];

  const filingPeriodOptions = useMemo(() => {
    const unique = [...new Set(gstData.map(i => i.GST_Filling_Period).filter(Boolean))].sort();
    return unique.map(p => ({ value: p, label: p }));
  }, [gstData]);

  // ── Follow-up view ──
  const filteredData = useMemo(() => {
    let result = gstData.filter(i => (i.Status_1 || '').trim().toUpperCase() !== 'DONE');

    if (selectedFilingPeriods.length) result = result.filter(i => selectedFilingPeriods.map(o => o.value).includes(i.GST_Filling_Period));
    if (selectedInOut.length) result = result.filter(i => selectedInOut.includes((i.IN_Out_Head_1 || '').trim()));
    if (selectedProjects.length) result = result.filter(i => selectedProjects.map(o => o.value).includes((i.Project_Name_1 || '').trim()));
    if (selectedVendors.length) result = result.filter(i => selectedVendors.map(o => o.value).includes((i.Contractor_Vendor_Name_1 || '').trim()));

    if (followupFromDate) {
      const from = parseBillDateISO(followupFromDate);
      if (from) result = result.filter(i => {
        const d = parseBillDateISO(i.FollowUpDate);
        return d && d >= from;
      });
    }

    if (followupToDate) {
      const to = parseBillDateISO(followupToDate);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        result = result.filter(i => {
          const d = parseBillDateISO(i.FollowUpDate);
          return d && d <= end;
        });
      }
    }

    return result;
  }, [gstData, selectedFilingPeriods, selectedInOut, selectedProjects, selectedVendors, followupFromDate, followupToDate]);

  useEffect(() => { setPage(1); }, [filteredData]);
  const paginatedData = useMemo(() => filteredData.slice(0, page * itemsPerPage), [filteredData, page]);

  const summaryFollowup = useMemo(() => {
    let inGst = 0, outGst = 0;
    filteredData.forEach(i => {
      const gst = parseAmt(i.Total_GST_Amount_1);
      if ((i.IN_Out_Head_1 || '').trim() === 'IN') inGst += gst;
      if ((i.IN_Out_Head_1 || '').trim() === 'OUT') outGst += gst;
    });
    const netGst = outGst - inGst;
    return { inGst: fmtINR(inGst), outGst: fmtINR(outGst), netGst: fmtINR(Math.abs(netGst)), netGstSign: netGst >= 0 ? 'payable' : 'refundable' };
  }, [filteredData]);

  // ── Summary view ──
  const summaryFilteredData = useMemo(() => {
    let result = [...gstData];

    if (summaryFromDate) {
      const from = parseBillDateISO(summaryFromDate);
      if (from) result = result.filter(i => {
        const d = parseBillDateISO(i.Bill_Date_1);
        return d && d >= from;
      });
    }

    if (summaryToDate) {
      const to = parseBillDateISO(summaryToDate);
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        result = result.filter(i => {
          const d = parseBillDateISO(i.Bill_Date_1);
          return d && d <= endOfDay;
        });
      }
    }

    if (summaryFillFromDate) {
      const from = parseBillDateISO(summaryFillFromDate);
      if (from) result = result.filter(i => {
        const fillDate = parseBillDateISO(i.Timestamp_2);
        return fillDate && fillDate >= from;
      });
    }

    if (summaryFillToDate) {
      const to = parseBillDateISO(summaryFillToDate);
      if (to) {
        const endOfDay = new Date(to);
        endOfDay.setHours(23, 59, 59, 999);
        result = result.filter(i => {
          const fillDate = parseBillDateISO(i.Timestamp_2);
          return fillDate && fillDate <= endOfDay;
        });
      }
    }

    if (summaryInOut.length) result = result.filter(i => summaryInOut.includes((i.IN_Out_Head_1 || '').trim()));
    if (summaryProjects.length) {
      const selected = summaryProjects.map(o => o.value.trim());
      result = result.filter(i => selected.includes((i.Project_Name_1 || '').trim()));
    }
    if (summaryVendors.length) {
      const selected = summaryVendors.map(o => o.value.trim());
      result = result.filter(i => selected.includes((i.Contractor_Vendor_Name_1 || '').trim()));
    }

    return result;
  }, [gstData, summaryFromDate, summaryToDate, summaryFillFromDate, summaryFillToDate, summaryInOut, summaryProjects, summaryVendors]);

  useEffect(() => { setSummaryPage(1); }, [summaryFilteredData]);
  const summaryPaginatedData = useMemo(() => summaryFilteredData.slice(0, summaryPage * itemsPerPage), [summaryFilteredData, summaryPage]);

  const summaryTotals = useMemo(() => {
    let inGst = 0, outGst = 0;
    summaryFilteredData.forEach(i => {
      const gst = parseAmt(i.Total_GST_Amount_1);
      if ((i.IN_Out_Head_1 || '').trim() === 'IN') inGst += gst;
      if ((i.IN_Out_Head_1 || '').trim() === 'OUT') outGst += gst;
    });
    const netGst = outGst - inGst;
    return { inGst: fmtINR(inGst), outGst: fmtINR(outGst), netGst: fmtINR(Math.abs(netGst)), netGstSign: netGst >= 0 ? 'payable' : 'refundable' };
  }, [summaryFilteredData]);

  const openFollowupModal = (item) => {
    setSelectedItem(item);
    setFormStatus((item.Status_1 || 'Pending').trim());
    setFormRemark(item.Remark_2 || '');
    setFormFollowUpDate(item.FollowUpDate || '');
    setIsModalOpen(true);
  };

  const handleSubmitFollowup = async (e) => {
    e.preventDefault();
    if (!selectedItem?.UID) return;

    const payload = {
      uid: selectedItem.UID.trim(),
      status: formStatus.trim(),
      remark: formRemark.trim(),
      followUpDate: formFollowUpDate?.trim() || "",
    };

    console.log("=== SENDING TO API ===");
    console.log(JSON.stringify(payload, null, 2));

    try {
      const result = await updateFollowup(payload).unwrap();
      console.log("API SUCCESS RESPONSE:", result);
      alert('Follow-up updated successfully!');
      setIsModalOpen(false);
    } catch (err) {
      console.error("API ERROR:", err);
      alert('Error: ' + (err?.data?.error || err?.message || 'Failed to save'));
    }
  };

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-500">Loading GST data…</p>
      </div>
    </div>
  );

  if (isError) return <div className="p-6 text-center text-red-600">Error: {error?.data?.error || 'Something went wrong'}</div>;

  // ── Table Columns ──
  const FOLLOWUP_COLS = [
    ['UID', 'w-16'],
    ['Project', 'w-36'],
    ['Vendor', 'w-44'],
    ['Bill Date', 'w-24'],
    ['Bill No.', 'w-28'],
    ['Bill Amt', 'w-24 text-right'],
    ['CGST', 'w-20 text-right'],
    ['SGST', 'w-20 text-right'],
    ['IGST', 'w-20 text-right'],
    ['Trans. Charges', 'w-24 text-right'],
    ['Trans. GST', 'w-24 text-right'],
    ['NET Amt', 'w-24 text-right'],
    ['Total GST', 'w-24 text-right'],
    ['Filing Period', 'w-28'],
    ['IN/OUT', 'w-16 text-center'],
    ['Action', 'w-16 text-center'],
  ];

  const SUMMARY_COLS = [
    ['UID', 'w-16'],
    ['Project', 'w-36'],
    ['Vendor', 'w-44'],
    ['Bill Date', 'w-24'],
    ['Bill No.', 'w-28'],
    ['Bill Amt', 'w-24 text-right'],
    ['CGST', 'w-20 text-right'],
    ['SGST', 'w-20 text-right'],
    ['IGST', 'w-20 text-right'],
    ['Trans. Charges', 'w-24 text-right'],
    ['Trans. GST', 'w-24 text-right'],
    ['NET Amt', 'w-24 text-right'],
    ['Total GST', 'w-24 text-right'],
    ['Filing Period', 'w-28'],
    ['IN/OUT', 'w-16 text-center'],
    ['Status', 'w-24 text-center'],
    ['Fill Date', 'w-24 text-center'],
  ];

  // ── Row Renderers ──
  const renderFollowupRow = (item, idx) => (
    <tr
      key={item.UID}
      className={`hover:bg-indigo-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
      onMouseEnter={(e) => {
        if (!e.currentTarget) return;
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
          if (!e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setHoverPos({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
          setHoveredItem(item);
        }, 300);
      }}
      onMouseLeave={() => {
        clearTimeout(hoverTimerRef.current);
        setHoveredItem(null);
      }}
    >
      {/* ... same td cells as before ... */}
      <td className="px-3 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{item.UID}</td>
      <td className="px-3 py-3 text-gray-800 max-w-[9rem] truncate" title={item.Project_Name_1}>{item.Project_Name_1}</td>
      <td className="px-3 py-3 text-gray-700 max-w-[11rem] truncate" title={item.Contractor_Vendor_Name_1}>{item.Contractor_Vendor_Name_1}</td>
      <td className="px-3 py-3 whitespace-nowrap text-gray-600">{item.Bill_Date_1}</td>
      <td className="px-3 py-3 text-xs font-medium text-indigo-700 max-w-[7rem] truncate" title={item.Bill_Number_1}>{item.Bill_Number_1}</td>
      <td className="px-3 py-3 text-right text-gray-700">{item.Total_Bill_Amount_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.CGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.SGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.IGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.Transport_Charges_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.Transport_Gst_Amount_1}</td>
      <td className="px-3 py-3 text-right font-semibold text-gray-900">{item.NET_Amount}</td>
      <td className="px-3 py-3 text-right text-gray-700">{item.Total_GST_Amount_1}</td>
      <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">{item.GST_Filling_Period}</td>
      <td className="px-3 py-3 text-center">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.IN_Out_Head_1?.trim() === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.IN_Out_Head_1?.trim() || '—'}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        <button
          onClick={() => openFollowupModal(item)}
          className="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition"
          title="Add / Edit Follow-up"
        >
          <PencilIcon className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );

  const renderSummaryRow = (item, idx) => (
    <tr
      key={item.UID}
      className={`hover:bg-indigo-50/40 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}`}
      onMouseEnter={(e) => {
        if (!e.currentTarget) return;
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
          if (!e.currentTarget) return;
          const rect = e.currentTarget.getBoundingClientRect();
          setHoverPos({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
          setHoveredItem(item);
        }, 300);
      }}
      onMouseLeave={() => {
        clearTimeout(hoverTimerRef.current);
        setHoveredItem(null);
      }}
    >
      {/* ... same td cells as before ... */}
      <td className="px-3 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{item.UID}</td>
      <td className="px-3 py-3 text-gray-800 max-w-[9rem] truncate" title={item.Project_Name_1}>{item.Project_Name_1}</td>
      <td className="px-3 py-3 text-gray-700 max-w-[11rem] truncate" title={item.Contractor_Vendor_Name_1}>{item.Contractor_Vendor_Name_1}</td>
      <td className="px-3 py-3 whitespace-nowrap text-gray-600">{item.Bill_Date_1}</td>
      <td className="px-3 py-3 text-xs font-medium text-indigo-700 max-w-[7rem] truncate" title={item.Bill_Number_1}>{item.Bill_Number_1}</td>
      <td className="px-3 py-3 text-right text-gray-700">{item.Total_Bill_Amount_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.CGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.SGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.IGST_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.Transport_Charges_1}</td>
      <td className="px-3 py-3 text-right text-gray-600">{item.Transport_Gst_Amount_1}</td>
      <td className="px-3 py-3 text-right font-semibold text-gray-900">{item.NET_Amount}</td>
      <td className="px-3 py-3 text-right text-gray-700">{item.Total_GST_Amount_1}</td>
      <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">{item.GST_Filling_Period}</td>
      <td className="px-3 py-3 text-center">
        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.IN_Out_Head_1?.trim() === 'IN' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {item.IN_Out_Head_1?.trim() || '—'}
        </span>
      </td>
      <td className="px-3 py-3 text-center">
        {item.Status_1 ? (
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${statusColors[item.Status_1] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
            {item.Status_1}
          </span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        )}
      </td>
      <td className="px-3 py-3 whitespace-nowrap text-gray-600 text-xs">{item.Timestamp_2 || '—'}</td>
    </tr>
  );

  const renderTable = (rows, totalRows, cols, renderRowFn, onLoadMore) => (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                {cols.map(([label, cls]) => (
                  <th key={label} className={`px-4 py-5 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${cls}`}>{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={cols.length} className="px-6 py-12 text-center text-gray-400">
                    No matching records found
                  </td>
                </tr>
              ) : (
                rows.map((item, idx) => renderRowFn(item, idx))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {rows.length < totalRows && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            className="px-8 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition shadow"
          >
            Load More ({rows.length} of {totalRows})
          </button>
        </div>
      )}
      {rows.length === totalRows && totalRows > 0 && (
        <p className="mt-5 text-center text-sm text-gray-400">All {totalRows} records loaded</p>
      )}
    </>
  );

  return (
    <div className="p-4 md:p-6 max-w-[100vw] overflow-x-auto bg-gray-50 min-h-screen">
      {/* Header + Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">GST Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {activeTab === 'followup'
              ? `${filteredData.length} records · Follow-Up View (pending)`
              : `${summaryFilteredData.length} records · Summary View (All Bills)`}
          </p>
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm w-fit">
          <button
            onClick={() => setActiveTab('followup')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'followup' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📋 GST Follow-Up
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'summary' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            📊 GST Summary
          </button>
        </div>
      </div>

      {/* FOLLOW-UP TAB */}
      {activeTab === 'followup' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard label="GST IN" value={`₹ ${summaryFollowup.inGst}`} sub="Pending IN bills" color="green" />
            <SummaryCard label="GST OUT" value={`₹ ${summaryFollowup.outGst}`} sub="Pending OUT bills" color="red" />
            <SummaryCard
              label={`Net GST ${summaryFollowup.netGstSign === 'payable' ? 'Payable 🔴' : 'Refundable 🟢'}`}
              value={`₹ ${summaryFollowup.netGst}`}
              sub={summaryFollowup.netGstSign === 'payable' ? 'Govt ko dena hai' : 'Govt se milega'}
              color={summaryFollowup.netGstSign === 'payable' ? 'orange' : 'teal'}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-600">
              <FunnelIcon className="h-4 w-4" /> Filters
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Filing Period</label>
                <Select isMulti options={filingPeriodOptions} value={selectedFilingPeriods} onChange={setSelectedFilingPeriods} placeholder="All" styles={selectStyles} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">IN / OUT</label>
                <Select isMulti options={inOutOptions} value={selectedInOut.map(v => inOutOptions.find(o => o.value === v))} onChange={opts => setSelectedInOut(opts?.map(o => o.value) || [])} styles={selectStyles} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Projects</label>
                <Select isMulti options={projectOptions} value={selectedProjects} onChange={setSelectedProjects} placeholder="All" styles={selectStyles} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Vendors</label>
                <Select isMulti options={vendorOptions} value={selectedVendors} onChange={setSelectedVendors} placeholder="All" styles={selectStyles} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Follow-up From</label>
                <input
                  type="date"
                  value={followupFromDate}
                  onChange={e => setFollowupFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Follow-up To</label>
                <input
                  type="date"
                  value={followupToDate}
                  min={followupFromDate || undefined}
                  onChange={e => setFollowupToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>

            {(followupFromDate || followupToDate) && (
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                  📅 Follow-up: {followupFromDate || 'Any'} → {followupToDate || 'Any'}
                </span>
              </div>
            )}
          </div>

          {renderTable(paginatedData, filteredData.length, FOLLOWUP_COLS, renderFollowupRow, () => setPage(p => p + 1))}
        </>
      )}

      {/* SUMMARY TAB */}
      {activeTab === 'summary' && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <FunnelIcon className="h-4 w-4" /> Filters
              </div>
              <button
                onClick={() => {
                  setSummaryFromDate('');
                  setSummaryToDate('');
                  setSummaryFillFromDate('');
                  setSummaryFillToDate('');
                  setSummaryInOut(['IN', 'OUT']);
                  setSummaryProjects([]);
                  setSummaryVendors([]);
                }}
                className="text-xs text-indigo-500 hover:text-indigo-700 font-medium underline underline-offset-2"
              >
                Clear All
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bill From Date</label>
                <input
                  type="date"
                  value={summaryFromDate}
                  onChange={e => setSummaryFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Bill To Date</label>
                <input
                  type="date"
                  value={summaryToDate}
                  min={summaryFromDate || undefined}
                  onChange={e => setSummaryToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fill From Date</label>
                <input
                  type="date"
                  value={summaryFillFromDate}
                  onChange={e => setSummaryFillFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Fill To Date</label>
                <input
                  type="date"
                  value={summaryFillToDate}
                  min={summaryFillFromDate || undefined}
                  onChange={e => setSummaryFillToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">IN / OUT</label>
                <Select isMulti options={inOutOptions} value={summaryInOut.map(v => inOutOptions.find(o => o.value === v))} onChange={opts => setSummaryInOut(opts?.map(o => o.value) || [])} styles={selectStyles} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Projects</label>
                <Select isMulti options={projectOptions} value={summaryProjects} onChange={setSummaryProjects} placeholder="All" styles={selectStyles} />
              </div>
              <div className="xl:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1">Vendors</label>
                <Select isMulti options={vendorOptions} value={summaryVendors} onChange={setSummaryVendors} placeholder="All" styles={selectStyles} />
              </div>
            </div>

            {(summaryFromDate || summaryToDate || summaryFillFromDate || summaryFillToDate) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(summaryFromDate || summaryToDate) && (
                  <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-medium">
                    📅 Bill: {summaryFromDate || 'All time'} → {summaryToDate || 'Now'}
                  </span>
                )}
                {(summaryFillFromDate || summaryFillToDate) && (
                  <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                    📅 Filled: {summaryFillFromDate || 'All time'} → {summaryFillToDate || 'Now'}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                  {summaryFilteredData.length} records
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard label="GST IN" value={`₹ ${summaryTotals.inGst}`} sub="All IN bills" color="green" />
            <SummaryCard label="GST OUT" value={`₹ ${summaryTotals.outGst}`} sub="All OUT bills" color="red" />
            <SummaryCard
              label={`Net GST ${summaryTotals.netGstSign === 'payable' ? 'Payable 🔴' : 'Refundable 🟢'}`}
              value={`₹ ${summaryTotals.netGst}`}
              sub={summaryTotals.netGstSign === 'payable' ? 'Pay to Govt' : 'Refund from Govt'}
              color={summaryTotals.netGstSign === 'payable' ? 'orange' : 'teal'}
            />
          </div>

          {renderTable(summaryPaginatedData, summaryFilteredData.length, SUMMARY_COLS, renderSummaryRow, () => setSummaryPage(p => p + 1))}
        </>
      )}

      {/* Hover Popup */}
      {hoveredItem && (
        <div className="fixed z-40 pointer-events-none" style={{ left: Math.min(hoverPos.x, window.innerWidth - 420) + 'px', top: hoverPos.y + 8 + 'px' }}>
          <div className="bg-white border border-indigo-100 rounded-2xl shadow-2xl w-[400px] p-5 text-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-base">UID: {hoveredItem.UID}</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${hoveredItem.IN_Out_Head_1?.trim() === 'IN' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {hoveredItem.IN_Out_Head_1?.trim() || '—'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[['Project', hoveredItem.Project_Name_1], ['Vendor', hoveredItem.Contractor_Vendor_Name_1], ['Bill Date', hoveredItem.Bill_Date_1], ['Bill No', hoveredItem.Bill_Number_1], ['Filing Period', hoveredItem.GST_Filling_Period], ['Status', hoveredItem.Status_1 || '—']].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
                  <p className="text-gray-800 font-medium break-words leading-tight mt-0.5">{val || '—'}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-3">
              {[['Bill Amt', hoveredItem.Total_Bill_Amount_1, 'text-gray-700'], ['NET Amt', hoveredItem.NET_Amount, 'text-indigo-700 font-bold'], ['Total GST', hoveredItem.Total_GST_Amount_1, 'text-orange-700']].map(([label, val, cls]) => (
                <div key={label} className="bg-gray-50 rounded-lg px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
                  <p className={`text-sm mt-0.5 ${cls}`}>₹ {val || '0'}</p>
                </div>
              ))}
            </div>
            {hoveredItem.Remark_2 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">Remark</p>
                <p className="text-gray-700 text-xs leading-relaxed">{hoveredItem.Remark_2}</p>
              </div>
            )}
            {hoveredItem.FollowUpDate && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-1">Next Follow-up</p>
                <p className="text-gray-700 text-xs">{hoveredItem.FollowUpDate}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Follow-up Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm p-3" onClick={e => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col my-auto" style={{ maxHeight: '85vh' }}>
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 bg-gray-50 rounded-t-2xl flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Update Follow-up</h2>
                <p className="text-xs text-gray-500 mt-0.5">UID: {selectedItem.UID}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 text-xl font-bold transition">×</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg text-sm">
                <span className="text-gray-500">Bill No:</span>{' '}
                <span className="font-medium text-indigo-700 break-all">{selectedItem.Bill_Number_1}</span>
              </div>
              <form onSubmit={handleSubmitFollowup}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    ref={modalInitialFocusRef}
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    required
                  >
                    <option value="Done">Done</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-red-600 mb-1">Debug: Selected date = {formFollowUpDate || '(not selected)'}</p>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={formFollowUpDate}
                    onChange={e => setFormFollowUpDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Remark / Note</label>
                  <textarea
                    value={formRemark}
                    onChange={e => setFormRemark(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
                    placeholder="Enter follow-up details…"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className={`px-5 py-2.5 rounded-lg text-sm text-white font-medium transition ${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  >
                    {isUpdating ? 'Saving…' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const colorMap = {
  green: { bg: 'bg-green-50', border: 'border-green-100', head: 'text-green-800', val: 'text-green-700', sub: 'text-green-500' },
  red: { bg: 'bg-red-50', border: 'border-red-100', head: 'text-red-800', val: 'text-red-700', sub: 'text-red-400' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100', head: 'text-orange-800', val: 'text-orange-700', sub: 'text-orange-400' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-100', head: 'text-teal-800', val: 'text-teal-700', sub: 'text-teal-400' },
};

const SummaryCard = ({ label, value, sub, color }) => {
  const c = colorMap[color] || colorMap.teal;
  return (
    <div className={`${c.bg} border ${c.border} rounded-xl p-4 shadow-sm`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${c.head} mb-1`}>{label}</p>
      <p className={`text-xl font-bold ${c.val} leading-tight`}>{value}</p>
      {sub && <p className={`text-xs mt-1 ${c.sub}`}>{sub}</p>}
    </div>
  );
};

const selectStyles = {
  control: (base) => ({ ...base, borderColor: '#d1d5db', borderRadius: '0.5rem', fontSize: '0.875rem', minHeight: '38px', boxShadow: 'none', '&:hover': { borderColor: '#818cf8' } }),
  multiValue: (base) => ({ ...base, backgroundColor: '#e0e7ff', borderRadius: '4px' }),
  multiValueLabel: (base) => ({ ...base, color: '#3730a3', fontSize: '0.75rem' }),
};

export default GstData;