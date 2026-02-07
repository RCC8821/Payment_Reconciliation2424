

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  ListOrdered,
  Calendar,
  RefreshCw,
  X,
  Search,
  Building2,
  AlertCircle,
} from "lucide-react";
import {
  useGetMainBankSummaryQuery,
  useGetBankBalancesQuery,
  useGetOutstandingQuery,
} from "../../features/Summary/mainSummarySlice";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Filler
);

const MultiSelectFilter = ({
  label,
  value = [],
  onChange,
  options,
  placeholder,
  isDarkMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isAllSelected = value.length === options.filter(opt => opt !== "All").length && value.length > 0;

  const toggleOption = (option) => {
    if (option === "All") {
      if (isAllSelected) {
        onChange([]);
      } else {
        const allExceptAll = options.filter(opt => opt !== "All");
        onChange(allExceptAll);
      }
      setInputValue("");
      setIsOpen(false);
      return;
    }

    let newValue = [...value];
    if (newValue.includes(option)) {
      newValue = newValue.filter(v => v !== option);
    } else {
      newValue.push(option);
    }

    onChange(newValue);
    setInputValue("");
  };

  const filteredOptions = options.filter(opt =>
    opt === "All" || opt.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-[150]" ref={wrapperRef}>
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>

      <div
        className={`relative w-full min-h-[46px] flex items-center rounded-xl border-2 transition-all duration-200 cursor-text
          ${isDarkMode ? "bg-gray-900/60 border-gray-700 hover:border-indigo-500" : "bg-white border-gray-300 hover:border-indigo-400 shadow-sm hover:shadow-md"}
          ${isOpen ? "ring-2 ring-indigo-500 border-indigo-500" : ""}`}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />

        <div className="flex flex-wrap gap-2 pl-11 pr-10 py-2 w-full">
          {value.map(selected => (
            <div
              key={selected}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${isDarkMode ? "bg-indigo-900/70 text-indigo-200 border-indigo-700" : "bg-indigo-100 text-indigo-800 border-indigo-200"}`}
            >
              {selected}
              <button
                onClick={e => { e.stopPropagation(); toggleOption(selected); }}
                className="ml-1 p-0.5 rounded-full hover:bg-black/10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
            placeholder={value.length === 0 ? placeholder : ""}
            autoComplete="off"
            className={`flex-1 min-w-[120px] bg-transparent focus:outline-none text-sm ${isDarkMode ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className={`absolute z-[999] w-full mt-2 rounded-xl shadow-2xl border-2 overflow-hidden ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} style={{ maxHeight: "320px" }}>
          <div className="overflow-y-auto max-h-[320px]">
            {filteredOptions.length === 0 && inputValue ? (
              <div className={`p-4 text-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>No results found</div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option}
                  onClick={() => toggleOption(option)}
                  className={`w-full px-4 py-3 text-left flex items-center justify-between transition-colors
                    ${value.includes(option) || (option === "All" && isAllSelected)
                      ? isDarkMode ? "bg-indigo-900/50 text-indigo-300 font-medium" : "bg-indigo-100 text-indigo-800 font-medium"
                      : isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-900 hover:bg-gray-50"}`}
                >
                  <span className="truncate">{option}</span>
                  {(value.includes(option) || (option === "All" && isAllSelected)) && (
                    <div className={`w-2 h-2 rounded-full ${isDarkMode ? "bg-indigo-400" : "bg-indigo-600"}`} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  return parseFloat(amountStr.toString().replace(/,/g, "")) || 0;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [datePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");
  return new Date(`${year}-${month}-${day}`);
};

const StatCard = ({
  title,
  amount,
  color,
  icon,
  isBalance = false,
  isDarkMode,
  balanceValue,
}) => {
  const colorMap = {
    emerald: {
      bg: isDarkMode ? "bg-gradient-to-br from-emerald-900/60 to-teal-900/60" : "bg-gradient-to-br from-emerald-100/85 to-teal-100/75",
      text: isDarkMode ? "text-emerald-300" : "text-emerald-800",
      border: isDarkMode ? "border-emerald-700/40" : "border-emerald-300/60",
      light: isDarkMode ? "bg-emerald-950/30" : "bg-emerald-200/40",
      titleText: isDarkMode ? "text-gray-400" : "text-gray-700",
      iconColor: isDarkMode ? "text-white" : "text-emerald-700",
    },
    rose: {
      bg: isDarkMode ? "bg-gradient-to-br from-rose-900/60 to-pink-900/60" : "bg-gradient-to-br from-rose-100/85 to-pink-100/75",
      text: isDarkMode ? "text-rose-300" : "text-rose-800",
      border: isDarkMode ? "border-rose-700/40" : "border-rose-300/60",
      light: isDarkMode ? "bg-rose-950/30" : "bg-rose-200/40",
      titleText: isDarkMode ? "text-gray-400" : "text-gray-700",
      iconColor: isDarkMode ? "text-white" : "text-rose-700",
    },
  };

  const colors = colorMap[color] || colorMap.emerald;
  const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

  let finalIconColor = colors.iconColor;
  if (isBalance) {
    finalIconColor = isDarkMode
      ? balanceValue >= 0 ? "text-emerald-400" : "text-rose-400"
      : balanceValue >= 0 ? "text-emerald-700" : "text-rose-700";
  }

  return (
    <div className={`rounded-2xl border shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden w-full p-6 lg:p-8 
      ${isDarkMode ? "bg-black/30 border-gray-700/40" : "bg-white/80 border-gray-200/70"}`}>
      <div className={`absolute -right-10 -top-10 w-40 h-40 ${colors.light} rounded-full blur-3xl`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`p-4 rounded-xl ${colors.bg} shadow-lg`}>
            {React.cloneElement(icon, {
              size: 28,
              className: finalIconColor,
              strokeWidth: isDarkMode ? 2 : 2.2,
            })}
          </div>
        </div>
        <h3 className={`text-sm lg:text-base font-semibold uppercase tracking-wider mb-2 ${colors.titleText}`}>
          {title}
        </h3>
        <p className={`text-3xl md:text-3.5xl lg:text-4xl font-black tracking-tight ${colors.text}`}>
          ₹{safeAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </p>
      </div>
    </div>
  );
};

const BankBalance = ({ isDarkMode }) => {
  const { data: bankApiData, isLoading, isError, refetch } = useGetBankBalancesQuery();

  const bankData = useMemo(() => {
    if (!bankApiData?.balances || !Array.isArray(bankApiData.balances)) return [];

    return bankApiData.balances
      .map(item => {
        let balanceStr = (item.Balance || "0").toString().trim();
        const balanceNum = parseFloat(balanceStr.replace(/,/g, "").replace(/₹/g, "")) || 0;

        return {
          bankName: (item.BankName || "Unknown").trim(),
          balance: balanceNum,
          balanceFormatted: balanceNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        };
      })
      .filter(b => b.bankName !== "Unknown" && b.balance > 0)
      .sort((a, b) => b.balance - a.balance);
  }, [bankApiData]);

  const totalBalance = useMemo(() => bankData.reduce((sum, b) => sum + b.balance, 0), [bankData]);

  const barChartData = {
    labels: bankData.map(b => b.bankName),
    datasets: [{
      label: "Balance",
      data: bankData.map(b => b.balance),
      backgroundColor: "rgba(16, 185, 129, 0.75)",
      borderColor: "#10b981",
      borderWidth: 1,
      borderRadius: 8,
      hoverBackgroundColor: "rgba(16, 185, 129, 0.95)",
    }],
  };

  const barChartOptions = {
    indexAxis: "x",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Bank Balance Overview",
        color: isDarkMode ? "#ffffff" : "#111827",
        font: { size: 22, weight: "bold" },
        padding: { top: 10, bottom: 20 },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "rgba(17,24,39,0.96)" : "rgba(255,255,255,0.98)",
        titleColor: isDarkMode ? "#f3f4f6" : "#111827",
        bodyColor: isDarkMode ? "#f3f4f6" : "#111827",
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => {
            const val = ctx.parsed.y;
            const pct = totalBalance > 0 ? ((val / totalBalance) * 100).toFixed(1) : "0.0";
            return ` ₹${val.toLocaleString("en-IN")}  (${pct}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
        ticks: {
          color: isDarkMode ? "#9ca3af" : "#6b7280",
          font: { weight: "500" },
          callback: v => "₹" + v.toLocaleString("en-IN", { notation: "compact" }),
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: isDarkMode ? "#d1d5db" : "#374151",
          font: { size: bankData.length > 10 ? 11 : 13, weight: "500" },
          maxRotation: 45,
          minRotation: 30,
          autoSkip: true,
        },
      },
    },
  };

  if (isLoading) return (
    <div className="py-20 flex flex-col items-center justify-center">
      <div className="w-14 h-14 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-5"></div>
      <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Loading bank balances...</p>
    </div>
  );

  if (isError || bankData.length === 0) return (
    <div className={`rounded-2xl p-10 text-center border max-w-lg mx-auto ${isDarkMode ? "bg-rose-950/20 border-rose-800/40" : "bg-rose-50 border-rose-200"}`}>
      <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-rose-400" : "text-rose-600"}`} />
      <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-rose-300" : "text-rose-800"}`}>
        {isError ? "Failed to load balances" : "No bank data found"}
      </h3>
      <button onClick={refetch} className="mt-5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 mx-auto transition-colors">
        <RefreshCw size={18} /> Retry
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className={`rounded-2xl border shadow-2xl p-8 text-center ${isDarkMode ? "bg-gradient-to-br from-emerald-950/60 to-teal-950/50 border-emerald-800/50" : "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"}`}>
        <p className={`text-sm font-semibold uppercase tracking-wider mb-3 ${isDarkMode ? "text-emerald-300/90" : "text-emerald-700"}`}>Current Total Balance</p>
        <p className={`text-5xl lg:text-6xl font-black tracking-tight ${isDarkMode ? "text-white" : "text-gray-900"}`}>
          ₹{totalBalance.toLocaleString("en-IN")}
        </p>
      </div>

      <div className={`rounded-2xl border shadow-2xl p-6 lg:p-10 ${isDarkMode ? "bg-black/40 border-indigo-800/50" : "bg-white/90 border-indigo-200/60"}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Calendar className={`w-7 h-7 ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`} /> Bank Balance Overview
          </h3>
          <span className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? "bg-emerald-900/40 text-emerald-300" : "bg-emerald-100 text-emerald-800"}`}>
            As of {new Date().toLocaleDateString("en-IN")}
          </span>
        </div>
        <div className="h-[420px] sm:h-[440px] lg:h-[480px] w-full">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      <div className={`rounded-2xl border shadow-xl overflow-hidden ${isDarkMode ? "bg-black/30 border-indigo-800/50" : "bg-white/90 border-indigo-200/60"}`}>
        <div className={`px-6 py-4 border-b font-semibold text-lg ${isDarkMode ? "bg-emerald-950/30 text-emerald-300 border-emerald-800/50" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`}>
          All Banks
        </div>
        <div className="divide-y divide-gray-700/30 dark:divide-gray-700/40 max-h-[420px] overflow-y-auto">
          {bankData.map((bank, idx) => (
            <div key={idx} className={`px-6 py-4 flex justify-between items-center hover:bg-opacity-40 transition-colors ${isDarkMode ? "hover:bg-emerald-950/20" : "hover:bg-emerald-50/60"}`}>
              <span className={`font-medium text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{bank.bankName}</span>
              <span className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                ₹{bank.balanceFormatted}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};







// const Outstanding = ({ isDarkMode }) => {
//   const { data: outstandingApiData, isLoading, isError, error, refetch } = useGetOutstandingQuery();

//   const [filters, setFilters] = useState({
//     siteNames: [],
//     vendorNames: [],
//     expHeads: [],
//   });

//   const [showAll, setShowAll] = useState(false);

//   // Raw parsed data (ek baar hi calculate hota hai)
//   const rawData = useMemo(() => {
//     if (!outstandingApiData?.transactions || !Array.isArray(outstandingApiData.transactions)) {
//       return [];
//     }

//     return outstandingApiData.transactions.map(item => ({
//       date: item.date || "—",
//       siteName: item.siteName || "—",
//       vendorName: item.vendorName || "—",
//       billNo: item.billNo || "—",
//       expHead: item.expHead || "—",
//       netAmount: parseAmount(item.netAmount),
//       paidAmount: parseAmount(item.paidAmount),
//       balance: parseAmount(item.balance),
//     }));
//   }, [outstandingApiData]);

//   // Final filtered data jo table mein dikhega
//   const filteredData = useMemo(() => {
//     let data = [...rawData];

//     if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) {
//       data = data.filter(t => filters.siteNames.includes(t.siteName));
//     }

//     if (filters.vendorNames.length > 0 && !filters.vendorNames.includes("All")) {
//       data = data.filter(t => filters.vendorNames.includes(t.vendorName));
//     }

//     if (filters.expHeads.length > 0 && !filters.expHeads.includes("All")) {
//       data = data.filter(t => filters.expHeads.includes(t.expHead));
//     }

//     return data.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
//   }, [rawData, filters]);

//   // Cascading dropdown options (yeh sabse important hai)
//   const filterOptions = useMemo(() => {
//     let currentData = [...rawData];

//     // Site filter apply → vendor options update
//     if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) {
//       currentData = currentData.filter(t => filters.siteNames.includes(t.siteName));
//     }
//     const vendors = [...new Set(currentData.map(t => t.vendorName).filter(Boolean))].sort();

//     // Vendor filter apply → expHead options update
//     if (filters.vendorNames.length > 0 && !filters.vendorNames.includes("All")) {
//       currentData = currentData.filter(t => filters.vendorNames.includes(t.vendorName));
//     }
//     const heads = [...new Set(currentData.map(t => t.expHead).filter(Boolean))].sort();

//     return {
//       siteNames: ["All", ...[...new Set(rawData.map(t => t.siteName).filter(Boolean))].sort()],
//       vendorNames: ["All", ...vendors],
//       expHeads: ["All", ...heads],
//     };
//   }, [rawData, filters.siteNames, filters.vendorNames]);

//   const totalOutstanding = filteredData.reduce((sum, t) => sum + t.balance, 0);
//   const totalNet = filteredData.reduce((sum, t) => sum + t.netAmount, 0);
//   const totalPaid = filteredData.reduce((sum, t) => sum + t.paidAmount, 0);

//   const activeFiltersCount = filters.siteNames.length + filters.vendorNames.length + filters.expHeads.length;

//   const displayedData = showAll ? filteredData : filteredData.slice(0, 10);

//   if (isLoading) {
//     return (
//       <div className="py-20 flex flex-col items-center justify-center">
//         <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-5"></div>
//         <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
//           Loading outstanding dues...
//         </p>
//       </div>
//     );
//   }

//   if (isError || !rawData.length) {
//     return (
//       <div className={`rounded-2xl p-10 text-center border max-w-lg mx-auto ${isDarkMode ? "bg-rose-950/20 border-rose-800/40" : "bg-rose-50 border-rose-200"}`}>
//         <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-rose-400" : "text-rose-600"}`} />
//         <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-rose-300" : "text-rose-800"}`}>
//           {isError ? "Failed to load data" : "No outstanding items found"}
//         </h3>
//         <button onClick={refetch} className="mt-5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 mx-auto transition-colors">
//           <RefreshCw size={18} /> Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-8">
//       {/* Summary Cards */}
     
//       {/* Filters - cascading */}
//       <div className={`rounded-xl border shadow-lg p-6 lg:p-8 ${isDarkMode ? "bg-gray-900/40 border-gray-700/60" : "bg-white border-gray-200/80"}`}>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//           <h3 className={`text-xl lg:text-2xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//             <Search className={`w-6 h-6 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
//             Filter Pending Dues
//             {activeFiltersCount > 0 && (
//               <span className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${isDarkMode ? "bg-indigo-900/80 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`}>
//                 {activeFiltersCount} active
//               </span>
//             )}
//           </h3>

//           {activeFiltersCount > 0 && (
//             <button
//               onClick={() => setFilters({ siteNames: [], vendorNames: [], expHeads: [] })}
//               className={`px-5 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? "border-gray-600 hover:bg-rose-950/30 text-rose-400 hover:border-rose-600" : "border-gray-300 hover:bg-rose-50 text-rose-600 hover:border-rose-400"}`}
//             >
//               <X size={16} /> Clear All
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
//           <MultiSelectFilter
//             label="Site Name"
//             value={filters.siteNames}
//             onChange={(vals) => setFilters(prev => ({
//               ...prev,
//               siteNames: vals,
//               vendorNames: [],   // Reset downstream filters
//               expHeads: [],
//             }))}
//             options={filterOptions.siteNames}
//             placeholder="Search & select sites..."
//             isDarkMode={isDarkMode}
//           />

//           <MultiSelectFilter
//             label="Vendor / Party"
//             value={filters.vendorNames}
//             onChange={(vals) => setFilters(prev => ({
//               ...prev,
//               vendorNames: vals,
//               expHeads: [],      // Reset downstream
//             }))}
//             options={filterOptions.vendorNames}
//             placeholder="Search & select vendors..."
//             isDarkMode={isDarkMode}
//           />

//           <MultiSelectFilter
//             label="Expense Head"
//             value={filters.expHeads}
//             onChange={(vals) => setFilters(prev => ({ ...prev, expHeads: vals }))}
//             options={filterOptions.expHeads}
//             placeholder="Search & select heads..."
//             isDarkMode={isDarkMode}
//           />
//         </div>
//       </div>


//        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
//         <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-rose-950/40 to-rose-900/30 border-rose-800/50" : "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"}`}>
//           <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-rose-300" : "text-rose-700"}`}>Total Billed</p>
//           <p className={`text-3xl lg:text-4xl font-black ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}>
//             ₹{totalNet.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//           </p>
//         </div>

//         <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-emerald-950/40 to-emerald-900/30 border-emerald-800/50" : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"}`}>
//           <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>Total Paid</p>
//           <p className={`text-3xl lg:text-4xl font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
//             ₹{totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//           </p>
//         </div>

//         <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border-indigo-800/50" : "bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200"}`}>
//           <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>Outstanding</p>
//           <p className={`text-3xl lg:text-4xl font-black ${totalOutstanding >= 0 ? "text-rose-500" : "text-emerald-500"}`}>
//             ₹{Math.abs(totalOutstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//           </p>
//         </div>
//       </div>


//       {/* Table */}
//       <div className={`rounded-xl border shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-900/30 border-gray-700/50" : "bg-white border-gray-200/70"}`}>
//         <div className={`px-6 py-5 border-b font-semibold text-lg flex items-center justify-between ${isDarkMode ? "bg-gradient-to-r from-indigo-950/70 to-purple-950/50 text-indigo-200 border-gray-700/60" : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border-indigo-200/40"}`}>
//           <div className="flex items-center gap-3">
//             <AlertCircle className={`w-6 h-6 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
//             Pending Payments
//           </div>
//           <span className="text-sm font-medium opacity-90">
//             Showing {displayedData.length} of {filteredData.length} records
//           </span>
//         </div>

//         {filteredData.length === 0 ? (
//           <div className="py-16 text-center">
//             <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//               No matching records found with current filters
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[1100px]">
//                 <thead className={`${isDarkMode ? "bg-gray-800/40" : "bg-gray-100/80"}`}>
//                   <tr>
//                     <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date</th>
//                     <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Site</th>
//                     <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Vendor/Party</th>
//                     <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Head</th>
//                     <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Bill No</th>
//                     <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Net Amount</th>
//                     <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Paid</th>
//                     <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Balance</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${isDarkMode ? "divide-gray-800/40" : "divide-gray-200/40"}`}>
//                   {displayedData.map((item, index) => (
//                     <tr
//                       key={index}
//                       className={`transition-colors hover:bg-opacity-50 ${isDarkMode ? "hover:bg-indigo-950/30" : "hover:bg-indigo-50/30"}`}
//                     >
//                       <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.date}</td>
//                       <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.siteName}</td>
//                       <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.vendorName}</td>
//                       <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.expHead}</td>
//                       <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.billNo}</td>
//                       <td className={`px-6 py-4 text-right text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
//                         ₹{item.netAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className={`px-6 py-4 text-right text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
//                         ₹{item.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                       </td>
//                       <td className={`px-6 py-4 text-right text-lg font-bold ${item.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
//                         ₹{Math.abs(item.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                         {item.balance < 0 && <span className="text-xs ml-1 opacity-70">(advance)</span>}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {filteredData.length > 10 && (
//               <div className={`px-6 py-5 border-t text-center ${isDarkMode ? "bg-gray-900/30 border-gray-700/50" : "bg-gray-50 border-gray-200"}`}>
//                 <button
//                   onClick={() => setShowAll(!showAll)}
//                   className={`px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${isDarkMode ? "bg-indigo-600/80 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
//                 >
//                   {showAll ? "Show Top 10 Only" : `Show All ${filteredData.length} Records`}
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         <div className={`px-6 py-5 border-t font-bold text-right text-lg flex justify-between items-center ${isDarkMode ? "bg-gray-900/40 border-gray-700/60 text-indigo-300" : "bg-gray-50 border-gray-200 text-indigo-800"}`}>
//           <span>Total Outstanding (filtered):</span>
//           <span className={totalOutstanding >= 0 ? "text-rose-500" : "text-emerald-500"}>
//             ₹{Math.abs(totalOutstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };


const Outstanding = ({ isDarkMode }) => {
  const { data: outstandingApiData, isLoading, isError, error, refetch } = useGetOutstandingQuery();

  const [filters, setFilters] = useState({
    siteNames: [],
    vendorNames: [],
    expHeads: [],
    billNos: [],          // ← नया filter: Bill Number
  });

  const [showAll, setShowAll] = useState(false);

  // Raw parsed data
  const rawData = useMemo(() => {
    if (!outstandingApiData?.transactions || !Array.isArray(outstandingApiData.transactions)) {
      return [];
    }

    return outstandingApiData.transactions.map(item => ({
      date: item.date || "—",
      siteName: item.siteName || "—",
      vendorName: item.vendorName || "—",
      billNo: item.billNo || "—",
      expHead: item.expHead || "—",
      netAmount: parseAmount(item.netAmount),
      paidAmount: parseAmount(item.paidAmount),
      balance: parseAmount(item.balance),
    }));
  }, [outstandingApiData]);

  // Filtered data (table mein dikhne wala)
  const filteredData = useMemo(() => {
    let data = [...rawData];

    if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) {
      data = data.filter(t => filters.siteNames.includes(t.siteName));
    }

    if (filters.vendorNames.length > 0 && !filters.vendorNames.includes("All")) {
      data = data.filter(t => filters.vendorNames.includes(t.vendorName));
    }

    if (filters.expHeads.length > 0 && !filters.expHeads.includes("All")) {
      data = data.filter(t => filters.expHeads.includes(t.expHead));
    }

    if (filters.billNos.length > 0 && !filters.billNos.includes("All")) {
      data = data.filter(t => filters.billNos.includes(t.billNo));
    }

    // Sort: balance ke hisaab se (sabse bada pehle)
    return data.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  }, [rawData, filters]);

  // Cascading dropdown options (site → vendor → expHead → billNo)
  const filterOptions = useMemo(() => {
    let current = [...rawData];

    // Site filter
    if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) {
      current = current.filter(t => filters.siteNames.includes(t.siteName));
    }

    const vendors = [...new Set(current.map(t => t.vendorName).filter(Boolean))].sort();

    // Vendor filter
    if (filters.vendorNames.length > 0 && !filters.vendorNames.includes("All")) {
      current = current.filter(t => filters.vendorNames.includes(t.vendorName));
    }

    const heads = [...new Set(current.map(t => t.expHead).filter(Boolean))].sort();

    // Exp Head filter
    if (filters.expHeads.length > 0 && !filters.expHeads.includes("All")) {
      current = current.filter(t => filters.expHeads.includes(t.expHead));
    }

    const billNumbers = [...new Set(current.map(t => t.billNo).filter(Boolean))].sort();

    return {
      siteNames: ["All", ...[...new Set(rawData.map(t => t.siteName).filter(Boolean))].sort()],
      vendorNames: ["All", ...vendors],
      expHeads: ["All", ...heads],
      billNos: ["All", ...billNumbers],
    };
  }, [rawData, filters.siteNames, filters.vendorNames, filters.expHeads]);

  const totalOutstanding = filteredData.reduce((sum, t) => sum + t.balance, 0);
  const totalNet = filteredData.reduce((sum, t) => sum + t.netAmount, 0);
  const totalPaid = filteredData.reduce((sum, t) => sum + t.paidAmount, 0);

  const activeFiltersCount = 
    filters.siteNames.length + 
    filters.vendorNames.length + 
    filters.expHeads.length + 
    filters.billNos.length;

  const displayedData = showAll ? filteredData : filteredData.slice(0, 10);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <div className="w-14 h-14 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-5"></div>
        <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Loading outstanding data...</p>
      </div>
    );
  }

  if (isError || !rawData.length) {
    return (
      <div className={`rounded-2xl p-10 text-center border max-w-lg mx-auto ${isDarkMode ? "bg-rose-950/20 border-rose-800/40" : "bg-rose-50 border-rose-200"}`}>
        <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? "text-rose-400" : "text-rose-600"}`} />
        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? "text-rose-300" : "text-rose-800"}`}>
          {isError ? "Failed to load data" : "No outstanding items found"}
        </h3>
        <button onClick={refetch} className="mt-5 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 mx-auto transition-colors">
          <RefreshCw size={18} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
        <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-rose-950/40 to-rose-900/30 border-rose-800/50" : "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200"}`}>
          <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-rose-300" : "text-rose-700"}`}>Total Billed</p>
          <p className={`text-3xl lg:text-4xl font-black ${isDarkMode ? "text-rose-400" : "text-rose-700"}`}>
            ₹{totalNet.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-emerald-950/40 to-emerald-900/30 border-emerald-800/50" : "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200"}`}>
          <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-emerald-300" : "text-emerald-700"}`}>Total Paid</p>
          <p className={`text-3xl lg:text-4xl font-black ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
            ₹{totalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className={`rounded-xl border shadow-lg p-6 text-center transition-all hover:shadow-xl ${isDarkMode ? "bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border-indigo-800/50" : "bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200"}`}>
          <p className={`text-sm font-medium uppercase tracking-wide mb-2 ${isDarkMode ? "text-indigo-300" : "text-indigo-700"}`}>Outstanding</p>
          <p className={`text-3xl lg:text-4xl font-black ${totalOutstanding >= 0 ? "text-rose-500" : "text-emerald-500"}`}>
            ₹{Math.abs(totalOutstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className={`rounded-xl border shadow-lg p-6 lg:p-8 ${isDarkMode ? "bg-gray-900/40 border-gray-700/60" : "bg-white border-gray-200/80"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h3 className={`text-xl lg:text-2xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            <Search className={`w-6 h-6 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            Filter Pending Dues
            {activeFiltersCount > 0 && (
              <span className={`ml-3 px-3 py-1 text-xs font-semibold rounded-full ${isDarkMode ? "bg-indigo-900/80 text-indigo-200" : "bg-indigo-100 text-indigo-800"}`}>
                {activeFiltersCount} active
              </span>
            )}
          </h3>

          {activeFiltersCount > 0 && (
            <button
              onClick={() => setFilters({ siteNames: [], vendorNames: [], expHeads: [], billNos: [] })}
              className={`px-5 py-2 rounded-lg border flex items-center gap-2 text-sm font-medium transition-colors ${isDarkMode ? "border-gray-600 hover:bg-rose-950/30 text-rose-400 hover:border-rose-600" : "border-gray-300 hover:bg-rose-50 text-rose-600 hover:border-rose-400"}`}
            >
              <X size={16} /> Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          <MultiSelectFilter
            label="Site Name"
            value={filters.siteNames}
            onChange={(vals) => setFilters(prev => ({
              ...prev,
              siteNames: vals,
              vendorNames: [],
              expHeads: [],
              billNos: [],
            }))}
            options={filterOptions.siteNames}
            placeholder="Search & select sites..."
            isDarkMode={isDarkMode}
          />

          <MultiSelectFilter
            label="Vendor / Party"
            value={filters.vendorNames}
            onChange={(vals) => setFilters(prev => ({
              ...prev,
              vendorNames: vals,
              expHeads: [],
              billNos: [],
            }))}
            options={filterOptions.vendorNames}
            placeholder="Search & select vendors..."
            isDarkMode={isDarkMode}
          />

          <MultiSelectFilter
            label="Expense Head"
            value={filters.expHeads}
            onChange={(vals) => setFilters(prev => ({
              ...prev,
              expHeads: vals,
              billNos: [],
            }))}
            options={filterOptions.expHeads}
            placeholder="Search & select heads..."
            isDarkMode={isDarkMode}
          />

          <MultiSelectFilter
            label="Bill Number"
            value={filters.billNos}
            onChange={(vals) => setFilters(prev => ({ ...prev, billNos: vals }))}
            options={filterOptions.billNos}
            placeholder="Search & select bills..."
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {/* Table Section - Bill No column ko fixed width diya */}
      <div className={`rounded-xl border shadow-lg overflow-hidden ${isDarkMode ? "bg-gray-900/30 border-gray-700/50" : "bg-white border-gray-200/70"}`}>
        <div className={`px-6 py-5 border-b font-semibold text-lg flex items-center justify-between ${isDarkMode ? "bg-gradient-to-r from-indigo-950/70 to-purple-950/50 text-indigo-200 border-gray-700/60" : "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-800 border-indigo-200/40"}`}>
          <div className="flex items-center gap-3">
            <AlertCircle className={`w-6 h-6 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
            Pending Payments
          </div>
          <span className="text-sm font-medium opacity-90">
            Showing {displayedData.length} of {filteredData.length} records
          </span>
        </div>

        {filteredData.length === 0 ? (
          <div className="py-16 text-center">
            <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              No matching records found with current filters
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead className={`${isDarkMode ? "bg-gray-800/40" : "bg-gray-100/80"}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Date</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Site</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Vendor</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Exp. Head</th>
                    <th className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider w-32 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Bill No</th> {/* ← fixed width */}
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Net Amount</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Paid</th>
                    <th className={`px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Balance</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDarkMode ? "divide-gray-800/40" : "divide-gray-200/40"}`}>
                  {displayedData.map((item, index) => (
                    <tr
                      key={index}
                      className={`transition-colors hover:bg-opacity-50 ${isDarkMode ? "hover:bg-indigo-950/30" : "hover:bg-indigo-50/30"}`}
                    >
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.date}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.siteName}</td>
                      <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{item.vendorName}</td>
                      <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.expHead}</td>
                      <td className={`px-6 py-4 text-sm truncate max-w-[120px] ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {item.billNo}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-800"}`}>
                        ₹{item.netAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 text-right text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                        ₹{item.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`px-6 py-4 text-right text-lg font-bold ${item.balance > 0 ? "text-rose-500" : "text-emerald-500"}`}>
                        ₹{Math.abs(item.balance).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        {item.balance < 0 && <span className="text-xs ml-1 opacity-70">(advance)</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length > 10 && (
              <div className={`px-6 py-5 border-t text-center ${isDarkMode ? "bg-gray-900/30 border-gray-700/50" : "bg-gray-50 border-gray-200"}`}>
                <button
                  onClick={() => setShowAll(!showAll)}
                  className={`px-8 py-3 rounded-xl font-medium transition-all shadow-sm ${isDarkMode ? "bg-indigo-600/80 hover:bg-indigo-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
                >
                  {showAll ? "Show Top 10 Only" : `Show All ${filteredData.length} Records`}
                </button>
              </div>
            )}
          </>
        )}

        <div className={`px-6 py-5 border-t font-bold text-right text-lg flex justify-between items-center ${isDarkMode ? "bg-gray-900/40 border-gray-700/60 text-indigo-300" : "bg-gray-50 border-gray-200 text-indigo-800"}`}>
          <span>Total Outstanding (filtered):</span>
          <span className={totalOutstanding >= 0 ? "text-rose-500" : "text-emerald-500"}>
            ₹{Math.abs(totalOutstanding).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};



const Summary = () => {
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";
  const [activeTab, setActiveTab] = useState("summary");
  const [period, setPeriod] = useState("all");
  const [filters, setFilters] = useState({
    siteNames: [],
    bankNames: [],
    expHeads: [],
  });

  const currentDate = new Date();
  const { data: apiData, isLoading, isError, error, refetch } = useGetMainBankSummaryQuery();

  const apiTotalIn = useMemo(() => parseAmount(apiData?.inTotal), [apiData]);
  const apiTotalOut = useMemo(() => parseAmount(apiData?.outTotal), [apiData]);
  const apiNetBalance = useMemo(() => parseAmount(apiData?.netBalance), [apiData]);

  const processedTransactions = useMemo(() => {
    const transactions = apiData?.transactions || [];
    if (!Array.isArray(transactions)) return [];

    return transactions
      .map(t => {
        const inAmt = parseAmount(t.inAmount);
        const outAmt = parseAmount(t.outAmount);
        return {
          ...t,
          date: parseDate(t.date),
          amount: inAmt > 0 ? inAmt : outAmt,
          type: inAmt > 0 ? "in" : "out",
          category: t.expHead || t.siteName || "General",
        };
      })
      .filter(t => t.date !== null);
  }, [apiData]);

  const allUniqueOptions = useMemo(() => ({
    siteNames: ["All", ...new Set(processedTransactions.map(t => t.siteName || "").filter(Boolean))].sort(),
    bankNames: ["All", ...new Set(processedTransactions.map(t => t.bankName || "").filter(Boolean))].sort(),
    expHeads: ["All", ...new Set(processedTransactions.map(t => t.category || "").filter(Boolean))].sort(),
  }), [processedTransactions]);

  const cascadingOptions = useMemo(() => {
    let data = processedTransactions;
    if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) {
      data = data.filter(t => filters.siteNames.includes(t.siteName));
    }
    const bankNames = ["All", ...new Set(data.map(t => t.bankName || "").filter(Boolean))].sort();
    if (filters.bankNames.length > 0 && !filters.bankNames.includes("All")) {
      data = data.filter(t => filters.bankNames.includes(t.bankName));
    }
    const expHeads = ["All", ...new Set(data.map(t => t.category || "").filter(Boolean))].sort();

    return { siteNames: allUniqueOptions.siteNames, bankNames, expHeads };
  }, [processedTransactions, filters, allUniqueOptions]);

  const finalFilteredData = useMemo(() => {
    let data = processedTransactions;

    let startDate = new Date(0);
    if (period === "1y") startDate.setFullYear(currentDate.getFullYear() - 1);
    else if (period === "6m") startDate.setMonth(currentDate.getMonth() - 6);
    else if (period === "3m") startDate.setMonth(currentDate.getMonth() - 3);
    else if (period === "1m") startDate.setMonth(currentDate.getMonth() - 1);
    else if (period === "2w") startDate.setDate(currentDate.getDate() - 14);
    else if (period === "1w") startDate.setDate(currentDate.getDate() - 7);

    data = data.filter(t => t.date >= startDate);

    if (filters.siteNames.length > 0 && !filters.siteNames.includes("All")) data = data.filter(t => filters.siteNames.includes(t.siteName));
    if (filters.bankNames.length > 0 && !filters.bankNames.includes("All")) data = data.filter(t => filters.bankNames.includes(t.bankName));
    if (filters.expHeads.length > 0 && !filters.expHeads.includes("All")) data = data.filter(t => filters.expHeads.includes(t.category));

    return data;
  }, [processedTransactions, period, currentDate, filters]);

  const totalIn = useMemo(() => {
    if (period === "all" && filters.siteNames.length === 0 && filters.bankNames.length === 0 && filters.expHeads.length === 0) return apiTotalIn;
    return finalFilteredData.filter(t => t.type === "in").reduce((sum, t) => sum + t.amount, 0);
  }, [finalFilteredData, period, apiTotalIn, filters]);

  const totalOut = useMemo(() => {
    if (period === "all" && filters.siteNames.length === 0 && filters.bankNames.length === 0 && filters.expHeads.length === 0) return apiTotalOut;
    return finalFilteredData.filter(t => t.type === "out").reduce((sum, t) => sum + t.amount, 0);
  }, [finalFilteredData, period, apiTotalOut, filters]);

  const balance = totalIn - totalOut;

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [totalIn, Math.abs(totalOut)],
      backgroundColor: ["#10b981", "#f43f5e"],
      hoverOffset: 12,
      borderWidth: 0,
    }],
  };

  const barChartData = useMemo(() => {
    if (finalFilteredData.length === 0) return { labels: [], datasets: [] };

    const monthlyData = {};
    finalFilteredData.forEach(t => {
      if (!t.date) return;
      const monthYear = t.date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      monthlyData[monthYear] = monthlyData[monthYear] || { income: 0, expense: 0 };
      if (t.type === "in") monthlyData[monthYear].income += t.amount;
      else monthlyData[monthYear].expense += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b));

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Income",
          data: sortedMonths.map(m => monthlyData[m].income),
          backgroundColor: "rgba(16, 185, 129, 0.75)",
          borderColor: "#10b981",
          borderWidth: 1,
          borderRadius: 8,
        },
        {
          label: "Expense",
          data: sortedMonths.map(m => monthlyData[m].expense),
          backgroundColor: "rgba(244, 63, 94, 0.75)",
          borderColor: "#f43f5e",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [finalFilteredData]);

  const activeFiltersCount = filters.siteNames.length + filters.bankNames.length + filters.expHeads.length;

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading financial data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
        <div className={`rounded-2xl border p-8 max-w-md text-center ${isDarkMode ? "bg-red-900/30 border-red-700/40" : "bg-red-50/80 border-red-200"}`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-red-300" : "text-red-700"}`}>Error Loading Data</h2>
          <p className={`mb-6 ${isDarkMode ? "text-red-200" : "text-red-800"}`}>{error?.data?.message || error?.message || "Failed to fetch financial summary"}</p>
          <button onClick={refetch} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
            <RefreshCw className="w-5 h-5" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
        <div className={`rounded-2xl border p-8 max-w-md text-center ${isDarkMode ? "bg-indigo-900/30 border-indigo-700/40" : "bg-indigo-50/70 border-indigo-200"}`}>
          <Wallet className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>No Data Available</h2>
          <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Unable to load financial data</p>
          <button onClick={refetch} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
            <RefreshCw className="w-5 h-5" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  const hasNoTransactionsInPeriod = finalFilteredData.length === 0;

  return (
    <div className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full 
      ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`} style={{ scrollBehavior: "smooth" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-purple-700" : "bg-purple-300/40"}`}></div>
        <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow ${isDarkMode ? "bg-blue-700" : "bg-blue-300/40"}`} style={{ animationDelay: "3s" }}></div>
        <div className={`absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-indigo-800" : "bg-indigo-300/40"}`} style={{ animationDelay: "6s" }}></div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isDarkMode ? "bg-white opacity-15" : "bg-indigo-500 opacity-25"}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full space-y-8 lg:space-y-10">
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 ${isDarkMode ? "bg-black/70 border-indigo-700/60" : "bg-white/90 border-indigo-200/80"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-3 ${isDarkMode ? "from-indigo-200 via-purple-200 to-indigo-200" : "from-indigo-700 via-purple-700 to-indigo-700"}`}>
                <Wallet className={`w-10 h-10 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Financial Dashboard
              </h1>
              <p className={`mt-2 text-lg ${isDarkMode ? "text-indigo-300/80" : "text-indigo-700/80"}`}>Complete overview of your finances</p>
            </div>

            <button onClick={refetch} className={`px-4 py-2.5 border rounded-xl transition-all flex items-center gap-2 justify-center ${isDarkMode ? "bg-black/50 border-indigo-600/50 hover:bg-white/10 text-white" : "bg-white/60 border-indigo-300/60 hover:bg-gray-100 text-gray-800"}`} title="Refresh data">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8">
            <div className={`border-2 p-1.5 rounded-xl shadow-lg inline-flex flex-wrap gap-1 ${isDarkMode ? "bg-black/50 border-indigo-600/50" : "bg-white/60 border-indigo-300/60"}`}>
              {["summary", "bankBalance", "outstanding"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg text-base font-semibold transition-all flex items-center gap-2 ${activeTab === tab ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {tab === "summary" && <ListOrdered className="w-5 h-5" />}
                  {tab === "bankBalance" && <Building2 className="w-5 h-5" />}
                  {tab === "outstanding" && <AlertCircle className="w-5 h-5" />}
                  {tab === "summary" ? "Summary" : tab === "bankBalance" ? "Bank Balance" : "Outstanding"}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "summary" && (
            <>
              <div className="mt-8">
                <div className={`border p-1.5 rounded-xl shadow-lg flex flex-wrap ${isDarkMode ? "bg-black/50 border-indigo-600/50" : "bg-white/60 border-indigo-300/60"}`}>
                  {["all", "1y", "6m", "3m", "1m", "2w", "1w"].map(p => (
                    <button
                      key={p}
                      onClick={() => setPeriod(p)}
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${period === p ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md" : isDarkMode ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
                    >
                      {p === "all" ? "All Time" : p.replace(/(\d)([a-z])/gi, "$1 $2").toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-6 relative z-[100]">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                    <Search className="w-5 h-5" /> Filter Data
                    {activeFiltersCount > 0 && (
                      <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${isDarkMode ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>{activeFiltersCount} active</span>
                    )}
                  </h3>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={() => setFilters({ siteNames: [], bankNames: [], expHeads: [] })}
                      className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "bg-gray-900/60 border-gray-700 hover:border-red-500 text-red-400 hover:bg-red-900/20" : "bg-white border-gray-300 hover:border-red-400 text-red-600 hover:bg-red-50"}`}
                    >
                      <X className="w-4 h-4" /> Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <MultiSelectFilter
                    label="Site Name"
                    value={filters.siteNames}
                    onChange={vals => setFilters(p => ({ ...p, siteNames: vals, bankNames: [], expHeads: [] }))}
                    options={cascadingOptions.siteNames}
                    placeholder="Search & select sites..."
                    isDarkMode={isDarkMode}
                  />
                  <MultiSelectFilter
                    label="Bank Name"
                    value={filters.bankNames}
                    onChange={vals => setFilters(p => ({ ...p, bankNames: vals, expHeads: [] }))}
                    options={cascadingOptions.bankNames}
                    placeholder="Search & select banks..."
                    isDarkMode={isDarkMode}
                  />
                  <MultiSelectFilter
                    label="Expense Head"
                    value={filters.expHeads}
                    onChange={vals => setFilters(p => ({ ...p, expHeads: vals }))}
                    options={cascadingOptions.expHeads}
                    placeholder="Search & select heads..."
                    isDarkMode={isDarkMode}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {activeTab === "summary" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full z-10">
              <StatCard title="Total Income" amount={totalIn} color="emerald" icon={<ArrowDownCircle />} isDarkMode={isDarkMode} />
              <StatCard title="Total Expenses" amount={Math.abs(totalOut)} color="rose" icon={<ArrowUpCircle />} isDarkMode={isDarkMode} />
              <StatCard title="Net Balance" amount={balance} color={balance >= 0 ? "emerald" : "rose"} icon={<Wallet />} isBalance isDarkMode={isDarkMode} balanceValue={balance} />
            </div>

            {hasNoTransactionsInPeriod && (
              <div className={`rounded-2xl border p-6 text-center ${isDarkMode ? "bg-yellow-900/30 border-yellow-700/40" : "bg-yellow-50/70 border-yellow-300/60"}`}>
                <p className={`text-lg ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>No transactions found for the selected period and filters</p>
                <button onClick={() => { setPeriod("all"); setFilters({ siteNames: [], bankNames: [], expHeads: [] }); }} className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                  Reset All
                </button>
              </div>
            )}

            {finalFilteredData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
                <div className={`lg:col-span-2 rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      <Calendar className={`w-7 h-7 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Transaction Trend
                    </h3>
                    <span className={`px-4 py-2 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100/70 text-indigo-700"}`}>
                      {period === "all" ? "All Time" : `Last ${period.replace(/(\d)([a-z])/gi, "$1 $2")}`}
                    </span>
                  </div>
                  <div className="h-[420px] lg:h-[480px] w-full">
                    <Bar
                      data={barChartData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: { position: "top", labels: { color: isDarkMode ? "#e5e7eb" : "#374151", font: { size: 14, weight: "bold" }, padding: 20, usePointStyle: true } },
                          tooltip: {
                            backgroundColor: isDarkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
                            titleColor: isDarkMode ? "#e5e7eb" : "#111827",
                            bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
                            cornerRadius: 10,
                            padding: 12,
                            callbacks: { label: ctx => `${ctx.dataset.label}: ₹${ctx.parsed.y.toLocaleString("en-IN")}` },
                          },
                        },
                        scales: {
                          y: { beginAtZero: true, grid: { color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" }, callback: v => "₹" + v.toLocaleString("en-IN") } },
                          x: { grid: { display: false }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" } } },
                        },
                      }}
                    />
                  </div>
                </div>

                <div className={`rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
                  <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Income vs Expenses</h3>
                  <div className="h-72 lg:h-80 flex items-center justify-center w-full">
                    <Pie
                      data={pieData}
                      options={{
                        maintainAspectRatio: false,
                        responsive: true,
                        plugins: {
                          legend: { position: "bottom", labels: { color: isDarkMode ? "#e5e7eb" : "#374151", font: { weight: "bold", size: 14 }, padding: 20, usePointStyle: true } },
                          tooltip: {
                            backgroundColor: isDarkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
                            titleColor: isDarkMode ? "#e5e7eb" : "#111827",
                            bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
                            padding: 12,
                            cornerRadius: 10,
                            callbacks: { label: ctx => `${ctx.label}: ₹${ctx.parsed.toLocaleString("en-IN")}` },
                          },
                        },
                      }}
                    />
                  </div>
                  <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? "border-indigo-700/30" : "border-indigo-200/30"}`}>
                    <p className={`text-sm uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Savings Rate</p>
                    <p className={`text-3xl lg:text-4xl font-bold ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {totalIn > 0 ? ((balance / totalIn) * 100).toFixed(1) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {finalFilteredData.length > 0 && (
              <div className={`rounded-2xl border overflow-hidden shadow-2xl w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
                <div className={`p-6 md:p-8 lg:p-10 border-b ${isDarkMode ? "bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-700/40" : "bg-gradient-to-r from-indigo-100/70 to-purple-100/70 border-indigo-200/40"}`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                      <ListOrdered className={`w-7 h-7 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Recent Transactions
                    </h3>
                    <span className={`px-5 py-2 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100/70 text-indigo-700"}`}>
                      {finalFilteredData.length} Records
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left min-w-[900px]">
                    <thead className={`bg-opacity-50 ${isDarkMode ? "bg-black/50" : "bg-gray-100/80"}`}>
                      <tr>
                        <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Date</th>
                        <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Site Name</th>
                        <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Category</th>
                        <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Type</th>
                        <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider text-right ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Amount</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDarkMode ? "divide-gray-800/50" : "divide-gray-200/50"}`}>
                      {finalFilteredData.slice(0, 10).map((t, i) => (
                        <tr key={i} className={`hover:bg-opacity-30 transition-colors duration-150 ${isDarkMode ? "hover:bg-indigo-950/30" : "hover:bg-indigo-50/30"}`}>
                          <td className={`px-6 py-5 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{t.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className={`px-6 py-5 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{t.siteName || "-"}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-gray-800/70 text-gray-200" : "bg-gray-200/70 text-gray-800"}`}>{t.category}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold uppercase border ${t.type === "in" ? (isDarkMode ? "bg-emerald-900/50 text-emerald-300 border-emerald-700/40" : "bg-emerald-100/70 text-emerald-800 border-emerald-300/60") : isDarkMode ? "bg-rose-900/50 text-rose-300 border-rose-700/40" : "bg-rose-100/70 text-rose-800 border-rose-300/60"}`}>
                              {t.type === "in" ? "↓ Income" : "↑ Expense"}
                            </span>
                          </td>
                          <td className={`px-6 py-5 text-right text-lg lg:text-xl font-bold ${t.type === "in" ? "text-emerald-500" : "text-rose-500"}`}>
                            {t.type === "in" ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {finalFilteredData.length > 10 && (
                  <div className={`p-6 lg:p-8 border-t text-center ${isDarkMode ? "bg-black/40 border-indigo-700/30" : "bg-gray-50/70 border-indigo-200/30"}`}>
                    <button className="px-8 py-3 lg:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg text-base lg:text-lg">
                      View All Transactions
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "bankBalance" && <BankBalance isDarkMode={isDarkMode} />}
        {activeTab === "outstanding" && <Outstanding isDarkMode={isDarkMode} />}
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? "-" : ""}30px, -60px); }
        }
        .animate-pulse-slow { animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${isDarkMode ? "rgba(17, 24, 39, 0.5)" : "rgba(243, 244, 246, 0.5)"}; border-radius: 5px; }
        ::-webkit-scrollbar-thumb { background: ${isDarkMode ? "rgba(99, 102, 241, 0.5)" : "rgba(99, 102, 241, 0.3)"}; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? "rgba(99, 102, 241, 0.7)" : "rgba(99, 102, 241, 0.5)"}; }
      `}</style>
    </div>
  );
};

export default Summary;