import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { useIsAuthenticated, useMsal } from '@azure/msal-react';

import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Appointments from './pages/Appointments'; // Lo crearemos en el siguiente paso

// Guard de protección de rutas privadas
function ProtectedRoute({ children }) {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  const handleLogout = () => {
    instance.logoutPopup();
  };

  return (
    <Router>
      {/* Barra de navegación visible solo con sesión activa */}
      {isAuthenticated && (
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2c3e50',
          padding: '12px 24px',
          color: 'white',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <strong style={{ fontSize: '18px', marginRight: '10px' }}>🏥 VidaSalud</strong>
            <Link to="/catalog" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: '500' }}>
              Catálogo
            </Link>
            <Link to="/appointments" style={{ color: '#ecf0f1', textDecoration: 'none', fontWeight: '500' }}>
              Atenciones / Citas
            </Link>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#bdc3c7' }}>
              👤 {accounts[0]?.username}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: '6px 12px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cerrar Sesión
            </button>
          </div>
        </nav>
      )}

      {/* Definición de Rutas */}
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/catalog" element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        } />

        <Route path="/appointments" element={
          <ProtectedRoute>
            <Appointments />
          </ProtectedRoute>
        } />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/catalog" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}