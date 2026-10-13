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
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Error al iniciar sesión con Microsoft:", error);
    });
  };
  

  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',minHeight: '100vh'}}>
      <div className="card" style={{width: '100%', textAlign: 'center', maxWidth: '400px'}}>
        <h2 style={{ color: 'var(--text-h)', marginBottom: '10px', marginTop:0 }}>Plataforma VidaSalud</h2>
        <p style={{ color: 'var(--text)', marginBottom: '32px' }}>
          Sistema unificado para gestión de atenciones clínicas
        </p>
        <button className="btn-primary" onClick={handleLogin} style={{width: '100%'}}>
          Iniciar Sesión con Microsoft
        </button>
      </div>
    </div>
  );
}