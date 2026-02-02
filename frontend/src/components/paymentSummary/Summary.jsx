
// import React, { useState, useMemo, useRef, useEffect } from "react";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   Title,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Filler,
// } from "chart.js";
// import { Pie, Bar } from "react-chartjs-2";
// import {
//   ArrowUpCircle,
//   ArrowDownCircle,
//   Wallet,
//   ListOrdered,
//   Calendar,
//   RefreshCw,
//   X,
//   Search,
// } from "lucide-react";
// import { useGetMainBankSummaryQuery } from "../../features/Summary/mainSummarySlice";

// // Register ChartJS components
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   Title,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Filler
// );

// // Helper functions
// const parseAmount = (amountStr) => {
//   if (!amountStr) return 0;
//   return parseFloat(amountStr.replace(/,/g, "")) || 0;
// };

// const parseDate = (dateStr) => {
//   if (!dateStr) return null;
//   const [datePart] = dateStr.split(" ");
//   const [day, month, year] = datePart.split("/");
//   return new Date(`${year}-${month}-${day}`);
// };

// // Professional Searchable Input Filter Component
// const SearchableInputFilter = ({ label, value, onChange, options, placeholder, isDarkMode }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [inputValue, setInputValue] = useState(value || "");
//   const dropdownRef = useRef(null);

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setInputValue(value || "");
//   }, [value]);

//   const filteredOptions = options.filter((option) => {
//     if (option === "All") return true;
//     return option.toLowerCase().includes(inputValue.toLowerCase());
//   });

//   const handleInputChange = (e) => {
//     const newValue = e.target.value;
//     setInputValue(newValue);
//     setIsOpen(true);

//     const exactMatch = options.find(opt => opt.toLowerCase() === newValue.toLowerCase());
//     if (exactMatch && exactMatch !== "All") {
//       onChange(exactMatch);
//     } else if (newValue === "") {
//       onChange("");
//     }
//   };

//   const handleSelect = (option) => {
//     const selectedValue = option === "All" ? "" : option;
//     setInputValue(selectedValue);
//     onChange(selectedValue);
//     setIsOpen(false);
//   };

//   const handleFocus = () => {
//     setIsOpen(true);
//   };

//   const handleClear = () => {
//     setInputValue("");
//     onChange("");
//     setIsOpen(true);
//   };

//   return (
//     <div className="relative z-[150]" ref={dropdownRef}>
//       <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
//         {label}
//       </label>

//       <div className="relative">
//         <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />

//         <input
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           autoComplete="off"
//           className={`w-full pl-11 pr-10 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 
//             ${isDarkMode 
//               ? "bg-gray-900/60 border-gray-700 hover:border-indigo-500 text-white placeholder-gray-500" 
//               : "bg-white border-gray-300 hover:border-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"}
//             ${isOpen ? "ring-2 ring-indigo-500" : ""}`}
//         />

//         {inputValue && (
//           <button
//             type="button"
//             onClick={handleClear}
//             className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors 
//               ${isDarkMode 
//                 ? "text-gray-400 hover:text-white hover:bg-gray-700" 
//                 : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
//           >
//             <X className="w-4 h-4" />
//           </button>
//         )}
//       </div>

//       {isOpen && filteredOptions.length > 0 && (
//         <div 
//           className={`absolute z-[999] w-full mt-2 rounded-xl shadow-2xl border-2 overflow-hidden 
//             ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
//           style={{ maxHeight: "280px" }}
//         >
//           <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
//             {filteredOptions.map((option, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => handleSelect(option)}
//                 className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center justify-between 
//                   ${(option === "All" && !value) || option === value 
//                     ? isDarkMode ? "bg-indigo-900/50 text-indigo-300 font-semibold" : "bg-indigo-100 text-indigo-800 font-semibold"
//                     : isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-900 hover:bg-gray-50"}`}
//               >
//                 <span className="truncate">{option === "All" ? "All" : option}</span>
//                 {((option === "All" && !value) || option === value) && (
//                   <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${isDarkMode ? "bg-indigo-400" : "bg-indigo-600"}`} />
//                 )}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {isOpen && filteredOptions.length === 0 && inputValue && (
//         <div 
//           className={`absolute z-[999] w-full mt-2 rounded-xl shadow-2xl border-2 p-4 text-center 
//             ${isDarkMode ? "bg-gray-900 border-gray-700 text-gray-500" : "bg-white border-gray-200 text-gray-400"}`}
//         >
//           No results found
//         </div>
//       )}
//     </div>
//   );
// };

// const Summary = () => {
//   const isDarkMode = localStorage.getItem("isDarkMode") === "true";
//   const [period, setPeriod] = useState("all");
//   const [filters, setFilters] = useState({
//     siteName: "",
//     bankName: "",
//     expHead: "",
//   });

//   const currentDate = new Date();
//   const {
//     data: apiData,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useGetMainBankSummaryQuery();

//   const apiTotalIn = useMemo(() => parseAmount(apiData?.inTotal), [apiData]);
//   const apiTotalOut = useMemo(() => parseAmount(apiData?.outTotal), [apiData]);
//   const apiNetBalance = useMemo(() => parseAmount(apiData?.netBalance), [apiData]);

//   const processedTransactions = useMemo(() => {
//     const transactions = apiData?.transactions || [];
//     if (!Array.isArray(transactions) || transactions.length === 0) return [];

//     return transactions
//       .map((t) => {
//         const inAmt = parseAmount(t.inAmount);
//         const outAmt = parseAmount(t.outAmount);
//         return {
//           ...t,
//           date: parseDate(t.date),
//           amount: inAmt > 0 ? inAmt : outAmt,
//           type: inAmt > 0 ? "in" : "out",
//           category: t.expHead || t.siteName || "General",
//           inAmountNum: inAmt,
//           outAmountNum: outAmt,
//         };
//       })
//       .filter((t) => t.date !== null);
//   }, [apiData]);

