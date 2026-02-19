
// import React, { useState, useEffect, useMemo } from "react";
// import {
//   useGetPendingOfficeExpensesQuery,
//   useUpdateOfficeExpenseApprovalMutation,
// } from "../../features/RCC_Office_Expenses/approval1ApiSlice";
// import {
//   Image as LucideImage,
//   Loader2,
//   CheckCircle,
//   Edit3,
//   Search,
//   ChevronDown,
//   X,
// } from "lucide-react";

// function RCC_Approvel() {
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem("isDarkMode");
//     return saved !== null ? JSON.parse(saved) : true; // default dark
//   });

//   // Theme application + real-time sync across tabs
//   useEffect(() => {
//     const applyTheme = () => {
//       const saved = localStorage.getItem("isDarkMode");
//       const shouldBeDark = saved !== null ? JSON.parse(saved) : true;
//       setIsDarkMode(shouldBeDark);

//       if (shouldBeDark) {
//         document.documentElement.classList.add("dark");
//       } else {
//         document.documentElement.classList.remove("dark");
//       }
//     };

//     applyTheme();

//     const handleStorageChange = (e) => {
//       if (e.key === "isDarkMode") {
//         applyTheme();
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     const interval = setInterval(applyTheme, 800);

//     return () => {
//       window.removeEventListener("storage", handleStorageChange);
//       clearInterval(interval);
//     };
//   }, []);

//   const {
//     data: response,
//     isLoading,
//     isError,
//     error,
//   } = useGetPendingOfficeExpensesQuery();

//   const [updateApproval, { isLoading: isUpdating }] =
//     useUpdateOfficeExpenseApprovalMutation();

//   const currentApprover = sessionStorage.getItem("userName") || "";
//   const userType = sessionStorage.getItem("userType")?.toUpperCase() || "";
//   const isAdmin = userType === "ADMIN";

