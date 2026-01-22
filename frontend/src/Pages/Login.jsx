import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../../src/features/Auth/LoginSlice"; // path adjust कर लेना अगर अलग है
import { useNavigate } from "react-router-dom";
import { LogIn, Sparkles, Zap } from "lucide-react";

const Login = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state से values
  const { isLoading, error, isAuthenticated, userName } = useSelector(
    (state) => state.auth,
  );

  // Landing animation: 3 seconds बाद form दिखे
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // अगर पहले से logged in है तो dashboard पर redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      // optional: custom client-side message
      return;
    }

    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && email.trim() && password.trim()) {
      handleSubmit(e);
    }
  };

  // Landing Screen
  if (showLanding) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black to-indigo-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles
                className="w-32 h-32 text-yellow-300 animate-spin"
                style={{ animationDuration: "3s" }}
              />
            </div>
            <Zap className="w-24 h-24 text-white mx-auto relative z-10 animate-bounce" />
          </div>

          <h1 className="text-6xl font-bold text-white mb-4 animate-slide-up">
            Welcome To Payment Reconciliation
          </h1>

          <div
            className="flex items-center justify-center space-x-2 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          <p
            className="text-2xl text-blue-200 mt-6 animate-slide-up"
            style={{ animationDelay: "0.5s" }}
          >
            Loading your experience...
          </p>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 1s ease-out;
          }
          .animate-slide-up {
            animation: slide-up 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    );
  }

  // Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 transform transition-all">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full blur-xl opacity-50" />
              <div className="relative bg-white/60 p-4 rounded-full">
                {/* logo adjust कर लेना */}
                <img src="/rcc-logo.png" alt="RCC Logo" className="w-9 h-9" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Payment Reconciliation
          </h2>
          <p className="text-center text-blue-200 mb-8">
            Login to access your dashboard
          </p>

          {/* Optional: अगर login के बाद name दिखाना चाहो (debug/help के लिए) */}
          {userName && (
            <p className="text-center text-green-300 mb-4">
              Welcome back, {userName}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold rounded-xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Login
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button className="text-sm text-blue-300 hover:text-white transition-colors">
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