//   const allUniqueOptions = useMemo(() => {
//     return {
//       siteNames: ["All", ...new Set(processedTransactions.map((t) => t.siteName || "").filter(Boolean))].sort(),
//       bankNames: ["All", ...new Set(processedTransactions.map((t) => t.bankName || "").filter(Boolean))].sort(),
//       expHeads: ["All", ...new Set(processedTransactions.map((t) => t.category || "").filter(Boolean))].sort(),
//     };
//   }, [processedTransactions]);

//   const cascadingOptions = useMemo(() => {
//     let data = processedTransactions;
//     if (filters.siteName) {
//       data = data.filter((t) => t.siteName === filters.siteName);
//     }
//     const bankNames = ["All", ...new Set(data.map((t) => t.bankName || "").filter(Boolean))].sort();

//     if (filters.bankName) {
//       data = data.filter((t) => t.bankName === filters.bankName);
//     }
//     const expHeads = ["All", ...new Set(data.map((t) => t.category || "").filter(Boolean))].sort();

//     return {
//       siteNames: allUniqueOptions.siteNames,
//       bankNames,
//       expHeads,
//     };
//   }, [processedTransactions, filters.siteName, filters.bankName, allUniqueOptions]);

//   const finalFilteredData = useMemo(() => {
//     let data = processedTransactions;

//     let startDate = new Date(currentDate);
//     if (period === "1y") startDate.setFullYear(currentDate.getFullYear() - 1);
//     else if (period === "6m") startDate.setMonth(currentDate.getMonth() - 6);
//     else if (period === "3m") startDate.setMonth(currentDate.getMonth() - 3);
//     else if (period === "1m") startDate.setMonth(currentDate.getMonth() - 1);
//     else startDate = new Date(0);

//     data = data.filter((t) => t.date >= startDate);

//     if (filters.siteName) {
//       data = data.filter((t) => t.siteName === filters.siteName);
//     }
//     if (filters.bankName) {
//       data = data.filter((t) => t.bankName === filters.bankName);
//     }
//     if (filters.expHead) {
//       data = data.filter((t) => t.category === filters.expHead);
//     }

//     return data;
//   }, [processedTransactions, period, currentDate, filters]);

//   const totalIn = useMemo(() => {
//     if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
//       return apiTotalIn;
//     }
//     return finalFilteredData
//       .filter((t) => t.type === "in")
//       .reduce((sum, t) => sum + t.amount, 0);
//   }, [finalFilteredData, period, apiTotalIn, filters]);

//   const totalOut = useMemo(() => {
//     if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
//       return apiTotalOut;
//     }
//     return finalFilteredData
//       .filter((t) => t.type === "out")
//       .reduce((sum, t) => sum + t.amount, 0);
//   }, [finalFilteredData, period, apiTotalOut, filters]);

//   const balance = useMemo(() => {
//     if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
//       return apiNetBalance;
//     }
//     return totalIn - totalOut;
//   }, [totalIn, totalOut, period, apiNetBalance, filters]);

//   const pieData = {
//     labels: ["Income", "Expense"],
//     datasets: [
//       {
//         data: [totalIn, Math.abs(totalOut)],
//         backgroundColor: ["#10b981", "#f43f5e"],
//         hoverOffset: 12,
//         borderWidth: 0,
//       },
//     ],
//   };

//   const barChartData = useMemo(() => {
//     if (finalFilteredData.length === 0) return { labels: [], datasets: [] };

//     const monthlyData = {};
//     finalFilteredData.forEach((t) => {
//       if (!t.date) return;
//       const monthYear = t.date.toLocaleDateString("en-IN", {
//         month: "short",
//         year: "numeric",
//       });
//       if (!monthlyData[monthYear]) {
//         monthlyData[monthYear] = { income: 0, expense: 0 };
//       }
//       if (t.type === "in") monthlyData[monthYear].income += t.amount;
//       else monthlyData[monthYear].expense += t.amount;
//     });

//     const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
//       const dateA = new Date(a);
//       const dateB = new Date(b);
//       return dateA - dateB;
//     });

//     return {
//       labels: sortedMonths,
//       datasets: [
//         {
//           label: "Income",
//           data: sortedMonths.map((m) => monthlyData[m].income),
//           backgroundColor: "rgba(16, 185, 129, 0.75)",
//           borderColor: "#10b981",
//           borderWidth: 1,
//           borderRadius: 8,
//         },
//         {
//           label: "Expense",
//           data: sortedMonths.map((m) => monthlyData[m].expense),
//           backgroundColor: "rgba(244, 63, 94, 0.75)",
//           borderColor: "#f43f5e",
//           borderWidth: 1,
//           borderRadius: 8,
//         },
//       ],
//     };
//   }, [finalFilteredData]);

//   const activeFiltersCount = [filters.siteName, filters.bankName, filters.expHead].filter(Boolean).length;

//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"}`}>Loading financial data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
//         <div className={`rounded-2xl border p-8 max-w-md text-center ${isDarkMode ? "bg-red-900/30 border-red-700/40" : "bg-red-50/80 border-red-200"}`}>
//           <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-red-300" : "text-red-700"}`}>Error Loading Data</h2>
//           <p className={`mb-6 ${isDarkMode ? "text-red-200" : "text-red-800"}`}>
//             {error?.data?.message || error?.message || "Failed to fetch financial summary"}
//           </p>
//           <button
//             onClick={() => refetch()}
//             className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
//           >
//             <RefreshCw className="w-5 h-5" /> Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!apiData) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}>
//         <div className={`rounded-2xl border p-8 max-w-md text-center ${isDarkMode ? "bg-indigo-900/30 border-indigo-700/40" : "bg-indigo-50/70 border-indigo-200"}`}>
//           <Wallet className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} />
//           <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>No Data Available</h2>
//           <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Unable to load financial data</p>
//           <button
//             onClick={() => refetch()}
//             className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
//           >
//             <RefreshCw className="w-5 h-5" /> Refresh
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const hasNoTransactionsInPeriod = finalFilteredData.length === 0;

