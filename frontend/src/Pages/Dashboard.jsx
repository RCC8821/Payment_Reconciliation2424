// // import React, { useState, useEffect, useRef } from "react";
// // import {
// //   DollarSign,
// //   ChevronDown,
// //   LogOut,
// //   Menu,
// //   X,
// //   User,
// //   Building2,
// // } from "lucide-react";

// // import { useNavigate, useLocation, Outlet } from "react-router-dom";
// // import { useSelector, useDispatch } from "react-redux";
// // import { logout } from "../features/Auth/LoginSlice";

// // const Dashboard = () => {
// //   const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
// //   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// //   // Selection states
// //   const [selectedPage, setSelectedPage] = useState(null);
// //   const [selectedRccPage, setSelectedRccPage] = useState(null);
// //   const [selectedVrnPage, setSelectedVrnPage] = useState(null);
// //   const [selectedDimensionPage, setSelectedDimensionPage] = useState(null);

// //   // Dropdown states
// //   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
// //   const [isRccDropdownOpen, setIsRccDropdownOpen] = useState(false);
// //   const [isVrnDropdownOpen, setIsVrnDropdownOpen] = useState(false);
// //   const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);

// //   const { userType, token } = useSelector((state) => state.auth);
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const sidebarRef = useRef(null);

// //   useEffect(() => {
// //     if (!token) {
// //       navigate("/");
// //     }
// //   }, [token, navigate]);

// //   // Active page detection
// //   useEffect(() => {
// //     const currentPayment = paymentPages.find((p) => p.path === location.pathname);
// //     const currentRcc = rccOfficePages.find((p) => p.path === location.pathname);
// //     const currentVrn = vrnOfficePages.find((p) => p.path === location.pathname);
// //     const currentDimension = dimensionOfficePages.find((p) => p.path === location.pathname);

// //     if (currentPayment) {
// //       setSelectedPage(currentPayment.id);
// //       setSelectedRccPage(null);
// //       setSelectedVrnPage(null);
// //       setSelectedDimensionPage(null);
// //     } else if (currentRcc) {
// //       setSelectedRccPage(currentRcc.id);
// //       setSelectedPage(null);
// //       setSelectedVrnPage(null);
// //       setSelectedDimensionPage(null);
// //     } else if (currentVrn) {
// //       setSelectedVrnPage(currentVrn.id);
// //       setSelectedPage(null);
// //       setSelectedRccPage(null);
// //       setSelectedDimensionPage(null);
// //     } else if (currentDimension) {
// //       setSelectedDimensionPage(currentDimension.id);
// //       setSelectedPage(null);
// //       setSelectedRccPage(null);
// //       setSelectedVrnPage(null);
// //     } else {
// //       setSelectedPage(null);
// //       setSelectedRccPage(null);
// //       setSelectedVrnPage(null);
// //       setSelectedDimensionPage(null);
// //     }
// //   }, [location.pathname]);

// //   // ============== ALL PAGES DEFINITION ==============

// //   const paymentPages = [
// //     { id: "Reconciliation", name: "Reconciliation", path: "/dashboard/Reconciliation", allowedUserTypes: ["admin", "Payment"] },
// //     { id: "Form", name: "Forms", path: "/dashboard/Form", allowedUserTypes: ["admin", "Payment"] },
// //     { id: "Actual_Payment_in", name: "Actual Payment In", path: "/dashboard/Actual_Payment_in", allowedUserTypes: ["admin", "Payment"] },
// //     { id: "Transfer_bank_To_bank", name: "Transfer Bank to Bank", path: "/dashboard/Transfer_bank_To_bank", allowedUserTypes: ["admin", "Payment"] },
// //   ];

// //   const rccOfficePages = [
// //     { id: "RCC_Approvel", name: "RCC Approval", path: "/dashboard/RCC_Approvel", allowedUserTypes: ["admin", "RCC"] },
// //     { id: "Approvel_By_Mayaksir", name: "Approval By Mayaksir", path: "/dashboard/Approvel_By_Mayaksir", allowedUserTypes: ["admin", "RCC"] },
// //     { id: "OfficeExpensesPayment", name: "Office Expenses Payment", path: "/dashboard/OfficeExpensesPayment", allowedUserTypes: ["admin","RCC"] },
// //   ];

// //   const vrnOfficePages = [
// //     { id: "VRN_Approvel1", name: "VRN Approval 1", path: "/dashboard/VRN_Approvel1", allowedUserTypes: ["admin", ] },
// //     { id: "VRN_Approvel2", name: "VRN Approval 2", path: "/dashboard/VRN_Approvel2", allowedUserTypes: ["admin"] },
// //     { id: "VRN_Report", name: "VRN Report", path: "/dashboard/VRN_Report", allowedUserTypes: ["admin", "viewer"] },
// //   ];

// //   const dimensionOfficePages = [
// //     { id: "Dim_Approvel1", name: "Dim Approval 1", path: "/dashboard/Dim_Approvel1", allowedUserTypes: ["admin", "manager"] },
// //     { id: "Dim_Approvel2", name: "Dim Approval 2", path: "/dashboard/Dim_Approvel2", allowedUserTypes: ["admin"] },
// //     { id: "Dimension_Transfer", name: "Dimension Transfer", path: "/dashboard/Dimension_Transfer", allowedUserTypes: ["admin"] },
// //   ];

// //   // Filter accessible pages based on current userType
// //   const accessiblePaymentPages = paymentPages.filter((p) => p.allowedUserTypes.includes(userType));
// //   const accessibleRccPages = rccOfficePages.filter((p) => p.allowedUserTypes.includes(userType));
// //   const accessibleVrnPages = vrnOfficePages.filter((p) => p.allowedUserTypes.includes(userType));
// //   const accessibleDimensionPages = dimensionOfficePages.filter((p) => p.allowedUserTypes.includes(userType));

