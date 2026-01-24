

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux"; // ← added
// import { logout } from "../features/Auth/LoginSlice"; // ← yahan apna sahi path daal dena (example: '../features/auth/authSlice')

// import {
//   DollarSign,
//   ChevronDown,
//   LogOut,
//   Menu,
//   X,
//   Building2,
//   BarChart3,
//   Sun,
//   Moon,
// } from "lucide-react";

// // ── Import your actual page components ──
// // Adjust paths if needed
// import SummaryDashboard from "../../src/components/paymentSummary/Summary";

// import Reconciliation from "../components/Payment/Reconciliation";
// import Forms from "../components/Payment/Form";
// import ActualPaymentIn from "../components/Payment/Actual_Payment_in";
// import TransferBankToBank from "../components/Payment/Transfer_bank_To_bank";

// import RccApproval from "../components/RccOffice/RCC_Approvel";
// import ApprovalByMayaksir from "../components/RccOffice/Approvel_By_Mayaksir";
// import OfficeExpensesPayment from "../components/RccOffice/OfficeExpensesPayment";

// import VrnApproval1 from "../components/VRNOffice/VRN_Approvel1";
// import VrnApproval2 from "../components/VRNOffice/VRN_Approvel2";
// import VrnReport from "../components/VRNOffice/VRN_payment_Office";

// import DimApproval1 from "../components/DimensionOffice/Dim_Approvel1";
// import DimApproval2 from "../components/DimensionOffice/Dim_Approvel2";
// import DimensionTransfer from "../components/DimensionOffice/Dim_Payment_Office";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch(); // ← added for logout
//   const { isAuthenticated } = useSelector((state) => state.auth); // ← added

//   // Force redirect if not authenticated (logout ke baad ya token na hone par)
//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login", { replace: true });
//     }
//   }, [isAuthenticated, navigate]);