//   return (
//     <div
//       className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full 
//         ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}
//       style={{ scrollBehavior: "smooth" }}
//     >
//       {/* Animated background orbs */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className={`absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-purple-700" : "bg-purple-300/40"}`}></div>
//         <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow ${isDarkMode ? "bg-blue-700" : "bg-blue-300/40"}`} style={{ animationDelay: "3s" }}></div>
//         <div className={`absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-indigo-800" : "bg-indigo-300/40"}`} style={{ animationDelay: "6s" }}></div>
//       </div>

//       {/* Floating particles */}
//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(30)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isDarkMode ? "bg-white opacity-15" : "bg-indigo-500 opacity-25"}`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${10 + Math.random() * 15}s linear infinite`,
//               animationDelay: `${Math.random() * 12}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="relative z-10 w-full space-y-8 lg:space-y-10">
//         {/* Header - backdrop-blur हटा दिया */}
//         <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 
//           ${isDarkMode ? "bg-black/70 border-indigo-700/60" : "bg-white/90 border-indigo-200/80"}`}>
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//             <div>
//               <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-3 ${isDarkMode ? "from-indigo-200 via-purple-200 to-indigo-200" : "from-indigo-700 via-purple-700 to-indigo-700"}`}>
//                 <Wallet className={`w-10 h-10 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Financial Summary
//               </h1>
//               <p className={`mt-2 text-lg ${isDarkMode ? "text-indigo-300/80" : "text-indigo-700/80"}`}>
//                 Overview of income, expenses & balance
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={() => refetch()}
//                 className={`px-4 py-2.5 border rounded-xl transition-all flex items-center gap-2 justify-center ${isDarkMode ? "bg-black/50 border-indigo-600/50 hover:bg-white/10 text-white" : "bg-white/60 border-indigo-300/60 hover:bg-gray-100 text-gray-800"}`}
//                 title="Refresh data"
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>

//               <div className={`border p-1.5 rounded-xl shadow-lg flex flex-wrap ${isDarkMode ? "bg-black/50 border-indigo-600/50" : "bg-white/60 border-indigo-300/60"}`}>
//                 {["all", "1y", "6m", "3m", "1m"].map((p) => (
//                   <button
//                     key={p}
//                     onClick={() => setPeriod(p)}
//                     className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
//                       period === p
//                         ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
//                         : isDarkMode
//                         ? "text-gray-300 hover:bg-white/10"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {p === "all" ? "All Time" : p.toUpperCase()}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Filters */}
//           <div className="mt-8 space-y-6 relative z-[100]">
//             <div className="flex items-center justify-between">
//               <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                 <Search className="w-5 h-5" />
//                 Filter Data
//                 {activeFiltersCount > 0 && (
//                   <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${isDarkMode ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
//                     {activeFiltersCount} active
//                   </span>
//                 )}
//               </h3>

//               {activeFiltersCount > 0 && (
//                 <button
//                   onClick={() => setFilters({ siteName: "", bankName: "", expHead: "" })}
//                   className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "bg-gray-900/60 border-gray-700 hover:border-red-500 text-red-400 hover:bg-red-900/20" : "bg-white border-gray-300 hover:border-red-400 text-red-600 hover:bg-red-50"}`}
//                 >
//                   <X className="w-4 h-4" /> Clear All
//                 </button>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               <SearchableInputFilter
//                 label="Site Name"
//                 value={filters.siteName}
//                 onChange={(val) => setFilters((prev) => ({ ...prev, siteName: val, bankName: "", expHead: "" }))}
//                 options={cascadingOptions.siteNames}
//                 placeholder="Type or select site..."
//                 isDarkMode={isDarkMode}
//               />
//               <SearchableInputFilter
//                 label="Bank Name"
//                 value={filters.bankName}
//                 onChange={(val) => setFilters((prev) => ({ ...prev, bankName: val, expHead: "" }))}
//                 options={cascadingOptions.bankNames}
//                 placeholder="Type or select bank..."
//                 isDarkMode={isDarkMode}
//               />
//               <SearchableInputFilter
//                 label="Expense Head"
//                 value={filters.expHead}
//                 onChange={(val) => setFilters((prev) => ({ ...prev, expHead: val }))}
//                 options={cascadingOptions.expHeads}
//                 placeholder="Type or select head..."
//                 isDarkMode={isDarkMode}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full z-10">
//           <StatCard
//             title="Total Income"
//             amount={totalIn}
//             color="emerald"
//             icon={<ArrowDownCircle />}
//             isDarkMode={isDarkMode}
//           />
//           <StatCard
//             title="Total Expenses"
//             amount={Math.abs(totalOut)}
//             color="rose"
//             icon={<ArrowUpCircle />}
//             isDarkMode={isDarkMode}
//           />
//           <StatCard
//             title="Net Balance"
//             amount={balance}
//             color={balance >= 0 ? "emerald" : "rose"}
//             icon={<Wallet />}
//             isBalance
//             isDarkMode={isDarkMode}
//             balanceValue={balance}
//           />
//         </div>

//         {hasNoTransactionsInPeriod && (
//           <div className={`rounded-2xl border p-6 text-center ${isDarkMode ? "bg-yellow-900/30 border-yellow-700/40" : "bg-yellow-50/70 border-yellow-300/60"}`}>
//             <p className={`text-lg ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>
//               No transactions found for the selected period and filters
//             </p>
//             <button
//               onClick={() => {
//                 setPeriod("all");
//                 setFilters({ siteName: "", bankName: "", expHead: "" });
//               }}
//               className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
//             >
//               Reset All
//             </button>
//           </div>
//         )}

//         {finalFilteredData.length > 0 && (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
//             {/* Bar Chart */}
//             <div className={`lg:col-span-2 rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                 <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                   <Calendar className={`w-7 h-7 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Transaction Trend
//                 </h3>
//                 <span className={`px-4 py-2 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100/70 text-indigo-700"}`}>
//                   {period === "all" ? "All Time" : `Last ${period.toUpperCase()}`}
//                 </span>
//               </div>

