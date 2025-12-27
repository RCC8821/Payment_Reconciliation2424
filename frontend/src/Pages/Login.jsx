// // src/pages/Login.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { loginUser, clearError } from '../features/Auth/LoginSlice';
// import { useNavigate } from 'react-router-dom';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

//   // Agar already logged in hai to direct dashboard pe bhej do
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
//   }, [isAuthenticated, navigate]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(clearError());
//     dispatch(loginUser({ email, password }));
//   };

//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '100vh',
//       backgroundColor: '#f0f2f5'
//     }}>
//       <div style={{
//         background: 'white',
//         padding: '40px',
//         borderRadius: '10px',
//         boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
//         width: '100%',
//         maxWidth: '400px'
//       }}>
//         <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
//           Login to Dashboard
//         </h2>

//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               placeholder="Enter your email"
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 borderRadius: '6px',
//                 border: '1px solid #ccc',
//                 fontSize: '16px'
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: '20px' }}>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               placeholder="Enter your password"
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 borderRadius: '6px',
//                 border: '1px solid #ccc',
//                 fontSize: '16px'
//               }}
//             />
//           </div>

//           {error && (
//             <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={isLoading}
//             style={{
//               width: '100%',
//               padding: '14px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '6px',
//               fontSize: '18px',
//               cursor: isLoading ? 'not-allowed' : 'pointer',
//               opacity: isLoading ? 0.7 : 1
//             }}
//           >
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
//           Test Credentials (example):<br />
//           Email: nandu24@gmail.com<br />
//           Password: jo bhi backend mein set hai
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../src/features/Auth/LoginSlice';
import { useNavigate } from 'react-router-dom';
import { LogIn, Sparkles, Zap } from 'lucide-react';

const Login = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Landing animation: 3 seconds ke baad login form show
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLanding(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Agar already authenticated hai (localStorage se load hua), to direct dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e) => {
    e?.preventDefault(); // form submit hone pe page reload na ho

    if (!email.trim() || !password) {
      dispatch(clearError());
      // You can show a custom message if needed, but backend error will handle most cases
      return;
    }

    dispatch(clearError());
    dispatch(loginUser({ email, password }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && email.trim() && password) {
      handleSubmit();
    }
  };

  // Landing Page
  if (showLanding) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-32 h-32 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <Zap className="w-24 h-24 text-white mx-auto relative z-10 animate-bounce" />
          </div>
          
          <h1 className="text-6xl font-bold text-white mb-4 animate-slide-up">Welcome</h1>
          
          <div className="flex items-center justify-center space-x-2 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          
          <p className="text-2xl text-blue-200 mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            Loading your experience...
          </p>
        </div>

        <style jsx>{`
          @keyframes fade-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 1s ease-out; }
          .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
        `}</style>
      </div>
    );
  }

  // Main Login Form
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-purple-900 bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white border-opacity-20 transform transition-all hover:scale-105 duration-300">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-50" />
              <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-full">
                <LogIn className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
            Payment Reconciliation
          </h2>
          <p className="text-center text-blue-200 mb-8">Login to access your dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-black bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-blue-100">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black bg-opacity-10 border border-white border-opacity-20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all backdrop-blur-sm"
              />
            </div>

            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email.trim() || !password}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          {/* Optional: Remove in production */}
          {/* <div className="mt-6 p-4 bg-white bg-opacity-5 rounded-xl border border-white border-opacity-10">
            <p className="text-xs text-blue-200 text-center">
              <span className="font-semibold">Demo Credentials:</span><br />
              Use your registered email & password
            </p>
          </div> */}

          <div className="mt-6 text-center">
            <button className="text-sm text-blue-300 hover:text-blue-200 transition-colors">
              Forgot Password?
            </button>
          </div>
        </div>

        <p className="text-center text-blue-200 mt-6 text-sm">
          Don't have an account? <button className="text-purple-300 hover:text-purple-200 font-semibold">Contact Admin</button>
        </p>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }
      `}</style>
    </div>
  );
};

export default Login;