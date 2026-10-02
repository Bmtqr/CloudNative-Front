import { BrowserRouter as Router,  Routes,  Route,  Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";

import Login from "./pages/Login";
import Catalog from "./pages/Catalog";
import Appointments from "./pages/Appointments";
import Dashboard from "./pages/Dashboard";
import { Navbar } from "./components/navbar";

function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/catalog" element={<ProtectedRoute> <Catalog /> </ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute> <Appointments /> </ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}