//               <div className="h-[420px] lg:h-[480px] w-full">
//                 <Bar
//                   data={barChartData}
//                   options={{
//                     maintainAspectRatio: false,
//                     responsive: true,
//                     plugins: {
//                       legend: { position: "top", labels: { color: isDarkMode ? "#e5e7eb" : "#374151", font: { size: 14, weight: "bold" }, padding: 20, usePointStyle: true } },
//                       tooltip: {
//                         backgroundColor: isDarkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
//                         titleColor: isDarkMode ? "#e5e7eb" : "#111827",
//                         bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
//                         cornerRadius: 10,
//                         padding: 12,
//                         callbacks: {
//                           label: (context) => {
//                             let label = context.dataset.label || "";
//                             if (label) label += ": ";
//                             if (context.parsed.y !== null) label += "₹" + context.parsed.y.toLocaleString("en-IN");
//                             return label;
//                           },
//                         },
//                       },
//                     },
//                     scales: {
//                       y: { beginAtZero: true, grid: { color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" }, callback: (v) => "₹" + v.toLocaleString("en-IN") } },
//                       x: { grid: { display: false }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" } } },
//                     },
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Pie Chart */}
//             <div className={`rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
//               <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                 Income vs Expenses
//               </h3>
//               <div className="h-72 lg:h-80 flex items-center justify-center w-full">
//                 <Pie
//                   data={pieData}
//                   options={{
//                     maintainAspectRatio: false,
//                     responsive: true,
//                     plugins: {
//                       legend: { position: "bottom", labels: { color: isDarkMode ? "#e5e7eb" : "#374151", font: { weight: "bold", size: 14 }, padding: 20, usePointStyle: true } },
//                       tooltip: {
//                         backgroundColor: isDarkMode ? "rgba(30,41,59,0.95)" : "rgba(255,255,255,0.95)",
//                         titleColor: isDarkMode ? "#e5e7eb" : "#111827",
//                         bodyColor: isDarkMode ? "#e5e7eb" : "#111827",
//                         padding: 12,
//                         cornerRadius: 10,
//                         callbacks: {
//                           label: (context) => {
//                             let label = context.label || "";
//                             if (label) label += ": ";
//                             if (context.parsed !== null) label += "₹" + context.parsed.toLocaleString("en-IN");
//                             return label;
//                           },
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>

//               <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? "border-indigo-700/30" : "border-indigo-200/30"}`}>
//                 <p className={`text-sm uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//                   Savings Rate
//                 </p>
//                 <p className={`text-3xl lg:text-4xl font-bold ${balance >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
//                   {totalIn > 0 ? ((balance / totalIn) * 100).toFixed(1) : 0}%
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}

//         {finalFilteredData.length > 0 && (
//           <div className={`rounded-2xl border overflow-hidden shadow-2xl w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
//             <div className={`p-6 md:p-8 lg:p-10 border-b ${isDarkMode ? "bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border-indigo-700/40" : "bg-gradient-to-r from-indigo-100/70 to-purple-100/70 border-indigo-200/40"}`}>
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                 <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//                   <ListOrdered className={`w-7 h-7 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Recent Transactions
//                 </h3>
//                 <span className={`px-5 py-2 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100/70 text-indigo-700"}`}>
//                   {finalFilteredData.length} Records
//                 </span>
//               </div>
//             </div>

//             <div className="overflow-x-auto w-full">
//               <table className="w-full text-left min-w-[900px]">
//                 <thead className={`bg-opacity-50 ${isDarkMode ? "bg-black/50" : "bg-gray-100/80"}`}>
//                   <tr>
//                     <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Date</th>
//                     <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Site Name</th>
//                     <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Category</th>
//                     <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Type</th>
//                     <th className={`px-6 py-4 text-sm lg:text-base font-semibold uppercase tracking-wider text-right ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Amount</th>
//                   </tr>
//                 </thead>
//                 <tbody className={`divide-y ${isDarkMode ? "divide-gray-800/50" : "divide-gray-200/50"}`}>
//                   {finalFilteredData.slice(0, 10).map((t, i) => (
//                     <tr
//                       key={`transaction-${i}`}
//                       className={`hover:bg-opacity-30 transition-colors duration-150 ${isDarkMode ? "hover:bg-indigo-950/30" : "hover:bg-indigo-50/30"}`}
//                     >
//                       <td className={`px-6 py-5 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {t.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
//                       </td>
//                       <td className={`px-6 py-5 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                         {t.siteName || "-"}
//                       </td>
//                       <td className="px-6 py-5">
//                         <span className={`px-3 py-1.5 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-gray-800/70 text-gray-200" : "bg-gray-200/70 text-gray-800"}`}>
//                           {t.category}
//                         </span>
//                       </td>
//                       <td className="px-6 py-5">
//                         <span
//                           className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold uppercase border 
//                             ${t.type === "in"
//                               ? isDarkMode
//                                 ? "bg-emerald-900/50 text-emerald-300 border-emerald-700/40"
//                                 : "bg-emerald-100/70 text-emerald-800 border-emerald-300/60"
//                               : isDarkMode
//                               ? "bg-rose-900/50 text-rose-300 border-rose-700/40"
//                               : "bg-rose-100/70 text-rose-800 border-rose-300/60"}`}
//                         >
//                           {t.type === "in" ? "↓ Income" : "↑ Expense"}
//                         </span>
//                       </td>
//                       <td
//                         className={`px-6 py-5 text-right text-lg lg:text-xl font-bold ${t.type === "in" ? "text-emerald-500" : "text-rose-500"}`}
//                       >
//                         {t.type === "in" ? "+" : "-"} ₹{t.amount.toLocaleString("en-IN")}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {finalFilteredData.length > 10 && (
//               <div className={`p-6 lg:p-8 border-t text-center ${isDarkMode ? "bg-black/40 border-indigo-700/30" : "bg-gray-50/70 border-indigo-200/30"}`}>
//                 <button className="px-8 py-3 lg:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg text-base lg:text-lg">
//                   View All Transactions
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <style jsx global>{`
//         @keyframes float {
//           0%, 100% { transform: translate(0, 0); }
//           50% { transform: translate(${Math.random() > 0.5 ? "" : "-"}30px, -60px); }
//         }
//         .animate-pulse-slow {
//           animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//         @keyframes pulse {
//           0%, 100% { opacity: 0.25; transform: scale(1); }
//           50% { opacity: 0.45; transform: scale(1.1); }
//         }
//         html { scroll-behavior: smooth; }
//         ::-webkit-scrollbar { width: 10px; height: 10px; }
//         ::-webkit-scrollbar-track { background: ${isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(243, 244, 246, 0.5)'}; border-radius: 5px; }
//         ::-webkit-scrollbar-thumb { background: ${isDarkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.3)'}; border-radius: 5px; }
//         ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.5)'}; }
//       `}</style>
//     </div>
//   );
// };

