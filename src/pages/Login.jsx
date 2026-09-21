import { useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../authConfig';

export default function Login() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/catalog');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Error al iniciar sesión con Microsoft:", error);
    });
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        backgroundColor: '#fff',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Plataforma VidaSalud</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '30px' }}>
          Sistema unificado para gestión de atenciones clínicas
        </p>

        <button
          onClick={handleLogin}
          style={{
            padding: '12px 24px',
            fontSize: '15px',
            backgroundColor: '#0078d4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '100%'
          }}
        >
          Iniciar Sesión con Microsoft
        </button>
      </div>
    </div>
  );
}