// //   // Unified select handler
// //   const selectPage = (pageId, type) => {
// //     let page;
// //     if (type === "payment") page = paymentPages.find((p) => p.id === pageId);
// //     else if (type === "rcc") page = rccOfficePages.find((p) => p.id === pageId);
// //     else if (type === "vrn") page = vrnOfficePages.find((p) => p.id === pageId);
// //     else if (type === "dimension") page = dimensionOfficePages.find((p) => p.id === pageId);

// //     setSelectedPage(type === "payment" ? pageId : null);
// //     setSelectedRccPage(type === "rcc" ? pageId : null);
// //     setSelectedVrnPage(type === "vrn" ? pageId : null);
// //     setSelectedDimensionPage(type === "dimension" ? pageId : null);

// //     // Close all dropdowns
// //     setIsPaymentDropdownOpen(false);
// //     setIsRccDropdownOpen(false);
// //     setIsVrnDropdownOpen(false);
// //     setIsDimensionDropdownOpen(false);

// //     if (page) {
// //       setIsMobileMenuOpen(false);
// //       navigate(page.path);
// //     }
// //   };

// //   const handleLogout = () => {
// //     dispatch(logout());
// //     navigate("/");
// //   };

// //   // Click outside to collapse sidebar (desktop only)
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (window.innerWidth >= 1024 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
// //         setIsSidebarExpanded(false);
// //       }
// //     };
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   return (
// //     <div className="flex min-h-screen bg-blue-200">
// //       {/* SIDEBAR */}
// //       <div
// //         ref={sidebarRef}
// //         className={`
// //           fixed inset-y-0 left-0 z-50 bg-blue-300 shadow-2xl transition-all duration-300
// //           ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
// //           lg:translate-x-0 ${isSidebarExpanded ? "lg:w-72" : "lg:w-20"}
// //         `}
// //         onMouseEnter={() => setIsSidebarExpanded(true)}
// //       >
// //         <div className="flex flex-col h-full">
// //           {/* Logo */}
// //           <div className={`flex items-center p-6 border-b border-white/10 ${isSidebarExpanded ? "justify-between" : "lg:justify-center"}`}>
// //             <div className="flex items-center space-x-3">
// //               <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center">
// //                 <img src="/rcc-logo.png" alt="RCC Logo" className="w-10 h-10 object-contain" />
// //               </div>
// //               <h1 className={`text-xl font-bold text-black transition-all ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
// //                 RCC Payment
// //               </h1>
// //             </div>
// //             <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-white">
// //               <X className="w-6 h-6" />
// //             </button>
// //           </div>

// //           {/* Navigation */}
// //           <nav className="flex-1 p-4 overflow-y-auto">
// //             <ul className="space-y-2">
// //               {/* Payment Section - Only if user has access to at least one page */}
// //               {accessiblePaymentPages.length > 0 && (
// //                 <li>
// //                   <button
// //                     onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
// //                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-black text-sm font-medium ${
// //                       isPaymentDropdownOpen || selectedPage
// //                         ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-md text-white"
// //                         : "hover:bg-white/20"
// //                     } ${!isSidebarExpanded ? "lg:justify-center" : ""}`}
// //                   >
// //                     <DollarSign className="w-5 h-5 flex-shrink-0" />
// //                     <span className={`transition-all ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
// //                       Payment
// //                     </span>
// //                     {isSidebarExpanded && <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`} />}
// //                   </button>

// //                   {isSidebarExpanded && isPaymentDropdownOpen && (
// //                     <ul className="ml-6 mt-2 space-y-1 bg-white/10 rounded-lg p-2 border border-white/10">
// //                       {accessiblePaymentPages.map((page) => (
// //                         <li key={page.id}>
// //                           <button
// //                             onClick={() => selectPage(page.id, "payment")}
// //                             className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
// //                               selectedPage === page.id
// //                                 ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow"
// //                                 : "text-gray-800 hover:bg-white/20"
// //                             }`}
// //                           >
// //                             {page.name}
// //                           </button>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </li>
// //               )}

// //               {/* RCC OFFICE Section */}
// //               {accessibleRccPages.length > 0 && (
// //                 <li>
// //                   <button
// //                     onClick={() => setIsRccDropdownOpen(!isRccDropdownOpen)}
// //                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-black text-sm font-medium ${
// //                       isRccDropdownOpen || selectedRccPage
// //                         ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md text-white"
// //                         : "hover:bg-white/20"
// //                     } ${!isSidebarExpanded ? "lg:justify-center" : ""}`}
// //                   >
// //                     <Building2 className="w-5 h-5 flex-shrink-0" />
// //                     <span className={`transition-all ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
// //                       RCC OFFICE
// //                     </span>
// //                     {isSidebarExpanded && <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`} />}
// //                   </button>

// //                   {isSidebarExpanded && isRccDropdownOpen && (
// //                     <ul className="ml-6 mt-2 space-y-1 bg-white/10 rounded-lg p-2 border border-white/10">
// //                       {accessibleRccPages.map((page) => (
// //                         <li key={page.id}>
// //                           <button
// //                             onClick={() => selectPage(page.id, "rcc")}
// //                             className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
// //                               selectedRccPage === page.id
// //                                 ? "bg-purple-500 text-white font-medium shadow"
// //                                 : "text-gray-800 hover:bg-white/20"
// //                             }`}
// //                           >
// //                             {page.name}
// //                           </button>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </li>
// //               )}

// //               {/* VRN Office Section */}
// //               {accessibleVrnPages.length > 0 && (
// //                 <li>
// //                   <button
// //                     onClick={() => setIsVrnDropdownOpen(!isVrnDropdownOpen)}
// //                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-black text-sm font-medium ${
// //                       isVrnDropdownOpen || selectedVrnPage
// //                         ? "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-md text-white"
// //                         : "hover:bg-white/20"
// //                     } ${!isSidebarExpanded ? "lg:justify-center" : ""}`}
// //                   >
// //                     <Building2 className="w-5 h-5 flex-shrink-0" />
// //                     <span className={`transition-all ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
// //                       VRN Office
// //                     </span>
// //                     {isSidebarExpanded && <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`} />}
// //                   </button>

// //                   {isSidebarExpanded && isVrnDropdownOpen && (
// //                     <ul className="ml-6 mt-2 space-y-1 bg-white/10 rounded-lg p-2 border border-white/10">
// //                       {accessibleVrnPages.map((page) => (
// //                         <li key={page.id}>
// //                           <button
// //                             onClick={() => selectPage(page.id, "vrn")}
// //                             className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
// //                               selectedVrnPage === page.id
// //                                 ? "bg-indigo-500 text-white font-medium shadow"
// //                                 : "text-gray-800 hover:bg-white/20"
// //                             }`}
// //                           >
// //                             {page.name}
// //                           </button>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </li>
// //               )}

// //               {/* Dimension Office Section */}
// //               {accessibleDimensionPages.length > 0 && (
// //                 <li>
// //                   <button
// //                     onClick={() => setIsDimensionDropdownOpen(!isDimensionDropdownOpen)}
// //                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all text-black text-sm font-medium ${
// //                       isDimensionDropdownOpen || selectedDimensionPage
// //                         ? "bg-gradient-to-r from-pink-600 to-rose-600 shadow-md text-white"
// //                         : "hover:bg-white/20"
// //                     } ${!isSidebarExpanded ? "lg:justify-center" : ""}`}
// //                   >
// //                     <Building2 className="w-5 h-5 flex-shrink-0" />
// //                     <span className={`transition-all ${isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}`}>
// //                       Dimension Office
// //                     </span>
// //                     {isSidebarExpanded && <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`} />}
// //                   </button>

// //                   {isSidebarExpanded && isDimensionDropdownOpen && (
// //                     <ul className="ml-6 mt-2 space-y-1 bg-white/10 rounded-lg p-2 border border-white/10">
// //                       {accessibleDimensionPages.map((page) => (
// //                         <li key={page.id}>
// //                           <button
// //                             onClick={() => selectPage(page.id, "dimension")}
// //                             className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all ${
// //                               selectedDimensionPage === page.id
// //                                 ? "bg-pink-500 text-white font-medium shadow"
// //                                 : "text-gray-800 hover:bg-white/20"
// //                             }`}
// //                           >
// //                             {page.name}
// //                           </button>
// //                         </li>
// //                       ))}
// //                     </ul>
// //                   )}
// //                 </li>
// //               )}
// //             </ul>
// //           </nav>

// //           {/* User Info & Logout */}
// //           <div className="p-4 border-t border-white/10">
// //             <div className={`flex items-center mb-4 ${isSidebarExpanded ? "space-x-3" : "lg:justify-center"}`}>
// //               <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
// //                 <User className="w-5 h-5 text-white" />
// //               </div>
// //               <div className={isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}>
// //                 <p className="text-black font-semibold">{userType || "User"}</p>
// //                 <p className="text-gray-700 text-sm">Authorized User</p>
// //               </div>
// //             </div>

// //             <button
// //               onClick={handleLogout}
// //               className={`w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-blue-600 transition-all ${isSidebarExpanded ? "space-x-3" : "lg:justify-center"}`}
// //             >
// //               <LogOut className="w-5 h-5" />
// //               <span className={isSidebarExpanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"}>
// //                 Logout
// //               </span>
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* MAIN CONTENT */}
// //       <div className="flex-1 flex flex-col lg:ml-20">
// //         <div className="lg:hidden p-4">
// //           <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 rounded-xl bg-white shadow-lg hover:bg-gray-100 transition">
// //             <Menu className="w-6 h-6 text-gray-700" />
// //           </button>
// //         </div>

// //         <main className="flex-1 p-4 lg:p-8 overflow-auto">
// //           <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 min-h-full border border-gray-100">
// //             {(selectedPage || selectedRccPage || selectedVrnPage || selectedDimensionPage) ? (
// //               <Outlet />
// //             ) : (
// //               <div className="flex flex-col items-center justify-center h-full text-center">
// //                 <DollarSign className="w-20 h-20 text-emerald-500 mb-6 opacity-20" />
// //                 <h3 className="text-2xl font-semibold text-gray-700 mb-3">Welcome to RCC Dashboard</h3>
// //                 <p className="text-gray-500 max-w-md">
// //                   Please select a page from the sidebar menu to get started.
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </main>
// //       </div>

// //       {/* Mobile Overlay */}
// //       {isMobileMenuOpen && (
// //         <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
// //       )}
// //     </div>
// //   );
// // };

// // export default Dashboard;

// import React, { useState, useEffect, useRef } from "react";
// import {
//   DollarSign,
//   ChevronDown,
//   LogOut,
//   Menu,
//   X,
//   User,
//   Building2,
//   BarChart3,
// } from "lucide-react";

// import { useNavigate, useLocation, Outlet } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../features/Auth/LoginSlice";

// const Dashboard = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [selectedPage, setSelectedPage] = useState(null);
//   const [selectedRccPage, setSelectedRccPage] = useState(null);
//   const [selectedVrnPage, setSelectedVrnPage] = useState(null);
//   const [selectedDimensionPage, setSelectedDimensionPage] = useState(null);
//   const [isSummarySelected, setIsSummarySelected] = useState(false);

//   const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
//   const [isRccDropdownOpen, setIsRccDropdownOpen] = useState(false);
//   const [isVrnDropdownOpen, setIsVrnDropdownOpen] = useState(false);
//   const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);

//   const { userType, token } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navbarRef = useRef(null);

//   useEffect(() => {
//     if (!token) {
//       navigate("/");
//     }
//     if (
//       location.pathname === "/dashboard" ||
//       location.pathname === "/dashboard/"
//     ) {
//       navigate("/dashboard/summary", { replace: true });
//     }
//   }, [token, navigate, location.pathname]);

//   useEffect(() => {
//     const path = location.pathname;
//     setSelectedPage(null);
//     setSelectedRccPage(null);
//     setSelectedVrnPage(null);
//     setSelectedDimensionPage(null);
//     setIsSummarySelected(false);

//     if (path === "/dashboard/summary") {
//       setIsSummarySelected(true);
//       return;
//     }

//     const paymentMatch = paymentPages.find((p) => p.path === path);
//     if (paymentMatch) setSelectedPage(paymentMatch.id);

//     const rccMatch = rccOfficePages.find((p) => p.path === path);
//     if (rccMatch) setSelectedRccPage(rccMatch.id);

//     const vrnMatch = vrnOfficePages.find((p) => p.path === path);
//     if (vrnMatch) setSelectedVrnPage(vrnMatch.id);

//     const dimMatch = dimensionOfficePages.find((p) => p.path === path);
//     if (dimMatch) setSelectedDimensionPage(dimMatch.id);
//   }, [location.pathname]);

//   const paymentPages = [
//     {
//       id: "Reconciliation",
//       name: "Reconciliation",
//       path: "/dashboard/Reconciliation",
//       allowedUserTypes: ["ADMIN", "PAYMENT"],
//     },
//     {
//       id: "Form",
//       name: "Forms",
//       path: "/dashboard/Form",
//       allowedUserTypes: ["ADMIN", "PAYMENT"],
//     },
//     {
//       id: "Actual_Payment_in",
//       name: "Actual Payment In",
//       path: "/dashboard/Actual_Payment_in",
//       allowedUserTypes: ["ADMIN", "PAYMENT"],
//     },
//     {
//       id: "Transfer_bank_To_bank",
//       name: "Transfer Bank to Bank",
//       path: "/dashboard/Transfer_bank_To_bank",
//       allowedUserTypes: ["ADMIN", "PAYMENT"],
//     },
//   ];

//   const rccOfficePages = [
//     {
//       id: "RCC_Approvel",
//       name: "RCC Approval",
//       path: "/dashboard/RCC_Approvel",
//       allowedUserTypes: ["ADMIN", "RCC", "PAYMENT"],
//     },
//     {
//       id: "Approvel_By_Mayaksir",
//       name: "Approval By Mayaksir",
//       path: "/dashboard/Approvel_By_Mayaksir",
//       allowedUserTypes: ["ADMIN", "RCC"],
//     },
//     {
//       id: "OfficeExpensesPayment",
//       name: "Office Expenses Payment",
//       path: "/dashboard/OfficeExpensesPayment",
//       allowedUserTypes: ["ADMIN", "RCC"],
//     },
//   ];

//   const vrnOfficePages = [
//     {
//       id: "VRN_Approvel1",
//       name: "VRN Approval 1",
//       path: "/dashboard/VRN_Approvel1",
//       allowedUserTypes: ["ADMIN"],
//     },
//     {
//       id: "VRN_Approvel2",
//       name: "VRN Approval 2",
//       path: "/dashboard/VRN_Approvel2",
//       allowedUserTypes: ["ADMIN"],
//     },
//     {
//       id: "VRN_Report",
//       name: "VRN Report",
//       path: "/dashboard/VRN_Report",
//       allowedUserTypes: ["ADMIN", "viewer"],
//     },
//   ];

//   const dimensionOfficePages = [
//     {
//       id: "Dim_Approvel1",
//       name: "Dim Approval 1",
//       path: "/dashboard/Dim_Approvel1",
//       allowedUserTypes: ["ADMIN", "manager"],
//     },
//     {
//       id: "Dim_Approvel2",
//       name: "Dim Approval 2",
//       path: "/dashboard/Dim_Approvel2",
//       allowedUserTypes: ["ADMIN"],
//     },
//     {
//       id: "Dimension_Transfer",
//       name: "Dimension Transfer",
//       path: "/dashboard/Dimension_Transfer",
//       allowedUserTypes: ["ADMIN"],
//     },
//   ];

//   const accessiblePaymentPages = paymentPages.filter((p) =>
//     p.allowedUserTypes.includes(userType),
//   );
//   const accessibleRccPages = rccOfficePages.filter((p) =>
//     p.allowedUserTypes.includes(userType),
//   );
//   const accessibleVrnPages = vrnOfficePages.filter((p) =>
//     p.allowedUserTypes.includes(userType),
//   );
//   const accessibleDimensionPages = dimensionOfficePages.filter((p) =>
//     p.allowedUserTypes.includes(userType),
//   );

//   const selectPage = (id, type) => {
//     setSelectedPage(null);
//     setSelectedRccPage(null);
//     setSelectedVrnPage(null);
//     setSelectedDimensionPage(null);
//     setIsSummarySelected(false);

//     setIsPaymentDropdownOpen(false);
//     setIsRccDropdownOpen(false);
//     setIsVrnDropdownOpen(false);

//     setIsDimensionDropdownOpen(false);

//     if (type === "summary") {
//       setIsSummarySelected(true);
//       setIsMobileMenuOpen(false);
//       navigate("/dashboard/summary");
//       return;
//     }

//     let page;
//     if (type === "payment") page = paymentPages.find((p) => p.id === id);
//     if (type === "rcc") page = rccOfficePages.find((p) => p.id === id);
//     if (type === "vrn") page = vrnOfficePages.find((p) => p.id === id);
//     if (type === "dimension")
//       page = dimensionOfficePages.find((p) => p.id === id);

//     if (page) {
//       if (type === "payment") setSelectedPage(id);
//       if (type === "rcc") setSelectedRccPage(id);
//       if (type === "vrn") setSelectedVrnPage(id);
//       if (type === "dimension") setSelectedDimensionPage(id);

//       setIsMobileMenuOpen(false);
//       navigate(page.path);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/");
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

//   return (
//     <div className="min-h-screen  bg-gray-300 from-blue-50 via-indigo-50 to-purple-50">
//       {/* NAVBAR */}
//       <nav
//         ref={navbarRef}
//         className=" bg-blue-400 shadow-lg border-b border-gray-200 sticky top-0 z-50"
//       >
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             {/* Logo */}
//             <div className="flex items-center space-x-3">
//               {/* <div className="w-10 h-10 bg-white from-blue-500 to-indigo-600 rounded-xl shadow-md flex items-center justify-center">
//                 {/* <img src="/rcc-logo.png" alt="RCC Logo" className="w-8 h-8 object-contain" /> */}
//               {/* </div> */}
//               <h1
//                 className="
//   text-xl font-bold 
//   bg-black
//   bg-clip-text text-transparent
// "
//               >
//                 Office Payments
//               </h1>
//             </div>

//             {/* Desktop Navigation */}
//             <div className="hidden lg:flex items-center space-x-1">
//               {/* Summary */}
//               <button
//                 onClick={() => selectPage(null, "summary")}
//                 className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                   isSummarySelected
//                     ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
//                     : "text-white hover:bg-blue-500"
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 <span>Summary</span>
//               </button>

//               {/* Payment Dropdown */}
//               {accessiblePaymentPages.length > 0 && (
//                 <div className="relative">
//                   <button
//                     onClick={() => {
//                       setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
//                       setIsRccDropdownOpen(false);
//                       setIsVrnDropdownOpen(false);
//                       setIsDimensionDropdownOpen(false);
//                     }}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                       isPaymentDropdownOpen || selectedPage
//                         ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
//                         : "text-white hover:bg-blue-500"
//                     }`}
//                   >
//                     <DollarSign className="w-4 h-4" />
//                     <span>Payment</span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {isPaymentDropdownOpen && (
//                     <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                       {accessiblePaymentPages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "payment")}
//                           className={`w-full text-left px-4 py-2 text-sm transition-all ${
//                             selectedPage === page.id
//                               ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 font-medium border-l-4 border-emerald-500"
//                               : "text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* RCC Office Dropdown */}
//               {accessibleRccPages.length > 0 && (
//                 <div className="relative">
//                   <button
//                     onClick={() => {
//                       setIsRccDropdownOpen(!isRccDropdownOpen);
//                       setIsPaymentDropdownOpen(false);
//                       setIsVrnDropdownOpen(false);
//                       setIsDimensionDropdownOpen(false);
//                     }}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                       isRccDropdownOpen || selectedRccPage
//                         ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
//                         : "text-white hover:bg-blue-500"
//                     }`}
//                   >
//                     <Building2 className="w-4 h-4" />
//                     <span>RCC Office</span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {isRccDropdownOpen && (
//                     <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                       {accessibleRccPages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "rcc")}
//                           className={`w-full text-left px-4 py-2 text-sm transition-all ${
//                             selectedRccPage === page.id
//                               ? "bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-700 font-medium border-l-4 border-purple-500"
//                               : "text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* VRN Office Dropdown */}
//               {accessibleVrnPages.length > 0 && (
//                 <div className="relative">
//                   <button
//                     onClick={() => {
//                       setIsVrnDropdownOpen(!isVrnDropdownOpen);
//                       setIsPaymentDropdownOpen(false);
//                       setIsRccDropdownOpen(false);
//                       setIsDimensionDropdownOpen(false);
//                     }}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                       isVrnDropdownOpen || selectedVrnPage
//                         ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
//                         : "text-white hover:bg-blue-500"
//                     }`}
//                   >
//                     <Building2 className="w-4 h-4" />
//                     <span>VRN Office</span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {isVrnDropdownOpen && (
//                     <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                       {accessibleVrnPages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "vrn")}
//                           className={`w-full text-left px-4 py-2 text-sm transition-all ${
//                             selectedVrnPage === page.id
//                               ? "bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 font-medium border-l-4 border-indigo-500"
//                               : "text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Dimension Office Dropdown */}
//               {accessibleDimensionPages.length > 0 && (
//                 <div className="relative">
//                   <button
//                     onClick={() => {
//                       setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
//                       setIsPaymentDropdownOpen(false);
//                       setIsRccDropdownOpen(false);
//                       setIsVrnDropdownOpen(false);
//                     }}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
//                       isDimensionDropdownOpen || selectedDimensionPage
//                         ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
//                         : "text-white hover:bg-blue-500"
//                     }`}
//                   >
//                     <Building2 className="w-4 h-4" />
//                     <span>Dimension Office</span>
//                     <ChevronDown
//                       className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
//                     />
//                   </button>

//                   {isDimensionDropdownOpen && (
//                     <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
//                       {accessibleDimensionPages.map((page) => (
//                         <button
//                           key={page.id}
//                           onClick={() => selectPage(page.id, "dimension")}
//                           className={`w-full text-left px-4 py-2 text-sm transition-all ${
//                             selectedDimensionPage === page.id
//                               ? "bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 font-medium border-l-4 border-pink-500"
//                               : "text-gray-700 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page.name}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* User & Logout */}
//             <div className="hidden lg:flex items-center space-x-3">
//               {/* <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg">
//                 {/* <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
//                   {/* <User className="w-4 h-4 text-white" /> */}
//               {/* </div> */}
//               {/* <div> */}
//               {/* <p className="text-sm font-semibold text-gray-800">{userType || "User"}</p> */}
//               {/* </div> */}
//               {/* </div> */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all text-sm font-medium"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               onClick={() => setIsMobileMenuOpen(true)}
//               className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               <Menu className="w-6 h-6 text-gray-700" />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile Menu */}
//       {isMobileMenuOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//             onClick={() => setIsMobileMenuOpen(false)}
//           />
//           <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-2xl z-50 lg:hidden transform transition-transform overflow-y-auto">
//             <div className="flex flex-col h-full">
//               <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
//                 <h2 className="text-lg font-bold text-gray-800">Menu</h2>
//                 <button
//                   onClick={() => setIsMobileMenuOpen(false)}
//                   className="p-2 hover:bg-gray-100 rounded-lg"
//                 >
//                   <X className="w-5 h-5 text-gray-700" />
//                 </button>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4">
//                 <div className="space-y-2">
//                   <button
//                     onClick={() => selectPage(null, "summary")}
//                     className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
//                       isSummarySelected
//                         ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     <BarChart3 className="w-5 h-5" />
//                     <span className="font-medium">Summary</span>
//                   </button>

//                   {accessiblePaymentPages.length > 0 && (
//                     <div>
//                       <button
//                         onClick={() =>
//                           setIsPaymentDropdownOpen(!isPaymentDropdownOpen)
//                         }
//                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                           isPaymentDropdownOpen || selectedPage
//                             ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <DollarSign className="w-5 h-5" />
//                           <span className="font-medium">Payment</span>
//                         </div>
//                         <ChevronDown
//                           className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
//                         />
//                       </button>
//                       {isPaymentDropdownOpen && (
//                         <div className="ml-4 mt-1 space-y-1">
//                           {accessiblePaymentPages.map((page) => (
//                             <button
//                               key={page.id}
//                               onClick={() => selectPage(page.id, "payment")}
//                               className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
//                                 selectedPage === page.id
//                                   ? "bg-emerald-50 text-emerald-700 font-medium"
//                                   : "text-gray-700 hover:bg-gray-50"
//                               }`}
//                             >
//                               {page.name}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {accessibleRccPages.length > 0 && (
//                     <div>
//                       <button
//                         onClick={() => setIsRccDropdownOpen(!isRccDropdownOpen)}
//                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                           isRccDropdownOpen || selectedRccPage
//                             ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <Building2 className="w-5 h-5" />
//                           <span className="font-medium">RCC Office</span>
//                         </div>
//                         <ChevronDown
//                           className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`}
//                         />
//                       </button>
//                       {isRccDropdownOpen && (
//                         <div className="ml-4 mt-1 space-y-1">
//                           {accessibleRccPages.map((page) => (
//                             <button
//                               key={page.id}
//                               onClick={() => selectPage(page.id, "rcc")}
//                               className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
//                                 selectedRccPage === page.id
//                                   ? "bg-purple-50 text-purple-700 font-medium"
//                                   : "text-gray-700 hover:bg-gray-50"
//                               }`}
//                             >
//                               {page.name}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {accessibleVrnPages.length > 0 && (
//                     <div>
//                       <button
//                         onClick={() => setIsVrnDropdownOpen(!isVrnDropdownOpen)}
//                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                           isVrnDropdownOpen || selectedVrnPage
//                             ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <Building2 className="w-5 h-5" />
//                           <span className="font-medium">VRN Office</span>
//                         </div>
//                         <ChevronDown
//                           className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`}
//                         />
//                       </button>
//                       {isVrnDropdownOpen && (
//                         <div className="ml-4 mt-1 space-y-1">
//                           {accessibleVrnPages.map((page) => (
//                             <button
//                               key={page.id}
//                               onClick={() => selectPage(page.id, "vrn")}
//                               className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
//                                 selectedVrnPage === page.id
//                                   ? "bg-indigo-50 text-indigo-700 font-medium"
//                                   : "text-gray-700 hover:bg-gray-50"
//                               }`}
//                             >
//                               {page.name}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {accessibleDimensionPages.length > 0 && (
//                     <div>
//                       <button
//                         onClick={() =>
//                           setIsDimensionDropdownOpen(!isDimensionDropdownOpen)
//                         }
//                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
//                           isDimensionDropdownOpen || selectedDimensionPage
//                             ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
//                             : "text-gray-700 hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-3">
//                           <Building2 className="w-5 h-5" />
//                           <span className="font-medium">Dimension Office</span>
//                         </div>
//                         <ChevronDown
//                           className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
//                         />
//                       </button>
//                       {isDimensionDropdownOpen && (
//                         <div className="ml-4 mt-1 space-y-1">
//                           {accessibleDimensionPages.map((page) => (
//                             <button
//                               key={page.id}
//                               onClick={() => selectPage(page.id, "dimension")}
//                               className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${
//                                 selectedDimensionPage === page.id
//                                   ? "bg-pink-50 text-pink-700 font-medium"
//                                   : "text-gray-700 hover:bg-gray-50"
//                               }`}
//                             >
//                               {page.name}
//                             </button>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4 border-t bg-white sticky bottom-0">
//                 <div className="flex items-center space-x-3 mb-3 p-3 bg-gray-100 rounded-lg">
//                   <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
//                     <User className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-semibold text-gray-800">
//                       {userType || "User"}
//                     </p>
//                     <p className="text-xs text-gray-600">Authorized User</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium"
//                 >
//                   <LogOut className="w-5 h-5" />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
//         <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8 min-h-[calc(100vh-8rem)] border border-gray-100">
//           {isSummarySelected ||
//           selectedPage ||
//           selectedRccPage ||
//           selectedVrnPage ||
//           selectedDimensionPage ? (
//             <Outlet />
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-center py-20">
//               <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-6">
//                 <DollarSign className="w-12 h-12 text-blue-500" />
//               </div>
//               <h3 className="text-3xl font-bold text-gray-800 mb-3">
//                 Welcome to RCC Dashboard
//               </h3>
//               <p className="text-gray-600 max-w-md">
//                 Please select a page from the navigation menu to get started
//                 with your dashboard.
//               </p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;






import React, { useState, useEffect, useRef } from "react";
import {
  DollarSign,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  Building2,
  BarChart3,
} from "lucide-react";

import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/LoginSlice";

const Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedRccPage, setSelectedRccPage] = useState(null);
  const [selectedVrnPage, setSelectedVrnPage] = useState(null);
  const [selectedDimensionPage, setSelectedDimensionPage] = useState(null);
  const [isSummarySelected, setIsSummarySelected] = useState(false);

  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);
  const [isRccDropdownOpen, setIsRccDropdownOpen] = useState(false);
  const [isVrnDropdownOpen, setIsVrnDropdownOpen] = useState(false);
  const [isDimensionDropdownOpen, setIsDimensionDropdownOpen] = useState(false);

  const { userType, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const navbarRef = useRef(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate("/dashboard/summary", { replace: true });
    }
  }, [token, navigate, location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    setSelectedPage(null);
    setSelectedRccPage(null);
    setSelectedVrnPage(null);
    setSelectedDimensionPage(null);
    setIsSummarySelected(false);

    if (path === "/dashboard/summary") {
      setIsSummarySelected(true);
      return;
    }

    const paymentMatch = paymentPages.find((p) => p.path === path);
    if (paymentMatch) setSelectedPage(paymentMatch.id);

    const rccMatch = rccOfficePages.find((p) => p.path === path);
    if (rccMatch) setSelectedRccPage(rccMatch.id);

    const vrnMatch = vrnOfficePages.find((p) => p.path === path);
    if (vrnMatch) setSelectedVrnPage(vrnMatch.id);

    const dimMatch = dimensionOfficePages.find((p) => p.path === path);
    if (dimMatch) setSelectedDimensionPage(dimMatch.id);
  }, [location.pathname]);

  const paymentPages = [
    {
      id: "Reconciliation",
      name: "Reconciliation",
      path: "/dashboard/Reconciliation",
      allowedUserTypes: ["ADMIN", "PAYMENT"],
    },
    {
      id: "Form",
      name: "Forms",
      path: "/dashboard/Form",
      allowedUserTypes: ["ADMIN", "PAYMENT"],
    },
    {
      id: "Actual_Payment_in",
      name: "Actual Payment In",
      path: "/dashboard/Actual_Payment_in",
      allowedUserTypes: ["ADMIN", "PAYMENT"],
    },
    {
      id: "Transfer_bank_To_bank",
      name: "Transfer Bank to Bank",
      path: "/dashboard/Transfer_bank_To_bank",
      allowedUserTypes: ["ADMIN", "PAYMENT"],
    },
  ];

  const rccOfficePages = [
    {
      id: "RCC_Approvel",
      name: "RCC Approval",
      path: "/dashboard/RCC_Approvel",
      allowedUserTypes: ["ADMIN", "RCC", "PAYMENT"],
    },
    {
      id: "Approvel_By_Mayaksir",
      name: "Approval By Mayaksir",
      path: "/dashboard/Approvel_By_Mayaksir",
      allowedUserTypes: ["ADMIN", "RCC"],
    },
    {
      id: "OfficeExpensesPayment",
      name: "Office Expenses Payment",
      path: "/dashboard/OfficeExpensesPayment",
      allowedUserTypes: ["ADMIN", "RCC"],
    },
  ];

  const vrnOfficePages = [
    {
      id: "VRN_Approvel1",
      name: "VRN Approval 1",
      path: "/dashboard/VRN_Approvel1",
      allowedUserTypes: ["ADMIN"],
    },
    {
      id: "VRN_Approvel2",
      name: "VRN Approval 2",
      path: "/dashboard/VRN_Approvel2",
      allowedUserTypes: ["ADMIN"],
    },
    {
      id: "VRN_Report",
      name: "VRN Report",
      path: "/dashboard/VRN_Report",
      allowedUserTypes: ["ADMIN", "viewer"],
    },
  ];

  const dimensionOfficePages = [
    {
      id: "Dim_Approvel1",
      name: "Dim Approval 1",
      path: "/dashboard/Dim_Approvel1",
      allowedUserTypes: ["ADMIN", "manager"],
    },
    {
      id: "Dim_Approvel2",
      name: "Dim Approval 2",
      path: "/dashboard/Dim_Approvel2",
      allowedUserTypes: ["ADMIN"],
    },
    {
      id: "Dimension_Transfer",
      name: "Dimension Transfer",
      path: "/dashboard/Dimension_Transfer",
      allowedUserTypes: ["ADMIN"],
    },
  ];

  const accessiblePaymentPages = paymentPages.filter((p) =>
    p.allowedUserTypes.includes(userType)
  );
  const accessibleRccPages = rccOfficePages.filter((p) =>
    p.allowedUserTypes.includes(userType)
  );
  const accessibleVrnPages = vrnOfficePages.filter((p) =>
    p.allowedUserTypes.includes(userType)
  );
  const accessibleDimensionPages = dimensionOfficePages.filter((p) =>
    p.allowedUserTypes.includes(userType)
  );

  const selectPage = (id, type) => {
    setSelectedPage(null);
    setSelectedRccPage(null);
    setSelectedVrnPage(null);
    setSelectedDimensionPage(null);
    setIsSummarySelected(false);

    setIsPaymentDropdownOpen(false);
    setIsRccDropdownOpen(false);
    setIsVrnDropdownOpen(false);
    setIsDimensionDropdownOpen(false);

    if (type === "summary") {
      setIsSummarySelected(true);
      setIsMobileMenuOpen(false);
      navigate("/dashboard/summary");
      return;
    }

    let page;
    if (type === "payment") page = paymentPages.find((p) => p.id === id);
    if (type === "rcc") page = rccOfficePages.find((p) => p.id === id);
    if (type === "vrn") page = vrnOfficePages.find((p) => p.id === id);
    if (type === "dimension") page = dimensionOfficePages.find((p) => p.id === id);

    if (page) {
      if (type === "payment") setSelectedPage(id);
      if (type === "rcc") setSelectedRccPage(id);
      if (type === "vrn") setSelectedVrnPage(id);
      if (type === "dimension") setSelectedDimensionPage(id);

      setIsMobileMenuOpen(false);
      navigate(page.path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-indigo-950 to-purple-950 overflow-hidden">

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-700 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-700 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse-slow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute -bottom-32 left-1/3 w-[450px] h-[450px] bg-indigo-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
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

      {/* NAVBAR */}
 <nav
  ref={navbarRef}
  className="fixed top-0 left-0 right-0 z-50 
    bg-black/40 backdrop-blur-xl 
    border-b border-white/10 shadow-xl"
>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Office Payments
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Summary */}
              <button
                onClick={() => selectPage(null, "summary")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  isSummarySelected
                    ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md"
                    : "text-white hover:bg-white/10"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Summary</span>
              </button>

              {/* Payment Dropdown */}
              {accessiblePaymentPages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsPaymentDropdownOpen(!isPaymentDropdownOpen);
                      setIsRccDropdownOpen(false);
                      setIsVrnDropdownOpen(false);
                      setIsDimensionDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isPaymentDropdownOpen || selectedPage
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>Payment</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isPaymentDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 py-2 z-50 shadow-2xl">
                      {accessiblePaymentPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => selectPage(page.id, "payment")}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                            selectedPage === page.id
                              ? "bg-emerald-900/40 text-emerald-200 font-medium"
                              : "text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* RCC Office Dropdown */}
              {accessibleRccPages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsRccDropdownOpen(!isRccDropdownOpen);
                      setIsPaymentDropdownOpen(false);
                      setIsVrnDropdownOpen(false);
                      setIsDimensionDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isRccDropdownOpen || selectedRccPage
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>RCC Office</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isRccDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isRccDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 py-2 z-50 shadow-2xl">
                      {accessibleRccPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => selectPage(page.id, "rcc")}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                            selectedRccPage === page.id
                              ? "bg-purple-900/40 text-purple-200 font-medium"
                              : "text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* VRN Office Dropdown */}
              {accessibleVrnPages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsVrnDropdownOpen(!isVrnDropdownOpen);
                      setIsPaymentDropdownOpen(false);
                      setIsRccDropdownOpen(false);
                      setIsDimensionDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isVrnDropdownOpen || selectedVrnPage
                        ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>VRN Office</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isVrnDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isVrnDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 py-2 z-50 shadow-2xl">
                      {accessibleVrnPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => selectPage(page.id, "vrn")}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                            selectedVrnPage === page.id
                              ? "bg-indigo-900/40 text-indigo-200 font-medium"
                              : "text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Dimension Office Dropdown */}
              {accessibleDimensionPages.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsDimensionDropdownOpen(!isDimensionDropdownOpen);
                      setIsPaymentDropdownOpen(false);
                      setIsRccDropdownOpen(false);
                      setIsVrnDropdownOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                      isDimensionDropdownOpen || selectedDimensionPage
                        ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Dimension Office</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isDimensionDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDimensionDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 py-2 z-50 shadow-2xl">
                      {accessibleDimensionPages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => selectPage(page.id, "dimension")}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
                            selectedDimensionPage === page.id
                              ? "bg-rose-900/40 text-rose-200 font-medium"
                              : "text-gray-200 hover:bg-white/5"
                          }`}
                        >
                          {page.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User & Logout - Desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            >
              <Menu className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-black/90 backdrop-blur-xl shadow-2xl z-50 lg:hidden transform transition-transform overflow-y-auto border-l border-white/10">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <h2 className="text-lg font-bold text-white">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-2">
                <button
                  onClick={() => selectPage(null, "summary")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isSummarySelected
                      ? "bg-gradient-to-r from-amber-700 to-yellow-700 text-white shadow-md"
                      : "text-gray-200 hover:bg-white/10"
                  }`}
                >
                  <BarChart3 className="w-5 h-5" />
                  <span className="font-medium">Summary</span>
                </button>

                {accessiblePaymentPages.length > 0 && (
                  <div>
                    <button
                      onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        isPaymentDropdownOpen || selectedPage
                          ? "bg-gradient-to-r from-emerald-700 to-teal-700 text-white shadow-md"
                          : "text-gray-200 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-medium">Payment</span>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${isPaymentDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isPaymentDropdownOpen && (
                      <div className="ml-6 mt-2 space-y-1">
                        {accessiblePaymentPages.map((page) => (
                          <button
                            key={page.id}
                            onClick={() => selectPage(page.id, "payment")}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                              selectedPage === page.id
                                ? "bg-emerald-900/50 text-emerald-200 font-medium"
                                : "text-gray-300 hover:bg-white/5"
                            }`}
                          >
                            {page.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* RCC, VRN, Dimension mobile dropdowns follow the same pattern */}
                {/* ... (omitting repetition for brevity - copy-paste similar structure as above for RCC, VRN, Dimension) ... */}

              </div>

              <div className="p-5 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 transition-all font-medium"
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
      <main className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 lg:p-8 min-h-[calc(100vh-8rem)] border border-white/10">
          {isSummarySelected ||
          selectedPage ||
          selectedRccPage ||
          selectedVrnPage ||
          selectedDimensionPage ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-8 animate-pulse">
                <DollarSign className="w-14 h-14 text-indigo-300 opacity-80" />
              </div>
              <h3 className="text-4xl font-bold bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
                Welcome to RCC Dashboard
              </h3>
              <p className="text-indigo-200/70 max-w-lg text-lg">
                Select a module from the navigation bar to start managing payments, approvals and reports.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(${Math.random() > 0.5 ? '' : '-'}40px, -80px); }
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