// const StatCard = ({ title, amount, color, icon, isBalance = false, isDarkMode, balanceValue }) => {
//   const colorMap = {
//     emerald: {
//       bg: isDarkMode
//         ? "bg-gradient-to-br from-emerald-900/60 to-teal-900/60"
//         : "bg-gradient-to-br from-emerald-100/85 to-teal-100/75",
//       text: isDarkMode ? "text-emerald-300" : "text-emerald-800",
//       border: isDarkMode ? "border-emerald-700/40" : "border-emerald-300/60",
//       light: isDarkMode ? "bg-emerald-950/30" : "bg-emerald-200/40",
//       titleText: isDarkMode ? "text-gray-400" : "text-gray-700",
//       iconColor: isDarkMode ? "text-white" : "text-emerald-700",
//     },
//     rose: {
//       bg: isDarkMode
//         ? "bg-gradient-to-br from-rose-900/60 to-pink-900/60"
//         : "bg-gradient-to-br from-rose-100/85 to-pink-100/75",
//       text: isDarkMode ? "text-rose-300" : "text-rose-800",
//       border: isDarkMode ? "border-rose-700/40" : "border-rose-300/60",
//       light: isDarkMode ? "bg-rose-950/30" : "bg-rose-200/40",
//       titleText: isDarkMode ? "text-gray-400" : "text-gray-700",
//       iconColor: isDarkMode ? "text-white" : "text-rose-700",
//     },
//   };

//   const colors = colorMap[color] || colorMap.emerald;
//   const safeAmount = typeof amount === "number" && !isNaN(amount) ? amount : 0;

//   let finalIconColor = colors.iconColor;
//   if (isBalance) {
//     finalIconColor = isDarkMode
//       ? (balanceValue >= 0 ? "text-emerald-400" : "text-rose-400")
//       : (balanceValue >= 0 ? "text-emerald-700" : "text-rose-700");
//   }

//   return (
//     <div
//       className={`rounded-2xl border shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden w-full p-6 lg:p-8 
//         ${isDarkMode ? "bg-black/30 border-gray-700/40" : "bg-white/80 border-gray-200/70"}`}
//     >
//       <div className={`absolute -right-10 -top-10 w-40 h-40 ${colors.light} rounded-full blur-3xl`}></div>
//       <div className="relative z-10">
//         <div className="flex justify-between items-start mb-5">
//           <div className={`p-4 rounded-xl ${colors.bg} shadow-lg`}>
//             {React.cloneElement(icon, {
//               size: 28,
//               className: finalIconColor,
//               strokeWidth: isDarkMode ? 2 : 2.2
//             })}
//           </div>
//         </div>
//         <h3 className={`text-sm lg:text-base font-semibold uppercase tracking-wider mb-2 ${colors.titleText}`}>
//           {title}
//         </h3>
//         <p className={`text-3xl md:text-3.5xl lg:text-4xl font-black tracking-tight ${colors.text}`}>
//           ₹{safeAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Summary;




/////////// 



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
} from "lucide-react";
import { useGetMainBankSummaryQuery } from "../../features/Summary/mainSummarySlice";

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

// Helper functions
const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  return parseFloat(amountStr.replace(/,/g, "")) || 0;
};

const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [datePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("/");
  return new Date(`${year}-${month}-${day}`);
};