//   // Load saved state from localStorage
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(() => {
//     const saved = localStorage.getItem("selectedPage");
//     return saved && saved !== "null" ? saved : null;
//   });
//   const [selectedRccPage, setSelectedRccPage] = useState(() => {
//     const saved = localStorage.getItem("selectedRccPage");
//     return saved && saved !== "null" ? saved : null;
//   });
//   const [selectedVrnPage, setSelectedVrnPage] = useState(() => {
//     const saved = localStorage.getItem("selectedVrnPage");
//     return saved && saved !== "null" ? saved : null;
//   });
//   const [selectedDimensionPage, setSelectedDimensionPage] = useState(() => {
//     const saved = localStorage.getItem("selectedDimensionPage");
//     return saved && saved !== "null" ? saved : null;
//   });
//   const [isSummarySelected, setIsSummarySelected] = useState(() => {
//     const hasPaymentPage = localStorage.getItem("selectedPage") && localStorage.getItem("selectedPage") !== "null";
//     const hasRccPage = localStorage.getItem("selectedRccPage") && localStorage.getItem("selectedRccPage") !== "null";
//     const hasVrnPage = localStorage.getItem("selectedVrnPage") && localStorage.getItem("selectedVrnPage") !== "null";
//     const hasDimensionPage = localStorage.getItem("selectedDimensionPage") && localStorage.getItem("selectedDimensionPage") !== "null";
//     return !(hasPaymentPage || hasRccPage || hasVrnPage || hasDimensionPage);
//   });
//   const [isDarkMode, setIsDarkMode] = useState(() => {
//     const saved = localStorage.getItem("isDarkMode");
//     return saved ? JSON.parse(saved) : true;
//   });

//   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
//   const [isRccDropdownOpen, setIsRccDropdownOpen] = useState(false);
//   const [isVrnDropdownOpen, setIsVrnDropdownOpen] = useState(false);
//   const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);

//   const navbarRef = useRef(null);

//   const paymentPages = [
//     { id: "Reconciliation", name: "Reconciliation" },
//     { id: "Form", name: "Forms" },
//     { id: "Actual_Payment_in", name: "Actual Payment In" },
//     { id: "Transfer_bank_To_bank", name: "Transfer Bank to Bank" },
//   ];

//   const rccOfficePages = [
//     { id: "RCC_Approvel", name: "RCC Approval" },
//     { id: "Approvel_By_Mayaksir", name: "Approval By Mayanksir" },
//     { id: "OfficeExpensesPayment", name: "Office Expenses Payment" },
//   ];

//   const vrnOfficePages = [
//     { id: "VRN_Approvel1", name: "VRN Approval 1" },
//     { id: "VRN_Approvel2", name: "VRN Approval 2" },
//     { id: "VRN_Report", name: "VRN Report" },
//   ];

//   const dimensionOfficePages = [
//     { id: "Dim_Approvel1", name: "Dim Approval 1" },
//     { id: "Dim_Approvel2", name: "Dim Approval 2" },
//     { id: "Dimension_Transfer", name: "Dimension Transfer" },
//   ];

//   const selectPage = (id, type) => {
//     // Clear all selections
//     setSelectedPage(null);
//     setSelectedRccPage(null);
//     setSelectedVrnPage(null);
//     setSelectedDimensionPage(null);
//     setIsSummarySelected(false);

//     // Clear localStorage
//     localStorage.removeItem("selectedPage");
//     localStorage.removeItem("selectedRccPage");
//     localStorage.removeItem("selectedVrnPage");
//     localStorage.removeItem("selectedDimensionPage");

//     setIsPaymentDropdownOpen(false);
//     setIsRccDropdownOpen(false);
//     setIsVrnDropdownOpen(false);
//     setIsDimensionDropdownOpen(false);

//     if (type === "summary") {
//       setIsSummarySelected(true);
//     } else if (type === "payment") {
//       setSelectedPage(id);
//       localStorage.setItem("selectedPage", id);
//     } else if (type === "rcc") {
//       setSelectedRccPage(id);
//       localStorage.setItem("selectedRccPage", id);
//     } else if (type === "vrn") {
//       setSelectedVrnPage(id);
//       localStorage.setItem("selectedVrnPage", id);
//     } else if (type === "dimension") {
//       setSelectedDimensionPage(id);
//       localStorage.setItem("selectedDimensionPage", id);
//     }

//     // Mobile menu band kar do
//     setIsMobileMenuOpen(false);
//   };

//   const handleLogout = () => {
//     console.log("Logging out... dispatching RTK logout");
//     dispatch(logout()); // ← Yeh RTK logout call karega (sessionStorage + Redux clear)
//     setIsMobileMenuOpen(false);
//     // useEffect wala redirect handle karega
//   };

//   const toggleTheme = () => {
//     setIsDarkMode((prev) => {
//       const newMode = !prev;
//       localStorage.setItem("isDarkMode", JSON.stringify(newMode));
//       return newMode;
//     });
//   };

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (navbarRef.current && !navbarRef.current.contains(e.target)) {
//         setIsPaymentDropdownOpen(false);
//         setIsRccDropdownOpen(false);
//         setIsVrnDropdownOpen(false);
//         setIsDimensionDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Theme variables
//   const bgGradient = isDarkMode
//     ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950"
//     : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

//   const navBg = isDarkMode
//     ? "bg-black/40 backdrop-blur-xl border-white/10"
//     : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg";

//   const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
//   const textSecondary = isDarkMode ? "text-gray-200" : "text-gray-700";
//   const hoverBg = isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100";

//   const dropdownBg = isDarkMode
//     ? "bg-black/80 backdrop-blur-md border-white/10"
//     : "bg-white/95 backdrop-blur-md border-gray-200 shadow-xl";

//   const contentBg = isDarkMode
//     ? "bg-black/30 backdrop-blur-xl border-white/10"
//     : "bg-white/60 backdrop-blur-xl border-gray-200";

//   const orbColors = isDarkMode
//     ? ["bg-purple-700", "bg-blue-700", "bg-indigo-800"]
//     : ["bg-purple-300", "bg-blue-300", "bg-indigo-300"];

//   const particleColor = isDarkMode ? "bg-white" : "bg-indigo-400";

//   // ── Active component logic ──
//   let ActiveComponent = null;
//   let pageTitle = "";

//   if (isSummarySelected) {
//     ActiveComponent = SummaryDashboard;
//     pageTitle = "Summary Dashboard";
//   } else if (selectedPage) {
//     pageTitle = paymentPages.find((p) => p.id === selectedPage)?.name || "Payment";
//     if (selectedPage === "Reconciliation") ActiveComponent = Reconciliation;
//     else if (selectedPage === "Form") ActiveComponent = Forms;
//     else if (selectedPage === "Actual_Payment_in") ActiveComponent = ActualPaymentIn;
//     else if (selectedPage === "Transfer_bank_To_bank") ActiveComponent = TransferBankToBank;
//   } else if (selectedRccPage) {
//     pageTitle = rccOfficePages.find((p) => p.id === selectedRccPage)?.name || "RCC Office";
//     if (selectedRccPage === "RCC_Approvel") ActiveComponent = RccApproval;
//     else if (selectedRccPage === "Approvel_By_Mayaksir") ActiveComponent = ApprovalByMayaksir;
//     else if (selectedRccPage === "OfficeExpensesPayment") ActiveComponent = OfficeExpensesPayment;
//   } else if (selectedVrnPage) {
//     pageTitle = vrnOfficePages.find((p) => p.id === selectedVrnPage)?.name || "VRN Office";
//     if (selectedVrnPage === "VRN_Approvel1") ActiveComponent = VrnApproval1;
//     else if (selectedVrnPage === "VRN_Approvel2") ActiveComponent = VrnApproval2;
//     else if (selectedVrnPage === "VRN_Report") ActiveComponent = VrnReport;
//   } else if (selectedDimensionPage) {
//     pageTitle = dimensionOfficePages.find((p) => p.id === selectedDimensionPage)?.name || "Dimension";
//     if (selectedDimensionPage === "Dim_Approvel1") ActiveComponent = DimApproval1;
//     else if (selectedDimensionPage === "Dim_Approvel2") ActiveComponent = DimApproval2;
//     else if (selectedDimensionPage === "Dimension_Transfer") ActiveComponent = DimensionTransfer;
//   }

//   return (
//     <div className={`min-h-screen relative ${bgGradient} overflow-hidden transition-colors duration-300`}>
//       {/* Background orbs + particles */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className={`absolute -top-20 -left-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] ${orbColors[0]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow`}></div>
//         <div className={`absolute top-1/4 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] ${orbColors[1]} rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow`} style={{ animationDelay: "3s" }}></div>
//         <div className={`absolute -bottom-32 left-1/3 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] ${orbColors[2]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow`} style={{ animationDelay: "6s" }}></div>
//       </div>

//       <div className="absolute inset-0 pointer-events-none">
//         {[...Array(20)].map((_, i) => (
//           <div
//             key={i}
//             className={`absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 ${particleColor} rounded-full opacity-20`}
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animation: `float ${10 + Math.random() * 15}s linear infinite`,
//               animationDelay: `${Math.random() * 12}s`,
//             }}
//           />
//         ))}
//       </div>

//       {/* ── NAVBAR ── */}
//       <nav ref={navbarRef} className={`fixed top-0 left-0 right-0 z-50 ${navBg} border-b shadow-xl transition-colors duration-300`}>
//         <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8">
//           <div className="flex items-center justify-between h-14 sm:h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-2 sm:space-x-3">
//               <h1
//                 className={`text-base sm:text-lg lg:text-xl font-bold ${
//                   isDarkMode
//                     ? "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
//                     : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
//                 }`}
//               >
//                 Office Payments
//               </h1>
//             </div>

//             {/* ── DESKTOP NAVIGATION ── */}
//             <div className="hidden lg:flex items-center space-x-1">
//               {/* Summary */}
//               <button
//                 onClick={() => selectPage(null, "summary")}
//                 className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                   isSummarySelected
//                     ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md"
//                     : `${textPrimary} ${hoverBg}`
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 <span>Summary</span>
//               </button>

//               {/* Payment Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => {
//                     setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
//                     setIsRccDropdownOpen(false);
//                     setIsVrnDropdownOpen(false);
//                     setIsDimensionDropdownOpen(false);
//                   }}
//                   className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                     isPaymentDropdownOpen || selectedPage
//                       ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
//                       : `${textPrimary} ${hoverBg}`
//                   }`}
//                 >
//                   <DollarSign className="w-4 h-4" />
//                   <span>Payment</span>
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isPaymentDropdownOpen && (
//                   <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
//                     {paymentPages.map((page) => (
//                       <button
//                         key={page.id}
//                         onClick={() => selectPage(page.id, "payment")}
//                         className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
//                           selectedPage === page.id
//                             ? isDarkMode
//                               ? "bg-emerald-900/40 text-emerald-200 font-medium"
//                               : "bg-emerald-100 text-emerald-800 font-medium"
//                             : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
//                         }`}
//                       >
//                         {page.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* RCC Office Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => {
//                     setIsRccDropdownOpen(!isRccDropdownOpen);
//                     setIsPaymentDropdownOpen(false);
//                     setIsVrnDropdownOpen(false);
//                     setIsDimensionDropdownOpen(false);
//                   }}
//                   className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                     isRccDropdownOpen || selectedRccPage
//                       ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
//                       : `${textPrimary} ${hoverBg}`
//                   }`}
//                 >
//                   <Building2 className="w-4 h-4" />
//                   <span>RCC Office</span>
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isRccDropdownOpen && (
//                   <div className={`absolute top-full left-0 mt-2 w-64 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
//                     {rccOfficePages.map((page) => (
//                       <button
//                         key={page.id}
//                         onClick={() => selectPage(page.id, "rcc")}
//                         className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
//                           selectedRccPage === page.id
//                             ? isDarkMode
//                               ? "bg-purple-900/40 text-purple-200 font-medium"
//                               : "bg-purple-100 text-purple-800 font-medium"
//                             : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
//                         }`}
//                       >
//                         {page.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* VRN Office Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => {
//                     setIsVrnDropdownOpen(!isVrnDropdownOpen);
//                     setIsPaymentDropdownOpen(false);
//                     setIsRccDropdownOpen(false);
//                     setIsDimensionDropdownOpen(false);
//                   }}
//                   className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                     isVrnDropdownOpen || selectedVrnPage
//                       ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
//                       : `${textPrimary} ${hoverBg}`
//                   }`}
//                 >
//                   <Building2 className="w-4 h-4" />
//                   <span>VRN Office</span>
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isVrnDropdownOpen && (
//                   <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
//                     {vrnOfficePages.map((page) => (
//                       <button
//                         key={page.id}
//                         onClick={() => selectPage(page.id, "vrn")}
//                         className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
//                           selectedVrnPage === page.id
//                             ? isDarkMode
//                               ? "bg-indigo-900/40 text-indigo-200 font-medium"
//                               : "bg-indigo-100 text-indigo-800 font-medium"
//                             : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
//                         }`}
//                       >
//                         {page.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Dimension Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => {
//                     setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
//                     setIsPaymentDropdownOpen(false);
//                     setIsRccDropdownOpen(false);
//                     setIsVrnDropdownOpen(false);
//                   }}
//                   className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                     isDimensionDropdownOpen || selectedDimensionPage
//                       ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
//                       : `${textPrimary} ${hoverBg}`
//                   }`}
//                 >
//                   <Building2 className="w-4 h-4" />
//                   <span>Dimension</span>
//                   <ChevronDown
//                     className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </button>
//                 {isDimensionDropdownOpen && (
//                   <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
//                     {dimensionOfficePages.map((page) => (
//                       <button
//                         key={page.id}
//                         onClick={() => selectPage(page.id, "dimension")}
//                         className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
//                           selectedDimensionPage === page.id
//                             ? isDarkMode
//                               ? "bg-rose-900/40 text-rose-200 font-medium"
//                               : "bg-rose-100 text-rose-800 font-medium"
//                             : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
//                         }`}
//                       >
//                         {page.name}
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right side - Desktop */}
//             <div className="hidden lg:flex items-center space-x-2">
//               <button
//                 onClick={toggleTheme}
//                 className={`p-2 rounded-lg ${hoverBg} transition-all`}
//                 title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
//               >
//                 {isDarkMode ? <Sun className={`w-5 h-5 ${textPrimary}`} /> : <Moon className={`w-5 h-5 ${textPrimary}`} />}
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg ${
//                   isDarkMode ? "text-red-400 hover:bg-red-900/30 hover:text-red-300" : "text-red-600 hover:bg-red-50 hover:text-red-700"
//                 } transition-all text-sm font-medium`}
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </div>

//             {/* Mobile menu toggle */}
//             <div className="flex lg:hidden items-center space-x-2">
//               <button onClick={toggleTheme} className={`p-2 rounded-lg ${hoverBg}`}>
//                 {isDarkMode ? <Sun className={`w-5 h-5 ${textPrimary}`} /> : <Moon className={`w-5 h-5 ${textPrimary}`} />}
//               </button>
//               <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 rounded-lg ${hoverBg}`}>
//                 <Menu className={`w-6 h-6 ${textPrimary}`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* ── MOBILE MENU ── */}
//       {isMobileMenuOpen && (
//         <>
//           <div
//             className={`fixed inset-0 ${isDarkMode ? "bg-black/70" : "bg-gray-900/50"} backdrop-blur-sm z-40 lg:hidden`}
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           <div
//             className={`fixed inset-y-0 right-0 w-full sm:w-80 ${
//               isDarkMode ? "bg-black/90" : "bg-white/95"
//             } backdrop-blur-xl shadow-2xl z-50 lg:hidden transform transition-transform overflow-y-auto border-l ${
//               isDarkMode ? "border-white/10" : "border-gray-200"
//             }`}
//           >
//             <div className="flex flex-col h-full">
//               <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
//                 <h2 className={`text-lg font-bold ${textPrimary}`}>Menu</h2>
//                 <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 ${hoverBg} rounded-lg`}>
//                   <X className={`w-6 h-6 ${textPrimary}`} />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
//                 {/* Summary */}
//                 <button
//                   onClick={() => selectPage(null, "summary")}
//                   className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
//                     isSummarySelected
//                       ? "bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-md"
//                       : `${textSecondary} ${hoverBg}`
//                   }`}
//                 >
//                   <BarChart3 className="w-5 h-5" />
//                   <span className="font-medium">Summary</span>
//                 </button>

//                 {/* Payment */}
//                 <div>
//                   <button
//                     onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
//                       isPaymentDropdownOpen || selectedPage
//                         ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md"
//                         : `${textSecondary} ${hoverBg}`
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <DollarSign className="w-5 h-5" />
//                       <span className="font-medium">Payment</span>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isPaymentDropdownOpen && (
//                     <div className="ml-6 mt-2 space-y-1">
//                       {paymentPages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "payment")}
//                           className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
//                             selectedPage === page.id
//                               ? isDarkMode
//                                 ? "bg-emerald-900/50 text-emerald-200 font-medium"
//                                 : "bg-emerald-100 text-emerald-800 font-medium"
//                               : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
//                                   isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
//                                 }`
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* RCC Office */}
//                 <div>
//                   <button
//                     onClick={() => setIsRccDropdownOpen(!isRccDropdownOpen)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
//                       isRccDropdownOpen || selectedRccPage
//                         ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md"
//                         : `${textSecondary} ${hoverBg}`
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <Building2 className="w-5 h-5" />
//                       <span className="font-medium">RCC Office</span>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isRccDropdownOpen && (
//                     <div className="ml-6 mt-2 space-y-1">
//                       {rccOfficePages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "rcc")}
//                           className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
//                             selectedRccPage === page.id
//                               ? isDarkMode
//                                 ? "bg-purple-900/50 text-purple-200 font-medium"
//                                 : "bg-purple-100 text-purple-800 font-medium"
//                               : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
//                                   isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
//                                 }`
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* VRN Office */}
//                 <div>
//                   <button
//                     onClick={() => setIsVrnDropdownOpen(!isVrnDropdownOpen)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
//                       isVrnDropdownOpen || selectedVrnPage
//                         ? "bg-gradient-to-r from-indigo-700 to-blue-700 text-white shadow-md"
//                         : `${textSecondary} ${hoverBg}`
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <Building2 className="w-5 h-5" />
//                       <span className="font-medium">VRN Office</span>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isVrnDropdownOpen && (
//                     <div className="ml-6 mt-2 space-y-1">
//                       {vrnOfficePages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "vrn")}
//                           className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
//                             selectedVrnPage === page.id
//                               ? isDarkMode
//                                 ? "bg-indigo-900/50 text-indigo-200 font-medium"
//                                 : "bg-indigo-100 text-indigo-800 font-medium"
//                               : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
//                                   isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
//                                 }`
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Dimension Office */}
//                 <div>
//                   <button
//                     onClick={() => setIsDimensionDropdownOpen(!isDimensionDropdownOpen)}
//                     className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
//                       isDimensionDropdownOpen || selectedDimensionPage
//                         ? "bg-gradient-to-r from-pink-700 to-rose-700 text-white shadow-md"
//                         : `${textSecondary} ${hoverBg}`
//                     }`}
//                   >
//                     <div className="flex items-center space-x-3">
//                       <Building2 className="w-5 h-5" />
//                       <span className="font-medium">Dimension Office</span>
//                     </div>
//                     <ChevronDown className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`} />
//                   </button>
//                   {isDimensionDropdownOpen && (
//                     <div className="ml-6 mt-2 space-y-1">
//                       {dimensionOfficePages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "dimension")}
//                           className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
//                             selectedDimensionPage === page.id
//                               ? isDarkMode
//                                 ? "bg-rose-900/50 text-rose-200 font-medium"
//                                 : "bg-rose-100 text-rose-800 font-medium"
//                               : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
//                                   isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
//                                 }`
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className={`p-4 sm:p-5 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
//                 <button
//                   onClick={handleLogout}
//                   className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl ${
//                     isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"
//                   } transition-all font-medium`}
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* ── MAIN CONTENT ── */}
//       <main className="relative z-10 pt-16 sm:pt-20">
//         <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
//           <div
//             className={`${contentBg} backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)] border`}
//           >
//             {ActiveComponent ? (
//               <>
//                 <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center md:text-left">
//                   {pageTitle}
//                 </h2>
//                 <div className="mt-4">
//                   <ActiveComponent />
//                 </div>
//               </>
//             ) : (
//               <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16 lg:py-20">
//                 <div
//                   className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${
//                     isDarkMode ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20" : "bg-gradient-to-br from-indigo-200 to-purple-200"
//                   } rounded-2xl flex items-center justify-center mb-6 sm:mb-8 animate-pulse`}
//                 >
//                   <DollarSign
//                     className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${
//                       isDarkMode ? "text-indigo-300" : "text-indigo-600"
//                     } opacity-80`}
//                   />
//                 </div>
//                 <h3
//                   className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 ${
//                     isDarkMode
//                       ? "bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent"
//                       : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
//                   }`}
//                 >
//                   Welcome to Office Payments Dashboard
//                 </h3>
//                 <p className={`${isDarkMode ? "text-indigo-200/70" : "text-indigo-700/80"} max-w-lg text-base sm:text-lg px-4`}>
//                   Select a module from the navigation bar to start managing payments, approvals and reports.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Animations */}
//       <style jsx global>{`
//         @keyframes float {
//           0%,
//           100% {
//             transform: translate(0, 0);
//           }
//           50% {
//             transform: translate(${Math.random() > 0.5 ? "" : "-"}40px, -80px);
//           }
//         }

//         .animate-pulse-slow {
//           animation: pulse 20s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }

//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 0.2;
//             transform: scale(1);
//           }
//           50% {
//             opacity: 0.4;
//             transform: scale(1.12);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/Auth/LoginSlice";

import {
  DollarSign,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Building2,
  BarChart3,
  Sun,
  Moon,
} from "lucide-react";

// Components imports
import SummaryDashboard from "../../src/components/paymentSummary/Summary";

import Reconciliation from "../components/Payment/Reconciliation";
import Forms from "../components/Payment/Form";
import ActualPaymentIn from "../components/Payment/Actual_Payment_in";
import TransferBankToBank from "../components/Payment/Transfer_bank_To_bank";

import RccApproval from "../components/RccOffice/RCC_Approvel";
import ApprovalByMayaksir from "../components/RccOffice/Approvel_By_Mayaksir";
import OfficeExpensesPayment from "../components/RccOffice/OfficeExpensesPayment";

import VrnApproval1 from "../components/VRNOffice/VRN_Approvel1";
import VrnApproval2 from "../components/VRNOffice/VRN_Approvel2";
import VrnReport from "../components/VRNOffice/VRN_payment_Office";

import DimApproval1 from "../components/DimensionOffice/Dim_Approvel1";
import DimApproval2 from "../components/DimensionOffice/Dim_Approvel2";
import DimensionTransfer from "../components/DimensionOffice/Dim_Payment_Office";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(() => {
    const saved = localStorage.getItem("selectedPage");
    return saved && saved !== "null" ? saved : null;
  });
  const [selectedRccPage, setSelectedRccPage] = useState(() => {
    const saved = localStorage.getItem("selectedRccPage");
    return saved && saved !== "null" ? saved : null;
  });
  const [selectedVrnPage, setSelectedVrnPage] = useState(() => {
    const saved = localStorage.getItem("selectedVrnPage");
    return saved && saved !== "null" ? saved : null;
  });
  const [selectedDimensionPage, setSelectedDimensionPage] = useState(() => {
    const saved = localStorage.getItem("selectedDimensionPage");
    return saved && saved !== "null" ? saved : null;
  });
  const [isSummarySelected, setIsSummarySelected] = useState(() => {
    const hasPayment = localStorage.getItem("selectedPage") && localStorage.getItem("selectedPage") !== "null";
    const hasRcc = localStorage.getItem("selectedRccPage") && localStorage.getItem("selectedRccPage") !== "null";
    const hasVrn = localStorage.getItem("selectedVrnPage") && localStorage.getItem("selectedVrnPage") !== "null";
    const hasDim = localStorage.getItem("selectedDimensionPage") && localStorage.getItem("selectedDimensionPage") !== "null";
    return !(hasPayment || hasRcc || hasVrn || hasDim);
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("isDarkMode");
    return saved ? JSON.parse(saved) : true;
  });

  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isRccDropdownOpen, setIsRccDropdownOpen] = useState(false);
  const [isVrnDropdownOpen, setIsVrnDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);

  const navbarRef = useRef(null);

  const paymentPages = [
    { id: "Reconciliation", name: "Reconciliation" },
    { id: "Form", name: "Forms" },
    { id: "Actual_Payment_in", name: "Actual Payment In" },
    { id: "Transfer_bank_To_bank", name: "Transfer Bank to Bank" },
  ];

  const rccOfficePages = [
    { id: "RCC_Approvel", name: "RCC Approval" },
    { id: "Approvel_By_Mayaksir", name: "Approval By Mayanksir" },
    { id: "OfficeExpensesPayment", name: "Office Expenses Payment" },
  ];

  const vrnOfficePages = [
    { id: "VRN_Approvel1", name: "VRN Approval 1" },
    { id: "VRN_Approvel2", name: "VRN Approval 2" },
    { id: "VRN_Report", name: "VRN Report" },
  ];

  const dimensionOfficePages = [
    { id: "Dim_Approvel1", name: "Dim Approval 1" },
    { id: "Dim_Approvel2", name: "Dim Approval 2" },
    { id: "Dimension_Transfer", name: "Dimension Transfer" },
  ];

  const selectPage = (id, type) => {
    // Close dropdowns first
    setIsPaymentDropdownOpen(false);
    setIsRccDropdownOpen(false);
    setIsVrnDropdownOpen(false);
    setIsDimensionDropdownOpen(false);

    // Clear localStorage
    localStorage.removeItem("selectedPage");
    localStorage.removeItem("selectedRccPage");
    localStorage.removeItem("selectedVrnPage");
    localStorage.removeItem("selectedDimensionPage");

    // Set new state based on type
    if (type === "summary") {
      setSelectedPage(null);
      setSelectedRccPage(null);
      setSelectedVrnPage(null);
      setSelectedDimensionPage(null);
      setIsSummarySelected(true);
    } else if (type === "payment") {
      setSelectedRccPage(null);
      setSelectedVrnPage(null);
      setSelectedDimensionPage(null);
      setIsSummarySelected(false);
      setSelectedPage(id);
      localStorage.setItem("selectedPage", id);
    } else if (type === "rcc") {
      setSelectedPage(null);
      setSelectedVrnPage(null);
      setSelectedDimensionPage(null);
      setIsSummarySelected(false);
      setSelectedRccPage(id);
      localStorage.setItem("selectedRccPage", id);
    } else if (type === "vrn") {
      setSelectedPage(null);
      setSelectedRccPage(null);
      setSelectedDimensionPage(null);
      setIsSummarySelected(false);
      setSelectedVrnPage(id);
      localStorage.setItem("selectedVrnPage", id);
    } else if (type === "dimension") {
      setSelectedPage(null);
      setSelectedRccPage(null);
      setSelectedVrnPage(null);
      setIsSummarySelected(false);
      setSelectedDimensionPage(id);
      localStorage.setItem("selectedDimensionPage", id);
    }

    // Mobile menu close
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("isDarkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setIsPaymentDropdownOpen(false);
        setIsRccDropdownOpen(false);
        setIsVrnDropdownOpen(false);
        setIsDimensionDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Theme styles
  const bgGradient = isDarkMode
    ? "bg-gradient-to-br from-black via-indigo-950 to-purple-950"
    : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50";

  const navBg = isDarkMode
    ? "bg-black/40 backdrop-blur-xl border-white/10"
    : "bg-white/80 backdrop-blur-xl border-gray-200 shadow-lg";

  const textPrimary = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondary = isDarkMode ? "text-gray-200" : "text-gray-700";
  const hoverBg = isDarkMode ? "hover:bg-white/10" : "hover:bg-gray-100";

  const dropdownBg = isDarkMode
    ? "bg-black/80 backdrop-blur-md border-white/10"
    : "bg-white/95 backdrop-blur-md border-gray-200 shadow-xl";

  const contentBg = isDarkMode
    ? "bg-black/30 backdrop-blur-xl border-white/10"
    : "bg-white/60 backdrop-blur-xl border-gray-200";

  const orbColors = isDarkMode
    ? ["bg-purple-700", "bg-blue-700", "bg-indigo-800"]
    : ["bg-purple-300", "bg-blue-300", "bg-indigo-300"];

  const particleColor = isDarkMode ? "bg-white" : "bg-indigo-400";

  // Active Component Logic
  let ActiveComponent = null;
  let pageTitle = "";

  if (isSummarySelected) {
    ActiveComponent = SummaryDashboard;
    pageTitle = "Summary Dashboard";
  } else if (selectedPage) {
    pageTitle = paymentPages.find((p) => p.id === selectedPage)?.name || "Payment";
    if (selectedPage === "Reconciliation") ActiveComponent = Reconciliation;
    else if (selectedPage === "Form") ActiveComponent = Forms;
    else if (selectedPage === "Actual_Payment_in") ActiveComponent = ActualPaymentIn;
    else if (selectedPage === "Transfer_bank_To_bank") ActiveComponent = TransferBankToBank;
  } else if (selectedRccPage) {
    pageTitle = rccOfficePages.find((p) => p.id === selectedRccPage)?.name || "RCC Office";
    if (selectedRccPage === "RCC_Approvel") ActiveComponent = RccApproval;
    else if (selectedRccPage === "Approvel_By_Mayaksir") ActiveComponent = ApprovalByMayaksir;
    else if (selectedRccPage === "OfficeExpensesPayment") ActiveComponent = OfficeExpensesPayment;
  } else if (selectedVrnPage) {
    pageTitle = vrnOfficePages.find((p) => p.id === selectedVrnPage)?.name || "VRN Office";
    if (selectedVrnPage === "VRN_Approvel1") ActiveComponent = VrnApproval1;
    else if (selectedVrnPage === "VRN_Approvel2") ActiveComponent = VrnApproval2;
    else if (selectedVrnPage === "VRN_Report") ActiveComponent = VrnReport;
  } else if (selectedDimensionPage) {
    pageTitle = dimensionOfficePages.find((p) => p.id === selectedDimensionPage)?.name || "Dimension";
    if (selectedDimensionPage === "Dim_Approvel1") ActiveComponent = DimApproval1;
    else if (selectedDimensionPage === "Dim_Approvel2") ActiveComponent = DimApproval2;
    else if (selectedDimensionPage === "Dimension_Transfer") ActiveComponent = DimensionTransfer;
  }

  return (
    <div className={`min-h-screen relative ${bgGradient} overflow-hidden transition-colors duration-300`}>
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-20 -left-20 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] ${orbColors[0]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow`}></div>
        <div className={`absolute top-1/4 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] lg:w-[600px] lg:h-[600px] ${orbColors[1]} rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow`} style={{ animationDelay: "3s" }}></div>
        <div className={`absolute -bottom-32 left-1/3 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[450px] lg:h-[450px] ${orbColors[2]} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow`} style={{ animationDelay: "6s" }}></div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 ${particleColor} rounded-full opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${10 + Math.random() * 15}s linear infinite`,
              animationDelay: `${Math.random() * 12}s`,
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <nav ref={navbarRef} className={`fixed top-0 left-0 right-0 z-50 ${navBg} border-b shadow-xl transition-colors duration-300`}>
        <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <h1
                className={`text-base sm:text-lg lg:text-xl font-bold ${
                  isDarkMode
                    ? "bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                }`}
              >
                Office Payments
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => selectPage(null, "summary")}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isSummarySelected
                    ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md"
                    : `${textPrimary} ${hoverBg}`
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Summary</span>
              </button>

              {/* Payment Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
                    setIsRccDropdownOpen(false);
                    setIsVrnDropdownOpen(false);
                    setIsDimensionDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isPaymentDropdownOpen || selectedPage
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                      : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Payment</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isPaymentDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
                    {paymentPages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => selectPage(page.id, "payment")}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                          selectedPage === page.id
                            ? isDarkMode
                              ? "bg-emerald-900/40 text-emerald-200 font-medium"
                              : "bg-emerald-100 text-emerald-800 font-medium"
                            : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
                        }`}
                      >
                        {page.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* RCC Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsRccDropdownOpen(!isRccDropdownOpen);
                    setIsPaymentDropdownOpen(false);
                    setIsVrnDropdownOpen(false);
                    setIsDimensionDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isRccDropdownOpen || selectedRccPage
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                      : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>RCC Office</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isRccDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-64 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
                    {rccOfficePages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => selectPage(page.id, "rcc")}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                          selectedRccPage === page.id
                            ? isDarkMode
                              ? "bg-purple-900/40 text-purple-200 font-medium"
                              : "bg-purple-100 text-purple-800 font-medium"
                            : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
                        }`}
                      >
                        {page.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* VRN Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsVrnDropdownOpen(!isVrnDropdownOpen);
                    setIsPaymentDropdownOpen(false);
                    setIsRccDropdownOpen(false);
                    setIsDimensionDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isVrnDropdownOpen || selectedVrnPage
                      ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                      : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>VRN Office</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isVrnDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
                    {vrnOfficePages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => selectPage(page.id, "vrn")}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                          selectedVrnPage === page.id
                            ? isDarkMode
                              ? "bg-indigo-900/40 text-indigo-200 font-medium"
                              : "bg-indigo-100 text-indigo-800 font-medium"
                            : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
                        }`}
                      >
                        {page.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dimension Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
                    setIsPaymentDropdownOpen(false);
                    setIsRccDropdownOpen(false);
                    setIsVrnDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    isDimensionDropdownOpen || selectedDimensionPage
                      ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                      : `${textPrimary} ${hoverBg}`
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Dimension</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isDimensionDropdownOpen && (
                  <div className={`absolute top-full left-0 mt-2 w-56 ${dropdownBg} rounded-xl border py-2 z-50 shadow-2xl`}>
                    {dimensionOfficePages.map((page) => (
                      <button
                        key={page.id}
                        onClick={() => selectPage(page.id, "dimension")}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                          selectedDimensionPage === page.id
                            ? isDarkMode
                              ? "bg-rose-900/40 text-rose-200 font-medium"
                              : "bg-rose-100 text-rose-800 font-medium"
                            : `${textSecondary} ${isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"}`
                        }`}
                      >
                        {page.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Right Icons */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${hoverBg} transition-all`}
                title={isDarkMode ? "Light Mode" : "Dark Mode"}
              >
                {isDarkMode ? <Sun className={`w-5 h-5 ${textPrimary}`} /> : <Moon className={`w-5 h-5 ${textPrimary}`} />}
              </button>
              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg ${
                  isDarkMode ? "text-red-400 hover:bg-red-900/30 hover:text-red-300" : "text-red-600 hover:bg-red-50 hover:text-red-700"
                } transition-all text-sm font-medium`}
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Icons */}
            <div className="flex lg:hidden items-center space-x-2">
              <button onClick={toggleTheme} className={`p-2 rounded-lg ${hoverBg}`}>
                {isDarkMode ? <Sun className={`w-5 h-5 ${textPrimary}`} /> : <Moon className={`w-5 h-5 ${textPrimary}`} />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(true)} className={`p-2 rounded-lg ${hoverBg}`}>
                <Menu className={`w-6 h-6 ${textPrimary}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay + Panel */}
      {isMobileMenuOpen && (
        <>
          <div
            className={`fixed inset-0 ${isDarkMode ? "bg-black/70" : "bg-gray-900/50"} backdrop-blur-sm z-40 lg:hidden`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            className={`fixed inset-y-0 right-0 w-full sm:w-80 ${
              isDarkMode ? "bg-black/90" : "bg-white/95"
            } backdrop-blur-xl shadow-2xl z-50 lg:hidden transform transition-transform overflow-y-auto border-l ${
              isDarkMode ? "border-white/10" : "border-gray-200"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                <h2 className={`text-lg font-bold ${textPrimary}`}>Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className={`p-2 ${hoverBg} rounded-lg`}>
                  <X className={`w-6 h-6 ${textPrimary}`} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
                {/* Summary */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPage(null, "summary");
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isSummarySelected
                      ? "bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-md"
                      : `${textSecondary} ${hoverBg}`
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Summary</span>
                </button>

                {/* Payment */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isPaymentDropdownOpen || selectedPage
                        ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md"
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-medium">Payment</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isPaymentDropdownOpen && (
                    <div className="ml-6 mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                      {paymentPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "payment");
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "payment");
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                            selectedPage === page.id
                              ? isDarkMode
                                ? "bg-emerald-900/50 text-emerald-200 font-medium"
                                : "bg-emerald-100 text-emerald-800 font-medium"
                              : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
                                  isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                                }`
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* RCC */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRccDropdownOpen(!isRccDropdownOpen);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isRccDropdownOpen || selectedRccPage
                        ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md"
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">RCC Office</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isRccDropdownOpen && (
                    <div className="ml-6 mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                      {rccOfficePages.map((page) => (
                        <button
                          key={page.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "rcc");
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "rcc");
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                            selectedRccPage === page.id
                              ? isDarkMode
                                ? "bg-purple-900/50 text-purple-200 font-medium"
                                : "bg-purple-100 text-purple-800 font-medium"
                              : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
                                  isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                                }`
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* VRN */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsVrnDropdownOpen(!isVrnDropdownOpen);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isVrnDropdownOpen || selectedVrnPage
                        ? "bg-gradient-to-r from-indigo-700 to-blue-700 text-white shadow-md"
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">VRN Office</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isVrnDropdownOpen && (
                    <div className="ml-6 mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                      {vrnOfficePages.map((page) => (
                        <button
                          key={page.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "vrn");
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "vrn");
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                            selectedVrnPage === page.id
                              ? isDarkMode
                                ? "bg-indigo-900/50 text-indigo-200 font-medium"
                                : "bg-indigo-100 text-indigo-800 font-medium"
                              : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
                                  isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                                }`
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Dimension */}
                <div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isDimensionDropdownOpen || selectedDimensionPage
                        ? "bg-gradient-to-r from-pink-700 to-rose-700 text-white shadow-md"
                        : `${textSecondary} ${hoverBg}`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Building2 className="w-5 h-5" />
                      <span className="font-medium">Dimension Office</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isDimensionDropdownOpen && (
                    <div className="ml-6 mt-2 space-y-1" onClick={(e) => e.stopPropagation()}>
                      {dimensionOfficePages.map((page) => (
                        <button
                          key={page.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "dimension");
                          }}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            selectPage(page.id, "dimension");
                          }}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                            selectedDimensionPage === page.id
                              ? isDarkMode
                                ? "bg-rose-900/50 text-rose-200 font-medium"
                                : "bg-rose-100 text-rose-800 font-medium"
                              : `${isDarkMode ? "text-gray-300" : "text-gray-600"} ${
                                  isDarkMode ? "hover:bg-white/5" : "hover:bg-gray-100"
                                }`
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Logout in Mobile Menu */}
              <div className={`p-4 sm:p-5 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl ${
                    isDarkMode ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"
                  } transition-all font-medium`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="relative z-10 pt-16 sm:pt-20">
        <div className="w-full p-3 sm:p-4 md:p-6 lg:p-8">
          <div
            className={`${contentBg} backdrop-blur-xl rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-6rem)] sm:min-h-[calc(100vh-8rem)] border`}
          >
            {ActiveComponent ? (
              <>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 text-center md:text-left">
                  {pageTitle}
                </h2>
                <div className="mt-4">
                  <ActiveComponent />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12 sm:py-16 lg:py-20">
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${
                    isDarkMode ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/20" : "bg-gradient-to-br from-indigo-200 to-purple-200"
                  } rounded-2xl flex items-center justify-center mb-6 sm:mb-8 animate-pulse`}
                >
                  <DollarSign
                    className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${
                      isDarkMode ? "text-indigo-300" : "text-indigo-600"
                    } opacity-80`}
                  />
                </div>
                <h3
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 ${
                    isDarkMode
                      ? "bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  }`}
                >
                  Welcome to Office Payments Dashboard
                </h3>
                <p className={`${isDarkMode ? "text-indigo-200/70" : "text-indigo-700/80"} max-w-lg text-base sm:text-lg px-4`}>
                  Select a module from the navigation bar to start managing payments, approvals and reports.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? "" : "-"}40px, -80px); }
        }
        .animate-pulse-slow {
          animation: pulse 20s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;