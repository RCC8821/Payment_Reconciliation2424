// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Reconciliation from './components/Payment/Reconciliation';
import Form from './components/Payment/Form';
import Actual_Payment_in from './components/Payment/Actual_Payment_in';
import Transfer_bank_To_bank from './components/Payment/Transfer_bank_To_bank';

////// RCC OFFICE /////////////
import RCC_Approvel from './components/RccOffice/RCC_Approvel';
import Approvel_By_Mayaksir from './components/RccOffice/Approvel_By_Mayaksir';
import OfficeExpensesPayment from './components/RccOffice/OfficeExpensesPayment';

//////// VRN Office ///////////

import VRN_Approvel1 from './components/VRNOffice/VRN_Approvel1';
import VRN_Approvel2 from './components/VRNOffice/VRN_Approvel2';

// //////////// Dimension Office ///////////////

import Dim_Approvel1 from './components/DimensionOffice/Dim_Approvel1';
import Dim_Approvel2 from './components/DimensionOffice/Dim_Approvel2';

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
          <Route path='Actual_Payment_in' element={<Actual_Payment_in/>}/>
          <Route path='Transfer_bank_To_bank' element={<Transfer_bank_To_bank/>}/>
        ////// RCC OFFICE EXPENSES
          <Route path='RCC_Approvel' element={<RCC_Approvel/>}/>
          <Route path='Approvel_By_Mayaksir' element={<Approvel_By_Mayaksir/>}/>
          <Route path='OfficeExpensesPayment' element={<OfficeExpensesPayment/>}/>

         /////// VRN OFFICE 
         <Route path='VRN_Approvel1' element={<VRN_Approvel1/>}/>
         <Route path='VRN_Approvel2' element={<VRN_Approvel2/>}/>

         ////// Dimension 

         <Route path='Dim_Approvel1' element={<Dim_Approvel1/>}/>
         <Route path='Dim_Approvel2' element={<Dim_Approvel2/>}/>
        </Route>

        {/* Catch all unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;