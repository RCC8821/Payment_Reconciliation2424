




import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
} from "lucide-react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/Auth/LoginSlice";

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isPaymentDropdownOpen, setIsPaymentDropdownOpen] = useState(false);

  const { userType, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [token, navigate]);

useEffect(() => {
    const currentPage = paymentPages.find((p) => p.path === location.pathname);
    if (currentPage) {
      setSelectedPage(currentPage.id);
      // Dropdown khud open nahi hoga — sirf active item highlight hoga
    } else {
      setSelectedPage(null);
    }
  }, [location.pathname]);

  // ============== ONLY PAYMENT PAGES ==============
  const paymentPages = [
    {
      id: "Reconciliation",
      name: "Reconciliation",
      path: "/dashboard/Reconciliation",
      allowedUserTypes: ["admin"],
    },
    {
      id: "Form ",
      name: "Forms",
      path: "/dashboard/Form",
      allowedUserTypes: ["admin"],
    },
     {
      id: "Actual_Payment_in ",
      name: "Actual_Payment_in",
      path: "/dashboard/Actual_Payment_in",
      allowedUserTypes: ["admin"],
    },
 
  {
      id: "Transfer_bank_To_bank ",
      name: "Transfer_bank_To_bank",
      path: "/dashboard/Transfer_bank_To_bank",
      allowedUserTypes: ["admin"],
    },
  ];

  // Filter pages user has access to
  const accessiblePaymentPages = paymentPages.filter((page) =>
    page.allowedUserTypes.includes(userType)
  );

  const selectPage = (pageId) => {
    const page = paymentPages.find((p) => p.id === pageId);
    if (page) {
      setSelectedPage(pageId);
      setIsPaymentDropdownOpen(false);
      setIsMobileMenuOpen(false);
      navigate(page.path);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* ==================== FIXED SIDEBAR ==================== */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 
          bg-gradient-to-b from-slate-900 to-slate-800 
          shadow-2xl transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isSidebarExpanded ? "lg:w-72" : "lg:w-20"}
        `}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`flex items-center p-6 border-b border-white/10 ${
              isSidebarExpanded ? "justify-between" : "lg:justify-center"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                <img
                  src="/rcc-logo.png"
                  alt="RCC Logo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <h1
                className={`text-xl font-bold text-white transition-all duration-300 ${
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }`}
              >
                RCC Payment
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setIsPaymentDropdownOpen(!isPaymentDropdownOpen)}
                  className={`w-full flex items-center space-x-3 px-4 py-4 rounded-2xl transition-all duration-200 text-white ${
                    isPaymentDropdownOpen || selectedPage
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 shadow-lg"
                      : "hover:bg-white/10"
                  } ${!isSidebarExpanded ? "lg:justify-center" : ""}`}
                >
                  <DollarSign className="w-6 h-6 flex-shrink-0" />
                  <span
                    className={`font-medium transition-all ${
                      isSidebarExpanded
                        ? "opacity-100"
                        : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
                    Payment
                  </span>
                  {isSidebarExpanded && (
                    <ChevronDown
                      className={`w-5 h-5 ml-auto transition-transform ${
                        isPaymentDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                {/* Dropdown */}
                {isSidebarExpanded &&
                  isPaymentDropdownOpen &&
                  accessiblePaymentPages.length > 0 && (
                    <ul className="ml-6 mt-3 space-y-2 bg-white/5 rounded-xl p-3 border border-white/10">
                      {accessiblePaymentPages.map((page) => (
                        <li key={page.id}>
                          <button
                            onClick={() => selectPage(page.id)}
                            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                              selectedPage === page.id
                                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium"
                                : "text-gray-300 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {page.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-white/10">
            <div
              className={`flex items-center mb-4 ${
                isSidebarExpanded ? "space-x-3" : "lg:justify-center"
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div
                className={
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }
              >
                <p className="text-white font-semibold">{userType}</p>
                <p className="text-gray-400 text-sm">Authorized User</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/20 transition-all ${
                isSidebarExpanded ? "space-x-3" : "lg:justify-center"
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span
                className={
                  isSidebarExpanded
                    ? "opacity-100"
                    : "opacity-0 w-0 overflow-hidden"
                }
              >
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT (Stable Width) ==================== */}
      <div className="flex-1 flex flex-col lg:ml-20">
        {/* Mobile Menu Button */}
        <div className="lg:hidden p-4">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-3 rounded-xl bg-white shadow-lg hover:bg-gray-100 transition"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="bg-white rounded-3xl shadow-xl p-6 lg:p-8 min-h-full border border-gray-100">
            {selectedPage ? (
              <Outlet />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <DollarSign className="w-20 h-20 text-emerald-500 mb-6 opacity-20" />
                <h3 className="text-2xl font-semibold text-gray-700 mb-3">
                  Welcome to Payment Module
                </h3>
                <p className="text-gray-500 max-w-md">
                  Please select a page from the "Payment" menu in the sidebar to get started.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;