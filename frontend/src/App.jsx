// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './Pages/Dashboard';
import Reconciliation from './components/Payment/Reconciliation';
import Form from './components/Payment/Form';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard with Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Nested route for Reconciliation */}
          <Route path="reconciliation" element={<Reconciliation />} />
          <Route path='form' element={<Form/>}/>
          {/* Optional: Add more nested pages here in future */}
          {/* <Route path="another-page" element={<AnotherComponent />} /> */}

          {/* Default inside dashboard - optional redirect or welcome */}
          {/* <Route index element={
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">
                Please select a module from the sidebar.
              </p>
            </div>
          } /> */}
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;