// Professional Searchable Input Filter Component
const SearchableInputFilter = ({ label, value, onChange, options, placeholder, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const filteredOptions = options.filter((option) => {
    if (option === "All") return true;
    return option.toLowerCase().includes(inputValue.toLowerCase());
  });

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);

    const exactMatch = options.find(opt => opt.toLowerCase() === newValue.toLowerCase());
    if (exactMatch && exactMatch !== "All") {
      onChange(exactMatch);
    } else if (newValue === "") {
      onChange("");
    }
  };

  const handleSelect = (option) => {
    const selectedValue = option === "All" ? "" : option;
    setInputValue(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
    setIsOpen(true);
  };

  return (
    <div className="relative z-[150]" ref={dropdownRef}>
      <label className={`block text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
        {label}
      </label>

      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none ${isDarkMode ? "text-gray-500" : "text-gray-400"}`} />

        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          autoComplete="off"
          className={`w-full pl-11 pr-10 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 
            ${isDarkMode 
              ? "bg-gray-900/60 border-gray-700 hover:border-indigo-500 text-white placeholder-gray-500" 
              : "bg-white border-gray-300 hover:border-indigo-400 text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"}
            ${isOpen ? "ring-2 ring-indigo-500" : ""}`}
        />

        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-colors 
              ${isDarkMode 
                ? "text-gray-400 hover:text-white hover:bg-gray-700" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div 
          className={`absolute z-[999] w-full mt-2 rounded-xl shadow-2xl border-2 overflow-hidden 
            ${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
          style={{ maxHeight: "280px" }}
        >
          <div className="overflow-y-auto" style={{ maxHeight: "280px" }}>
            {filteredOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className={`w-full px-4 py-3 text-left transition-colors duration-150 flex items-center justify-between 
                  ${(option === "All" && !value) || option === value 
                    ? isDarkMode ? "bg-indigo-900/50 text-indigo-300 font-semibold" : "bg-indigo-100 text-indigo-800 font-semibold"
                    : isDarkMode ? "text-gray-200 hover:bg-gray-800" : "text-gray-900 hover:bg-gray-50"}`}
              >
                <span className="truncate">{option === "All" ? "All" : option}</span>
                {((option === "All" && !value) || option === value) && (
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${isDarkMode ? "bg-indigo-400" : "bg-indigo-600"}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div 
          className={`absolute z-[999] w-full mt-2 rounded-xl shadow-2xl border-2 p-4 text-center 
            ${isDarkMode ? "bg-gray-900 border-gray-700 text-gray-500" : "bg-white border-gray-200 text-gray-400"}`}
        >
          No results found
        </div>
      )}
    </div>
  );
};

const Summary = () => {
  const isDarkMode = localStorage.getItem("isDarkMode") === "true";
  const [period, setPeriod] = useState("all");
  const [filters, setFilters] = useState({
    siteName: "",
    bankName: "",
    expHead: "",
  });

  const currentDate = new Date();
  const {
    data: apiData,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetMainBankSummaryQuery();

  const apiTotalIn = useMemo(() => parseAmount(apiData?.inTotal), [apiData]);
  const apiTotalOut = useMemo(() => parseAmount(apiData?.outTotal), [apiData]);
  const apiNetBalance = useMemo(() => parseAmount(apiData?.netBalance), [apiData]);

  const processedTransactions = useMemo(() => {
    const transactions = apiData?.transactions || [];
    if (!Array.isArray(transactions) || transactions.length === 0) return [];

    return transactions
      .map((t) => {
        const inAmt = parseAmount(t.inAmount);
        const outAmt = parseAmount(t.outAmount);
        return {
          ...t,
          date: parseDate(t.date),
          amount: inAmt > 0 ? inAmt : outAmt,
          type: inAmt > 0 ? "in" : "out",
          category: t.expHead || t.siteName || "General",
          inAmountNum: inAmt,
          outAmountNum: outAmt,
        };
      })
      .filter((t) => t.date !== null);
  }, [apiData]);

  const allUniqueOptions = useMemo(() => {
    return {
      siteNames: ["All", ...new Set(processedTransactions.map((t) => t.siteName || "").filter(Boolean))].sort(),
      bankNames: ["All", ...new Set(processedTransactions.map((t) => t.bankName || "").filter(Boolean))].sort(),
      expHeads: ["All", ...new Set(processedTransactions.map((t) => t.category || "").filter(Boolean))].sort(),
    };
  }, [processedTransactions]);

  const cascadingOptions = useMemo(() => {
    let data = processedTransactions;
    if (filters.siteName) {
      data = data.filter((t) => t.siteName === filters.siteName);
    }
    const bankNames = ["All", ...new Set(data.map((t) => t.bankName || "").filter(Boolean))].sort();

    if (filters.bankName) {
      data = data.filter((t) => t.bankName === filters.bankName);
    }
    const expHeads = ["All", ...new Set(data.map((t) => t.category || "").filter(Boolean))].sort();

    return {
      siteNames: allUniqueOptions.siteNames,
      bankNames,
      expHeads,
    };
  }, [processedTransactions, filters.siteName, filters.bankName, allUniqueOptions]);

  const finalFilteredData = useMemo(() => {
    let data = processedTransactions;

    let startDate = new Date(currentDate);

    if (period === "1y") {
      startDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (period === "6m") {
      startDate.setMonth(currentDate.getMonth() - 6);
    } else if (period === "3m") {
      startDate.setMonth(currentDate.getMonth() - 3);
    } else if (period === "1m") {
      startDate.setMonth(currentDate.getMonth() - 1);
    } else if (period === "2w") {
      startDate.setDate(currentDate.getDate() - 14);
    } else if (period === "1w") {
      startDate.setDate(currentDate.getDate() - 7);
    } else {
      startDate = new Date(0); // all time
    }

    data = data.filter((t) => t.date >= startDate);

    if (filters.siteName) {
      data = data.filter((t) => t.siteName === filters.siteName);
    }
    if (filters.bankName) {
      data = data.filter((t) => t.bankName === filters.bankName);
    }
    if (filters.expHead) {
      data = data.filter((t) => t.category === filters.expHead);
    }

    return data;
  }, [processedTransactions, period, currentDate, filters]);

  const totalIn = useMemo(() => {
    if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
      return apiTotalIn;
    }
    return finalFilteredData
      .filter((t) => t.type === "in")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [finalFilteredData, period, apiTotalIn, filters]);

  const totalOut = useMemo(() => {
    if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
      return apiTotalOut;
    }
    return finalFilteredData
      .filter((t) => t.type === "out")
      .reduce((sum, t) => sum + t.amount, 0);
  }, [finalFilteredData, period, apiTotalOut, filters]);

  const balance = useMemo(() => {
    if (period === "all" && !filters.siteName && !filters.bankName && !filters.expHead) {
      return apiNetBalance;
    }
    return totalIn - totalOut;
  }, [totalIn, totalOut, period, apiNetBalance, filters]);

  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIn, Math.abs(totalOut)],
        backgroundColor: ["#10b981", "#f43f5e"],
        hoverOffset: 12,
        borderWidth: 0,
      },
    ],
  };

  const barChartData = useMemo(() => {
    if (finalFilteredData.length === 0) return { labels: [], datasets: [] };

    const monthlyData = {};
    finalFilteredData.forEach((t) => {
      if (!t.date) return;
      const monthYear = t.date.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyData[monthYear]) {
        monthlyData[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === "in") monthlyData[monthYear].income += t.amount;
      else monthlyData[monthYear].expense += t.amount;
    });

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: "Income",
          data: sortedMonths.map((m) => monthlyData[m].income),
          backgroundColor: "rgba(16, 185, 129, 0.75)",
          borderColor: "#10b981",
          borderWidth: 1,
          borderRadius: 8,
        },
        {
          label: "Expense",
          data: sortedMonths.map((m) => monthlyData[m].expense),
          backgroundColor: "rgba(244, 63, 94, 0.75)",
          borderColor: "#f43f5e",
          borderWidth: 1,
          borderRadius: 8,
        },
      ],
    };
  }, [finalFilteredData]);

  const activeFiltersCount = [filters.siteName, filters.bankName, filters.expHead].filter(Boolean).length;

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
          <p className={`mb-6 ${isDarkMode ? "text-red-200" : "text-red-800"}`}>
            {error?.data?.message || error?.message || "Failed to fetch financial summary"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
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
          <button
            onClick={() => refetch()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" /> Refresh
          </button>
        </div>
      </div>
    );
  }

  const hasNoTransactionsInPeriod = finalFilteredData.length === 0;

  return (
    <div
      className={`min-h-screen relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 xl:px-10 w-full 
        ${isDarkMode ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950" : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"}`}
      style={{ scrollBehavior: "smooth" }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-purple-700" : "bg-purple-300/40"}`}></div>
        <div className={`absolute top-1/4 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow ${isDarkMode ? "bg-blue-700" : "bg-blue-300/40"}`} style={{ animationDelay: "3s" }}></div>
        <div className={`absolute -bottom-32 left-1/3 w-[450px] h-[450px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow ${isDarkMode ? "bg-indigo-800" : "bg-indigo-300/40"}`} style={{ animationDelay: "6s" }}></div>
      </div>

      {/* Floating particles */}
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

      {/* Main content */}
      <div className="relative z-10 w-full space-y-8 lg:space-y-10">
        {/* Header */}
        <div className={`rounded-2xl border shadow-2xl w-full p-6 sm:p-8 lg:p-10 xl:p-12 
          ${isDarkMode ? "bg-black/70 border-indigo-700/60" : "bg-white/90 border-indigo-200/80"}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r bg-clip-text text-transparent flex items-center gap-3 ${isDarkMode ? "from-indigo-200 via-purple-200 to-indigo-200" : "from-indigo-700 via-purple-700 to-indigo-700"}`}>
                <Wallet className={`w-10 h-10 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Financial Summary
              </h1>
              <p className={`mt-2 text-lg ${isDarkMode ? "text-indigo-300/80" : "text-indigo-700/80"}`}>
                Overview of income, expenses & balance
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => refetch()}
                className={`px-4 py-2.5 border rounded-xl transition-all flex items-center gap-2 justify-center ${isDarkMode ? "bg-black/50 border-indigo-600/50 hover:bg-white/10 text-white" : "bg-white/60 border-indigo-300/60 hover:bg-gray-100 text-gray-800"}`}
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className={`border p-1.5 rounded-xl shadow-lg flex flex-wrap ${isDarkMode ? "bg-black/50 border-indigo-600/50" : "bg-white/60 border-indigo-300/60"}`}>
                {["all", "1y", "6m", "3m", "1m", "2w", "1w"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      period === p
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : isDarkMode
                        ? "text-gray-300 hover:bg-white/10"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {p === "all" ? "All Time" :
                     p === "1y" ? "1 Y" :
                     p === "6m" ? "6 M" :
                     p === "3m" ? "3 M" :
                     p === "1m" ? "1 M" :
                     p === "2w" ? "2 W" :
                     p === "1w" ? "1 W" : p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-8 space-y-6 relative z-[100]">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                <Search className="w-5 h-5" />
                Filter Data
                {activeFiltersCount > 0 && (
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${isDarkMode ? "bg-indigo-900/60 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
                    {activeFiltersCount} active
                  </span>
                )}
              </h3>

              {activeFiltersCount > 0 && (
                <button
                  onClick={() => setFilters({ siteName: "", bankName: "", expHead: "" })}
                  className={`px-4 py-2 rounded-lg border-2 transition-all flex items-center gap-2 text-sm font-semibold ${isDarkMode ? "bg-gray-900/60 border-gray-700 hover:border-red-500 text-red-400 hover:bg-red-900/20" : "bg-white border-gray-300 hover:border-red-400 text-red-600 hover:bg-red-50"}`}
                >
                  <X className="w-4 h-4" /> Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <SearchableInputFilter
                label="Site Name"
                value={filters.siteName}
                onChange={(val) => setFilters((prev) => ({ ...prev, siteName: val, bankName: "", expHead: "" }))}
                options={cascadingOptions.siteNames}
                placeholder="Type or select site..."
                isDarkMode={isDarkMode}
              />
              <SearchableInputFilter
                label="Bank Name"
                value={filters.bankName}
                onChange={(val) => setFilters((prev) => ({ ...prev, bankName: val, expHead: "" }))}
                options={cascadingOptions.bankNames}
                placeholder="Type or select bank..."
                isDarkMode={isDarkMode}
              />
              <SearchableInputFilter
                label="Expense Head"
                value={filters.expHead}
                onChange={(val) => setFilters((prev) => ({ ...prev, expHead: val }))}
                options={cascadingOptions.expHeads}
                placeholder="Type or select head..."
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 w-full z-10">
          <StatCard
            title="Total Income"
            amount={totalIn}
            color="emerald"
            icon={<ArrowDownCircle />}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Total Expenses"
            amount={Math.abs(totalOut)}
            color="rose"
            icon={<ArrowUpCircle />}
            isDarkMode={isDarkMode}
          />
          <StatCard
            title="Net Balance"
            amount={balance}
            color={balance >= 0 ? "emerald" : "rose"}
            icon={<Wallet />}
            isBalance
            isDarkMode={isDarkMode}
            balanceValue={balance}
          />
        </div>

        {hasNoTransactionsInPeriod && (
          <div className={`rounded-2xl border p-6 text-center ${isDarkMode ? "bg-yellow-900/30 border-yellow-700/40" : "bg-yellow-50/70 border-yellow-300/60"}`}>
            <p className={`text-lg ${isDarkMode ? "text-yellow-300" : "text-yellow-800"}`}>
              No transactions found for the selected period and filters
            </p>
            <button
              onClick={() => {
                setPeriod("all");
                setFilters({ siteName: "", bankName: "", expHead: "" });
              }}
              className="mt-4 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
            >
              Reset All
            </button>
          </div>
        )}

        {finalFilteredData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
            {/* Bar Chart */}
            <div className={`lg:col-span-2 rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className={`text-2xl lg:text-3xl font-bold flex items-center gap-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  <Calendar className={`w-7 h-7 ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`} /> Transaction Trend
                </h3>
                <span className={`px-4 py-2 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100/70 text-indigo-700"}`}>
                  {period === "all" ? "All Time" :
                   period === "1y" ? "Last 1 Year" :
                   period === "6m" ? "Last 6 Months" :
                   period === "3m" ? "Last 3 Months" :
                   period === "1m" ? "Last 1 Month" :
                   period === "2w" ? "Last 2 Weeks" :
                   period === "1w" ? "Last 1 Week" : `Last ${period.toUpperCase()}`}
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
                        callbacks: {
                          label: (context) => {
                            let label = context.dataset.label || "";
                            if (label) label += ": ";
                            if (context.parsed.y !== null) label += "₹" + context.parsed.y.toLocaleString("en-IN");
                            return label;
                          },
                        },
                      },
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" }, callback: (v) => "₹" + v.toLocaleString("en-IN") } },
                      x: { grid: { display: false }, ticks: { color: isDarkMode ? "#9ca3af" : "#6b7280", font: { weight: "600" } } },
                    },
                  }}
                />
              </div>
            </div>

            {/* Pie Chart */}
            <div className={`rounded-2xl border shadow-2xl p-6 md:p-8 lg:p-10 w-full ${isDarkMode ? "bg-black/30 border-indigo-700/40" : "bg-white/70 border-indigo-200/60"}`}>
              <h3 className={`text-2xl lg:text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                Income vs Expenses
              </h3>
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
                        callbacks: {
                          label: (context) => {
                            let label = context.label || "";
                            if (label) label += ": ";
                            if (context.parsed !== null) label += "₹" + context.parsed.toLocaleString("en-IN");
                            return label;
                          },
                        },
                      },
                    },
                  }}
                />
              </div>

              <div className={`mt-6 pt-6 border-t text-center ${isDarkMode ? "border-indigo-700/30" : "border-indigo-200/30"}`}>
                <p className={`text-sm uppercase tracking-wider mb-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Savings Rate
                </p>
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
                    <tr
                      key={`transaction-${i}`}
                      className={`hover:bg-opacity-30 transition-colors duration-150 ${isDarkMode ? "hover:bg-indigo-950/30" : "hover:bg-indigo-50/30"}`}
                    >
                      <td className={`px-6 py-5 text-base ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {t.date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className={`px-6 py-5 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                        {t.siteName || "-"}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-sm lg:text-base font-medium ${isDarkMode ? "bg-gray-800/70 text-gray-200" : "bg-gray-200/70 text-gray-800"}`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs lg:text-sm font-bold uppercase border 
                            ${t.type === "in"
                              ? isDarkMode
                                ? "bg-emerald-900/50 text-emerald-300 border-emerald-700/40"
                                : "bg-emerald-100/70 text-emerald-800 border-emerald-300/60"
                              : isDarkMode
                              ? "bg-rose-900/50 text-rose-300 border-rose-700/40"
                              : "bg-rose-100/70 text-rose-800 border-rose-300/60"}`}
                        >
                          {t.type === "in" ? "↓ Income" : "↑ Expense"}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-5 text-right text-lg lg:text-xl font-bold ${t.type === "in" ? "text-emerald-500" : "text-rose-500"}`}
                      >
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
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? "" : "-"}30px, -60px); }
        }
        .animate-pulse-slow {
          animation: pulse 18s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.1); }
        }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: ${isDarkMode ? 'rgba(17, 24, 39, 0.5)' : 'rgba(243, 244, 246, 0.5)'}; border-radius: 5px; }
        ::-webkit-scrollbar-thumb { background: ${isDarkMode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.3)'}; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDarkMode ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.5)'}; }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, amount, color, icon, isBalance = false, isDarkMode, balanceValue }) => {
  const colorMap = {
    emerald: {
      bg: isDarkMode
        ? "bg-gradient-to-br from-emerald-900/60 to-teal-900/60"
        : "bg-gradient-to-br from-emerald-100/85 to-teal-100/75",
      text: isDarkMode ? "text-emerald-300" : "text-emerald-800",
      border: isDarkMode ? "border-emerald-700/40" : "border-emerald-300/60",
      light: isDarkMode ? "bg-emerald-950/30" : "bg-emerald-200/40",
      titleText: isDarkMode ? "text-gray-400" : "text-gray-700",
      iconColor: isDarkMode ? "text-white" : "text-emerald-700",
    },
    rose: {
      bg: isDarkMode
        ? "bg-gradient-to-br from-rose-900/60 to-pink-900/60"
        : "bg-gradient-to-br from-rose-100/85 to-pink-100/75",
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
      ? (balanceValue >= 0 ? "text-emerald-400" : "text-rose-400")
      : (balanceValue >= 0 ? "text-emerald-700" : "text-rose-700");
  }

  return (
    <div
      className={`rounded-2xl border shadow-2xl hover:shadow-3xl transition-all duration-300 relative overflow-hidden w-full p-6 lg:p-8 
        ${isDarkMode ? "bg-black/30 border-gray-700/40" : "bg-white/80 border-gray-200/70"}`}
    >
      <div className={`absolute -right-10 -top-10 w-40 h-40 ${colors.light} rounded-full blur-3xl`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`p-4 rounded-xl ${colors.bg} shadow-lg`}>
            {React.cloneElement(icon, {
              size: 28,
              className: finalIconColor,
              strokeWidth: isDarkMode ? 2 : 2.2
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

export default Summary;