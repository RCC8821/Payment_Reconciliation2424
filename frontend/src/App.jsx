
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';

// Pages & Components
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';

// Payment Section
import Summary from './components/paymentSummary/Summary';
import Reconciliation from './components/Payment/Reconciliation';
import Form from './components/Payment/Form';
import Actual_Payment_in from './components/Payment/Actual_Payment_in';
import Transfer_bank_To_bank from './components/Payment/Transfer_bank_To_bank';

// RCC Office
import RCC_Approvel from './components/RccOffice/RCC_Approvel';
import Approvel_By_Mayaksir from './components/RccOffice/Approvel_By_Mayaksir';
import OfficeExpensesPayment from './components/RccOffice/OfficeExpensesPayment';

// VRN Office
import VRN_Approvel1 from './components/VRNOffice/VRN_Approvel1';
import VRN_Approvel2 from './components/VRNOffice/VRN_Approvel2';
import VRN_payment_Office from './components/VRNOffice/VRN_payment_Office';

// Dimension Office
import Dim_Approvel1 from './components/DimensionOffice/Dim_Approvel1';
import Dim_Approvel2 from './components/DimensionOffice/Dim_Approvel2';
import Dim_Payment_Office from './components/DimensionOffice/Dim_Payment_Office';

// GST
import GstData from './components/GST/GstData';

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route - Login */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard + Nested Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Summary & GST – top-level sections */}
          <Route path="summary" element={<Summary />} />
          <Route path="gst" element={<GstData />} />

          {/* Payment Module */}
          <Route path="reconciliation" element={<Reconciliation />} />
          <Route path="form" element={<Form />} />
          <Route path="actual-payment-in" element={<Actual_Payment_in />} />
          <Route path="transfer-bank-to-bank" element={<Transfer_bank_To_bank />} />

          {/* RCC Office */}
          <Route path="rcc-approvel" element={<RCC_Approvel />} />
          <Route path="approvel-by-mayanksir" element={<Approvel_By_Mayaksir />} />
          <Route path="office-expenses-payment" element={<OfficeExpensesPayment />} />

          {/* VRN Office */}
          <Route path="vrn-approvel1" element={<VRN_Approvel1 />} />
          <Route path="vrn-approvel2" element={<VRN_Approvel2 />} />
          <Route path="vrn-payment" element={<VRN_payment_Office />} />

          {/* Dimension Office */}
          <Route path="dim-approvel1" element={<Dim_Approvel1 />} />
          <Route path="dim-approvel2" element={<Dim_Approvel2 />} />
          <Route path="dim-payment" element={<Dim_Payment_Office />} />

          {/* Optional: default / redirect inside dashboard */}
          <Route
            index
            element={<Navigate to="summary" replace />}
          />
        </Route>

        {/* Catch-all unknown routes → redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;