//   const allExpenses = response?.data || [];
//   const expensesToShow = isAdmin
//     ? allExpenses
//     : allExpenses.filter(
//         (item) =>
//           item.APPROVAL_DOER?.trim().toLowerCase() ===
//           currentApprover.trim().toLowerCase()
//       );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOffBillNo, setSelectedOffBillNo] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [revisedAmounts, setRevisedAmounts] = useState({});
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [formData, setFormData] = useState({
//     STATUS_2: "",
//     REMARK_2: "",
//   });

//   // ── Computed values ─────────────────────────────────────────────────────────────
//   const uniqueOffBillNos = useMemo(() => {
//     const billNos = new Set();
//     expensesToShow.forEach((item) => {
//       const bill = String(item.OFFBILLUID ?? "").trim();
//       if (bill) billNos.add(bill);
//     });
//     return Array.from(billNos).sort();
//   }, [expensesToShow]);

//   const filteredOffBillNos = useMemo(() => {
//     if (!searchTerm.trim()) return uniqueOffBillNos;
//     const term = searchTerm.trim().toLowerCase();
//     return uniqueOffBillNos.filter((billNo) =>
//       billNo.toLowerCase().includes(term)
//     );
//   }, [uniqueOffBillNos, searchTerm]);

//   const itemsForSelectedBill = useMemo(() => {
//     if (!selectedOffBillNo) return [];
//     const selected = String(selectedOffBillNo).trim();
//     return expensesToShow.filter((item) => {
//       const itemBill = String(item.OFFBILLUID ?? "").trim();
//       return itemBill === selected;
//     });
//   }, [selectedOffBillNo, expensesToShow]);

//   const totalOriginalAmount = useMemo(() =>
//     itemsForSelectedBill.reduce((sum, item) => {
//       const amt = String(item.Amount || "0").replace(/,/g, "");
//       return sum + (parseFloat(amt) || 0);
//     }, 0), [itemsForSelectedBill]);

//   const totalRevisedAmount = useMemo(() =>
//     itemsForSelectedBill.reduce((sum, item) => {
//       const rev = revisedAmounts[item.uid];
//       if (!rev) return sum;
//       const clean = String(rev).replace(/,/g, "").trim();
//       return sum + (parseFloat(clean) || 0);
//     }, 0), [itemsForSelectedBill, revisedAmounts]);

//   const allItemsHaveRevisedAmount = useMemo(() => {
//     if (itemsForSelectedBill.length === 0) return false;
//     return itemsForSelectedBill.every((item) => {
//       const val = revisedAmounts[item.uid];
//       return val !== undefined && val !== "" && !isNaN(parseFloat(val));
//     });
//   }, [itemsForSelectedBill, revisedAmounts]);

//   const formatAmount = (amountStr) => {
//     if (!amountStr) return "0.00";
//     const clean = String(amountStr).replace(/,/g, "");
//     const num = parseFloat(clean) || 0;
//     return num.toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });
//   };

//   // ── Handlers ────────────────────────────────────────────────────────────────────
//   const handleRevisedAmountChange = (uid, value) => {
//     setRevisedAmounts((prev) => ({ ...prev, [uid]: value }));
//   };

//   const clearSelection = () => {
//     setSelectedOffBillNo("");
//     setSearchTerm("");
//     setRevisedAmounts({});
//     setShowDropdown(false);
//   };

//   const openModal = () => {
//     if (!allItemsHaveRevisedAmount) {
//       alert("कृपया सभी आइटम्स के लिए Revised Amount भरें");
//       return;
//     }
//     setFormData({ STATUS_2: "", REMARK_2: "" });
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async () => {
//     if (!formData.STATUS_2) {
//       alert("कृपया स्टेटस चुनें");
//       return;
//     }
//     try {
//       const promises = itemsForSelectedBill.map((item) => {
//         const payload = {
//           uid: item.uid,
//           STATUS_2: formData.STATUS_2,
//           REVISED_AMOUNT_3: revisedAmounts[item.uid] || undefined,
//           APPROVAL_DOER_2: item.APPROVAL_DOER || currentApprover || "Unknown",
//           REMARK_2: formData.REMARK_2 || undefined,
//         };
//         return updateApproval(payload).unwrap();
//       });

//       await Promise.all(promises);
//       alert("Approval updated successfully!");
//       setIsModalOpen(false);
//       setRevisedAmounts({});
//     } catch (err) {
//       console.error(err);
//       alert("Failed to update: " + (err?.data?.message || err.message));
//     }
//   };

//   // ── Loading / Error / Empty states ──────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center ${
//         isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
//       }`}>
//         <div className="flex items-center gap-4">
//           <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`} />
//           <span className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//             Loading pending approvals...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
//         isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
//       }`}>
//         <div className={`text-xl font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
//           Error: {error?.data?.message || "Failed to load data"}
//         </div>
//       </div>
//     );
//   }

//   if (!currentApprover) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
//         isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
//       }`}>
//         <div className={`text-xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
//           No user information found in session. Please login again.
//         </div>
//       </div>
//     );
//   }

//   if (expensesToShow.length === 0) {
//     return (
//       <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
//         isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
//       }`}>
//         <div className={`space-y-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//           <div className="text-xl font-medium">
//             No pending approvals {isAdmin ? "in the system" : "assigned to you"}.
//           </div>
//           <div className="text-base">
//             Logged in as: <strong className={isDarkMode ? "text-gray-100" : "text-gray-900"}>{currentApprover}</strong>
//             {isAdmin && <span className="ml-2 text-purple-500 font-semibold">(ADMIN)</span>}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ── Main UI ─────────────────────────────────────────────────────────────────────
//   return (
//     <div className={`min-h-screen p-4 md:p-6 space-y-6 ${
//       isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100" : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
//     }`}>
//       {/* Header */}
//       <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pb-5 border-b ${
//         isDarkMode ? "border-gray-700/60" : "border-gray-300"
//       }`}>
//         <div>
//           <h2 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
//             isDarkMode ? "from-cyan-300 via-blue-300 to-indigo-300" : "from-cyan-600 via-blue-600 to-indigo-600"
//           }`}>
//             RCC Office Expenses
//           </h2>
//           <p className={`text-xl mt-1 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//             Level 1 Approval
//           </p>
//         </div>
//         <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${
//           isDarkMode ? "bg-gray-800/70 border-gray-700/60" : "bg-white border-gray-300 shadow-sm"
//         }`}>
//           <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Approver:</span>
//           <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{currentApprover}</span>
//           {isAdmin && (
//             <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
//               isDarkMode ? "bg-purple-800/60 text-purple-200" : "bg-purple-100 text-purple-800"
//             }`}>
//               ADMIN
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Bill Selector – Sticky */}
//       <div className="sticky top-0 z-20 pb-5 pt-2">
//         <div className={`rounded-2xl border p-6 backdrop-blur-lg shadow-2xl ${
//           isDarkMode ? "bg-gray-900/85 border-gray-700/60" : "bg-white/90 border-gray-300 shadow-xl"
//         }`}>
//           <label className={`block text-lg font-semibold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
//             Select OFFBILL NO
//           </label>
//           <div className="relative">
//             <input
//               type="text"
//               value={selectedOffBillNo || searchTerm}
//               onChange={(e) => {
//                 if (selectedOffBillNo) {
//                   if (e.target.value === "") clearSelection();
//                   return;
//                 }
//                 setSearchTerm(e.target.value);
//                 setShowDropdown(true);
//               }}
//               onFocus={() => !selectedOffBillNo && setShowDropdown(true)}
//               placeholder="Search OFFBILL NO..."
//               className={`w-full px-5 py-4 pl-12 pr-16 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
//                 isDarkMode
//                   ? "bg-gray-800/90 border-gray-700 text-gray-100 focus:ring-cyan-600 focus:border-cyan-600"
//                   : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
//               }`}
//             />
//             <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 ${
//               isDarkMode ? "text-gray-500" : "text-gray-400"
//             }`} />
//             {selectedOffBillNo ? (
//               <button
//                 onClick={clearSelection}
//                 className={`absolute right-5 top-1/2 -translate-y-1/2 transition ${
//                   isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"
//                 }`}
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             ) : (
//               <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 ${
//                 isDarkMode ? "text-gray-500" : "text-gray-400"
//               }`} />
//             )}

//             {showDropdown && !selectedOffBillNo && (
//               <div className={`absolute z-50 w-full mt-2 border rounded-xl shadow-2xl max-h-80 overflow-y-auto backdrop-blur-md ${
//                 isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white border-gray-300"
//               }`}>
//                 {filteredOffBillNos.length > 0 ? (
//                   filteredOffBillNos.map((billNo) => (
//                     <div
//                       key={billNo}
//                       onClick={() => {
//                         setSelectedOffBillNo(billNo);
//                         setSearchTerm("");
//                         setShowDropdown(false);
//                         setRevisedAmounts({});
//                       }}
//                       className={`px-6 py-4 cursor-pointer border-b last:border-b-0 transition ${
//                         isDarkMode
//                           ? "text-gray-300 hover:bg-cyan-950/60 hover:text-cyan-200 border-gray-800"
//                           : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 border-gray-200"
//                       }`}
//                     >
//                       {billNo}
//                     </div>
//                   ))
//                 ) : (
//                   <div className={`px-6 py-5 text-center ${
//                     isDarkMode ? "text-gray-500" : "text-gray-400"
//                   }`}>
//                     No matching bill number found
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Content when bill selected */}
//       {selectedOffBillNo && (
//         <>
//           <div className={`p-4 rounded-xl text-sm border ${
//             isDarkMode ? "bg-gray-800/60 text-gray-300 border-gray-700/50" : "bg-gray-100 text-gray-700 border-gray-300"
//           }`}>
//             <strong>Selected Bill:</strong>{" "}
//             <span className={isDarkMode ? "text-cyan-300 font-medium" : "text-cyan-700 font-medium"}>{selectedOffBillNo}</span> •{" "}
//             {itemsForSelectedBill.length} item{itemsForSelectedBill.length !== 1 ? "s" : ""}
//           </div>

//           {itemsForSelectedBill.length > 0 ? (
//             <div className={`rounded-2xl border p-6 backdrop-blur-sm ${
//               isDarkMode ? "bg-gray-900/50 border-gray-700/50" : "bg-white border-gray-300 shadow-md"
//             }`}>
//               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                 <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
//                   Items for bill <span className={isDarkMode ? "text-cyan-400" : "text-cyan-600"}>{selectedOffBillNo}</span>
//                 </h3>
//                 <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//                   Fill revised amount for <strong>every item</strong> (mandatory)
//                 </div>
//               </div>

//               <div className="overflow-x-auto rounded-xl border">
//                 <table className="w-full table-auto min-w-max">
//                   <thead>
//                     <tr className={`text-white ${
//                       isDarkMode ? "bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"
//                     }`}>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">UID</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Office Name</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Payee</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Item Name</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">QTY</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Original Amount</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
//                         Revised Amount <span className="text-red-300">*</span>
//                       </th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Approval Doer</th>
//                       <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Bill</th>
//                     </tr>
//                   </thead>
//                   <tbody className={`divide-y ${
//                     isDarkMode ? "divide-gray-800/60 bg-gray-900/30" : "divide-gray-200 bg-white"
//                   }`}>
//                     {itemsForSelectedBill.map((item) => (
//                       <tr
//                         key={item.uid}
//                         className={`hover transition-colors ${
//                           isDarkMode
//                             ? revisedAmounts[item.uid]
//                               ? "bg-emerald-950/30 hover:bg-emerald-950/50"
//                               : "bg-red-950/20 hover:bg-red-950/40"
//                             : revisedAmounts[item.uid]
//                               ? "bg-emerald-50 hover:bg-emerald-100"
//                               : "bg-red-50 hover:bg-red-100"
//                         }`}
//                       >
//                         <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.uid}</td>
//                         <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.OFFICE_NAME_1 || "-"}</td>
//                         <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.PAYEE_NAME_1 || "-"}</td>
//                         <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.ITEM_NAME_1 || "-"}</td>
//                         <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.Qty_1 || "-"}</td>
//                         <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
//                           ₹{formatAmount(item.Amount)}
//                         </td>
//                         <td className="px-6 py-4">
//                           <input
//                             type="number"
//                             value={revisedAmounts[item.uid] || ""}
//                             onChange={(e) => handleRevisedAmountChange(item.uid, e.target.value)}
//                             placeholder="Required"
//                             className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all ${
//                               isDarkMode
//                                 ? revisedAmounts[item.uid]
//                                   ? "bg-gray-800 border-emerald-600 focus:ring-emerald-500 text-gray-100"
//                                   : "bg-gray-800 border-red-600 focus:ring-red-500 text-gray-100"
//                                 : revisedAmounts[item.uid]
//                                   ? "bg-white border-emerald-400 focus:ring-emerald-500 text-gray-900"
//                                   : "bg-white border-red-400 focus:ring-red-500 text-gray-900"
//                             }`}
//                           />
//                         </td>
//                         <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                           {item.APPROVAL_DOER || "-"}
//                         </td>
//                         <td className="px-6 py-4 text-sm">
//                           {item.Bill_Photo ? (
//                             <a
//                               href={item.Bill_Photo}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className={`flex items-center gap-2 hover:underline ${
//                                 isDarkMode ? "text-cyan-400 hover:text-cyan-300" : "text-cyan-600 hover:text-cyan-700"
//                               }`}
//                             >
//                               <LucideImage className="w-4 h-4" />
//                               View
//                             </a>
//                           ) : (
//                             "—"
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
//                 <div className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   Total Original:{" "}
//                   <span className={isDarkMode ? "text-emerald-400 font-semibold" : "text-emerald-600 font-semibold"}>
//                     ₹{totalOriginalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                   </span>
//                   <span className="ml-6">
//                     Revised:{" "}
//                     <span className={totalRevisedAmount > 0 ? (isDarkMode ? "text-emerald-400" : "text-emerald-600") : (isDarkMode ? "text-gray-400" : "text-gray-500")}>
//                       ₹{totalRevisedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
//                     </span>
//                   </span>
//                 </div>

//                 <button
//                   onClick={openModal}
//                   disabled={!allItemsHaveRevisedAmount || isUpdating}
//                   className={`px-8 py-3.5 rounded-xl font-medium shadow-lg transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed ${
//                     isDarkMode
//                       ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
//                       : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
//                   }`}
//                 >
//                   <Edit3 className="w-5 h-5" />
//                   Review & Approve ({itemsForSelectedBill.length} items)
//                 </button>
//               </div>
//             </div>
//           ) : (
//             <div className={`rounded-2xl border p-10 text-center backdrop-blur-sm ${
//               isDarkMode ? "bg-gray-900/50 border-gray-700/50 text-gray-400" : "bg-gray-50 border-gray-300 text-gray-600"
//             }`}>
//               No items found for bill <strong className={isDarkMode ? "text-cyan-300" : "text-cyan-700"}>{selectedOffBillNo}</strong>
//             </div>
//           )}
//         </>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className={`rounded-2xl shadow-2xl w-full max-w-2xl border overflow-hidden ${
//             isDarkMode ? "bg-gradient-to-b from-gray-900 to-black border-indigo-700/30" : "bg-gradient-to-b from-white to-gray-50 border-gray-300"
//           }`}>
//             <div className={`px-8 py-6 ${
//               isDarkMode ? "bg-gradient-to-r from-blue-950 to-indigo-950" : "bg-gradient-to-r from-blue-100 to-indigo-100"
//             }`}>
//               <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
//                 Level 1 Approval – RCC
//               </h3>
//               <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
//                 {itemsForSelectedBill.length} items • ₹
//                 {totalRevisedAmount.toLocaleString("en-IN")}
//               </p>
//             </div>

//             <div className="p-8 space-y-6">
//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   Approval Status <span className="text-red-400">*</span>
//                 </label>
//                 <select
//                   value={formData.STATUS_2}
//                   onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
//                   className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
//                     isDarkMode
//                       ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-cyan-600"
//                       : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500"
//                   }`}
//                 >
//                   <option value="">----- Select -----</option>
//                   <option value="Done">Done</option>
//                 </select>
//               </div>

//               <div>
//                 <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   Remark
//                 </label>
//                 <textarea
//                   value={formData.REMARK_2}
//                   onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
//                   rows={3}
//                   placeholder="Add remark if needed..."
//                   className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
//                     isDarkMode
//                       ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-cyan-600"
//                       : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500"
//                   }`}
//                 />
//               </div>

//               <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
//                 <strong>Approver:</strong> {currentApprover}
//                 {isAdmin && <span className={isDarkMode ? "text-purple-300 ml-2" : "text-purple-600 ml-2"}>(ADMIN)</span>}
//               </div>

//               <div className={`p-5 rounded-xl border ${
//                 isDarkMode ? "bg-gray-800/60 border-gray-700" : "bg-gray-50 border-gray-200"
//               }`}>
//                 <p className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
//                   Items Summary:
//                 </p>
//                 <div className={`space-y-2 max-h-52 overflow-y-auto text-sm ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}>
//                   {itemsForSelectedBill.map((item) => (
//                     <div key={item.uid} className="flex justify-between">
//                       <span className="truncate max-w-[320px]">{item.EXPENSES_DETAILS_1 || item.ITEM_NAME_1 || item.uid}</span>
//                       <span className={isDarkMode ? "text-emerald-400 font-medium" : "text-emerald-600 font-medium"}>
//                         ₹{formatAmount(revisedAmounts[item.uid] || item.Amount)}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className={`px-8 py-6 flex gap-4 justify-end border-t ${
//               isDarkMode ? "bg-gray-950/70 border-gray-800" : "bg-gray-100 border-gray-200"
//             }`}>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className={`px-7 py-3 rounded-xl transition ${
//                   isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
//                 }`}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmit}
//                 disabled={isUpdating}
//                 className={`px-7 py-3 rounded-xl flex items-center gap-2.5 transition disabled:opacity-50 ${
//                   isDarkMode
//                     ? "bg-emerald-700 hover:bg-emerald-600 text-white"
//                     : "bg-emerald-600 hover:bg-emerald-500 text-white"
//                 }`}
//               >
//                 {isUpdating ? (
//                   <>
//                     <Loader2 className="w-5 h-5 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-5 h-5" />
//                     Submit Approval
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default RCC_Approvel;






import React, { useState, useEffect, useMemo } from "react";
import {
  useGetPendingOfficeExpensesQuery,
  useUpdateOfficeExpenseApprovalMutation,
} from "../../features/RCC_Office_Expenses/approval1ApiSlice";
import {
  Image as LucideImage,
  Loader2,
  CheckCircle,
  Edit3,
  Search,
  ChevronDown,
  X,
} from "lucide-react";

function RCC_Approvel() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved !== null ? JSON.parse(saved) : true; // default dark
  });

  // Theme application + real-time sync across tabs
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

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useGetPendingOfficeExpensesQuery();

  const [updateApproval, { isLoading: isUpdating }] =
    useUpdateOfficeExpenseApprovalMutation();

  const currentApprover = sessionStorage.getItem("userName") || "";
  const userType = sessionStorage.getItem("userType")?.toUpperCase() || "";
  const isAdmin = userType === "ADMIN";

  const allExpenses = response?.data || [];
  const expensesToShow = isAdmin
    ? allExpenses
    : allExpenses.filter(
        (item) =>
          item.APPROVAL_DOER?.trim().toLowerCase() ===
          currentApprover.trim().toLowerCase()
      );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOffBillNo, setSelectedOffBillNo] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [revisedAmounts, setRevisedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    STATUS_2: "",
    REMARK_2: "",
  });

  // ── Computed values ─────────────────────────────────────────────────────────────
  const uniqueOffBillNos = useMemo(() => {
    const billNos = new Set();
    expensesToShow.forEach((item) => {
      const bill = String(item.OFFBILLUID ?? "").trim();
      if (bill) billNos.add(bill);
    });
    return Array.from(billNos).sort();
  }, [expensesToShow]);

  const filteredOffBillNos = useMemo(() => {
    if (!searchTerm.trim()) return uniqueOffBillNos;
    const term = searchTerm.trim().toLowerCase();
    return uniqueOffBillNos.filter((billNo) =>
      billNo.toLowerCase().includes(term)
    );
  }, [uniqueOffBillNos, searchTerm]);

  const itemsForSelectedBill = useMemo(() => {
    if (!selectedOffBillNo) return [];
    const selected = String(selectedOffBillNo).trim();
    return expensesToShow.filter((item) => {
      const itemBill = String(item.OFFBILLUID ?? "").trim();
      return itemBill === selected;
    });
  }, [selectedOffBillNo, expensesToShow]);

  const totalOriginalAmount = useMemo(() =>
    itemsForSelectedBill.reduce((sum, item) => {
      const amt = String(item.Amount || "0").replace(/,/g, "");
      return sum + (parseFloat(amt) || 0);
    }, 0), [itemsForSelectedBill]);

  const totalRevisedAmount = useMemo(() =>
    itemsForSelectedBill.reduce((sum, item) => {
      const rev = revisedAmounts[item.uid];
      if (!rev) return sum;
      const clean = String(rev).replace(/,/g, "").trim();
      return sum + (parseFloat(clean) || 0);
    }, 0), [itemsForSelectedBill, revisedAmounts]);

  const allItemsHaveRevisedAmount = useMemo(() => {
    if (itemsForSelectedBill.length === 0) return false;
    return itemsForSelectedBill.every((item) => {
      const val = revisedAmounts[item.uid];
      return val !== undefined && val !== "" && !isNaN(parseFloat(val));
    });
  }, [itemsForSelectedBill, revisedAmounts]);

  const formatAmount = (amountStr) => {
    if (!amountStr) return "0.00";
    const clean = String(amountStr).replace(/,/g, "");
    const num = parseFloat(clean) || 0;
    return num.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // ── Handlers ────────────────────────────────────────────────────────────────────
  const handleRevisedAmountChange = (uid, value) => {
    setRevisedAmounts((prev) => ({ ...prev, [uid]: value }));
  };

  const clearSelection = () => {
    setSelectedOffBillNo("");
    setSearchTerm("");
    setRevisedAmounts({});
    setShowDropdown(false);
  };

  const openModal = () => {
    if (!allItemsHaveRevisedAmount) {
      alert("कृपया सभी आइटम्स के लिए Revised Amount भरें");
      return;
    }
    setFormData({ STATUS_2: "", REMARK_2: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.STATUS_2) {
      alert("कृपया स्टेटस चुनें");
      return;
    }
    try {
      const promises = itemsForSelectedBill.map((item) => {
        const payload = {
          uid: item.uid,
          STATUS_2: formData.STATUS_2,
          REVISED_AMOUNT_3: revisedAmounts[item.uid] || undefined,
          APPROVAL_DOER_2: item.APPROVAL_DOER || currentApprover || "Unknown",
          REMARK_2: formData.REMARK_2 || undefined,
        };
        return updateApproval(payload).unwrap();
      });

      await Promise.all(promises);
      alert("Approval updated successfully!");
      setIsModalOpen(false);
      setRevisedAmounts({});
    } catch (err) {
      console.error(err);
      alert("Failed to update: " + (err?.data?.message || err.message));
    }
  };

  // ── Loading / Error / Empty states ──────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className="flex items-center gap-4">
          <Loader2 className={`w-10 h-10 animate-spin ${isDarkMode ? "text-emerald-500" : "text-emerald-600"}`} />
          <span className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Loading pending approvals...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
        isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className={`text-xl font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
          Error: {error?.data?.message || "Failed to load data"}
        </div>
      </div>
    );
  }

  if (!currentApprover) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
        isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className={`text-xl font-bold ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
          No user information found in session. Please login again.
        </div>
      </div>
    );
  }

  if (expensesToShow.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center text-center p-6 ${
        isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black" : "bg-gradient-to-b from-gray-50 to-white"
      }`}>
        <div className={`space-y-4 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
          <div className="text-xl font-medium">
            No pending approvals {isAdmin ? "in the system" : "assigned to you"}.
          </div>
          <div className="text-base">
            Logged in as: <strong className={isDarkMode ? "text-gray-100" : "text-gray-900"}>{currentApprover}</strong>
            {isAdmin && <span className="ml-2 text-purple-500 font-semibold">(ADMIN)</span>}
          </div>
        </div>
      </div>
    );
  }

  // ── Main UI ─────────────────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen p-4 md:p-6 space-y-6 ${
      isDarkMode ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black text-gray-100" : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
    }`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pb-5 border-b ${
        isDarkMode ? "border-gray-700/60" : "border-gray-300"
      }`}>
        <div>
          <h2 className={`text-3xl md:text-4xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
            isDarkMode ? "from-cyan-300 via-blue-300 to-indigo-300" : "from-cyan-600 via-blue-600 to-indigo-600"
          }`}>
            RCC Office Expenses
          </h2>
          <p className={`text-xl mt-1 font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Level 1 Approval
          </p>
        </div>
        <div className={`flex items-center gap-3 px-5 py-2.5 rounded-xl border ${
          isDarkMode ? "bg-gray-800/70 border-gray-700/60" : "bg-white border-gray-300 shadow-sm"
        }`}>
          <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Approver:</span>
          <span className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{currentApprover}</span>
          {isAdmin && (
            <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
              isDarkMode ? "bg-purple-800/60 text-purple-200" : "bg-purple-100 text-purple-800"
            }`}>
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* Bill Selector – Sticky */}
      <div className="sticky top-0 z-20 pb-5 pt-2">
        <div className={`rounded-2xl border p-6 backdrop-blur-lg shadow-2xl ${
          isDarkMode ? "bg-gray-900/85 border-gray-700/60" : "bg-white/90 border-gray-300 shadow-xl"
        }`}>
          <label className={`block text-lg font-semibold mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-700"}`}>
            Select OFFBILL NO
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedOffBillNo || searchTerm}
              onChange={(e) => {
                if (selectedOffBillNo) {
                  if (e.target.value === "") clearSelection();
                  return;
                }
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => !selectedOffBillNo && setShowDropdown(true)}
              placeholder="Search OFFBILL NO..."
              className={`w-full px-5 py-4 pl-12 pr-16 border rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                isDarkMode
                  ? "bg-gray-800/90 border-gray-700 text-gray-100 focus:ring-cyan-600 focus:border-cyan-600"
                  : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
              }`}
            />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 ${
              isDarkMode ? "text-gray-500" : "text-gray-400"
            }`} />
            {selectedOffBillNo ? (
              <button
                onClick={clearSelection}
                className={`absolute right-5 top-1/2 -translate-y-1/2 transition ${
                  isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            ) : (
              <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`} />
            )}

            {showDropdown && !selectedOffBillNo && (
              <div className={`absolute z-50 w-full mt-2 border rounded-xl shadow-2xl max-h-80 overflow-y-auto backdrop-blur-md ${
                isDarkMode ? "bg-gray-900/95 border-gray-700" : "bg-white border-gray-300"
              }`}>
                {filteredOffBillNos.length > 0 ? (
                  filteredOffBillNos.map((billNo) => (
                    <div
                      key={billNo}
                      onClick={() => {
                        setSelectedOffBillNo(billNo);
                        setSearchTerm("");
                        setShowDropdown(false);
                        setRevisedAmounts({});
                      }}
                      className={`px-6 py-4 cursor-pointer border-b last:border-b-0 transition ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-cyan-950/60 hover:text-cyan-200 border-gray-800"
                          : "text-gray-700 hover:bg-cyan-50 hover:text-cyan-700 border-gray-200"
                      }`}
                    >
                      {billNo}
                    </div>
                  ))
                ) : (
                  <div className={`px-6 py-5 text-center ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}>
                    No matching bill number found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content when bill selected */}
      {selectedOffBillNo && (
        <>
          <div className={`p-4 rounded-xl text-sm border ${
            isDarkMode ? "bg-gray-800/60 text-gray-300 border-gray-700/50" : "bg-gray-100 text-gray-700 border-gray-300"
          }`}>
            <strong>Selected Bill:</strong>{" "}
            <span className={isDarkMode ? "text-cyan-300 font-medium" : "text-cyan-700 font-medium"}>{selectedOffBillNo}</span> •{" "}
            {itemsForSelectedBill.length} item{itemsForSelectedBill.length !== 1 ? "s" : ""}
          </div>

          {itemsForSelectedBill.length > 0 ? (
            <div className={`rounded-2xl border p-6 backdrop-blur-sm ${
              isDarkMode ? "bg-gray-900/50 border-gray-700/50" : "bg-white border-gray-300 shadow-md"
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className={`text-2xl font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                  Items for bill <span className={isDarkMode ? "text-cyan-400" : "text-cyan-600"}>{selectedOffBillNo}</span>
                </h3>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Fill revised amount for <strong>every item</strong> (mandatory)
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full table-auto min-w-max">
                  <thead>
                    <tr className={`text-white ${
                      isDarkMode ? "bg-gradient-to-r from-blue-950 via-indigo-950 to-blue-950" : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"
                    }`}>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">UID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Office Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Payee</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Item Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">QTY</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Original Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">
                        Revised Amount <span className="text-red-300">*</span>
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide">Approval Doer</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide">Bill</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${
                    isDarkMode ? "divide-gray-800/60 bg-gray-900/30" : "divide-gray-200 bg-white"
                  }`}>
                    {itemsForSelectedBill.map((item) => {
                      // ── Photo logic (same as previous component) ───────────────────────────────
                      const rawUrl = item.Bill_Photo || "";
                      const photoUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";

                      const hasValidPhoto =
                        photoUrl.length > 0 &&
                        photoUrl !== "No file uploaded" &&
                        photoUrl !== "null" &&
                        photoUrl !== "undefined" &&
                        !photoUrl.toLowerCase().includes("no file") &&
                        photoUrl.startsWith("http");

                      return (
                        <tr
                          key={item.uid}
                          className={`hover transition-colors ${
                            isDarkMode
                              ? revisedAmounts[item.uid]
                                ? "bg-emerald-950/30 hover:bg-emerald-950/50"
                                : "bg-red-950/20 hover:bg-red-950/40"
                              : revisedAmounts[item.uid]
                                ? "bg-emerald-50 hover:bg-emerald-100"
                                : "bg-red-50 hover:bg-red-100"
                          }`}
                        >
                          <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.uid}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.OFFICE_NAME_1 || "-"}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.PAYEE_NAME_1 || "-"}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.ITEM_NAME_1 || "-"}</td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>{item.Qty_1 || "-"}</td>
                          <td className={`px-6 py-4 text-sm font-medium ${isDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                            ₹{formatAmount(item.Amount)}
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={revisedAmounts[item.uid] || ""}
                              onChange={(e) => handleRevisedAmountChange(item.uid, e.target.value)}
                              placeholder="Required"
                              className={`w-full px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                isDarkMode
                                  ? revisedAmounts[item.uid]
                                    ? "bg-gray-800 border-emerald-600 focus:ring-emerald-500 text-gray-100"
                                    : "bg-gray-800 border-red-600 focus:ring-red-500 text-gray-100"
                                  : revisedAmounts[item.uid]
                                    ? "bg-white border-emerald-400 focus:ring-emerald-500 text-gray-900"
                                    : "bg-white border-red-400 focus:ring-red-500 text-gray-900"
                              }`}
                            />
                          </td>
                          <td className={`px-6 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {item.APPROVAL_DOER || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {hasValidPhoto ? (
                              <a
                                href={photoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center justify-center p-2.5 rounded-lg hover:scale-105 transition ${
                                  isDarkMode
                                    ? "bg-cyan-900/50 text-cyan-300 hover:bg-cyan-800/70"
                                    : "bg-cyan-100 text-cyan-700 hover:bg-cyan-200"
                                }`}
                                title="View bill photo"
                              >
                                <LucideImage className="w-5 h-5" />
                              </a>
                            ) : (
                              <span
                                className={`text-sm font-medium select-none pointer-events-none ${
                                  isDarkMode ? "text-gray-500" : "text-gray-400"
                                }`}
                              >
                                N/A
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className={`text-lg font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Total Original:{" "}
                  <span className={isDarkMode ? "text-emerald-400 font-semibold" : "text-emerald-600 font-semibold"}>
                    ₹{totalOriginalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                  <span className="ml-6">
                    Revised:{" "}
                    <span className={totalRevisedAmount > 0 ? (isDarkMode ? "text-emerald-400" : "text-emerald-600") : (isDarkMode ? "text-gray-400" : "text-gray-500")}>
                      ₹{totalRevisedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </span>
                </div>

                <button
                  onClick={openModal}
                  disabled={!allItemsHaveRevisedAmount || isUpdating}
                  className={`px-8 py-3.5 rounded-xl font-medium shadow-lg transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDarkMode
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  }`}
                >
                  <Edit3 className="w-5 h-5" />
                  Review & Approve ({itemsForSelectedBill.length} items)
                </button>
              </div>
            </div>
          ) : (
            <div className={`rounded-2xl border p-10 text-center backdrop-blur-sm ${
              isDarkMode ? "bg-gray-900/50 border-gray-700/50 text-gray-400" : "bg-gray-50 border-gray-300 text-gray-600"
            }`}>
              No items found for bill <strong className={isDarkMode ? "text-cyan-300" : "text-cyan-700"}>{selectedOffBillNo}</strong>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl border overflow-hidden ${
            isDarkMode ? "bg-gradient-to-b from-gray-900 to-black border-indigo-700/30" : "bg-gradient-to-b from-white to-gray-50 border-gray-300"
          }`}>
            <div className={`px-8 py-6 ${
              isDarkMode ? "bg-gradient-to-r from-blue-950 to-indigo-950" : "bg-gradient-to-r from-blue-100 to-indigo-100"
            }`}>
              <h3 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                Level 1 Approval – RCC
              </h3>
              <p className={`mt-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {itemsForSelectedBill.length} items • ₹
                {totalRevisedAmount.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Approval Status <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.STATUS_2}
                  onChange={(e) => setFormData({ ...formData, STATUS_2: e.target.value })}
                  className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-cyan-600"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500"
                  }`}
                >
                  <option value="">----- Select -----</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Remark
                </label>
                <textarea
                  value={formData.REMARK_2}
                  onChange={(e) => setFormData({ ...formData, REMARK_2: e.target.value })}
                  rows={3}
                  placeholder="Add remark if needed..."
                  className={`w-full px-5 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100 focus:ring-cyan-600"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-cyan-500"
                  }`}
                />
              </div>

              <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <strong>Approver:</strong> {currentApprover}
                {isAdmin && <span className={isDarkMode ? "text-purple-300 ml-2" : "text-purple-600 ml-2"}>(ADMIN)</span>}
              </div>

              <div className={`p-5 rounded-xl border ${
                isDarkMode ? "bg-gray-800/60 border-gray-700" : "bg-gray-50 border-gray-200"
              }`}>
                <p className={`text-sm font-semibold mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                  Items Summary:
                </p>
                <div className={`space-y-2 max-h-52 overflow-y-auto text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}>
                  {itemsForSelectedBill.map((item) => (
                    <div key={item.uid} className="flex justify-between">
                      <span className="truncate max-w-[320px]">{item.EXPENSES_DETAILS_1 || item.ITEM_NAME_1 || item.uid}</span>
                      <span className={isDarkMode ? "text-emerald-400 font-medium" : "text-emerald-600 font-medium"}>
                        ₹{formatAmount(revisedAmounts[item.uid] || item.Amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`px-8 py-6 flex gap-4 justify-end border-t ${
              isDarkMode ? "bg-gray-950/70 border-gray-800" : "bg-gray-100 border-gray-200"
            }`}>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-7 py-3 rounded-xl transition ${
                  isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isUpdating}
                className={`px-7 py-3 rounded-xl flex items-center gap-2.5 transition disabled:opacity-50 ${
                  isDarkMode
                    ? "bg-emerald-700 hover:bg-emerald-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Submit Approval
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RCC_Approvel;