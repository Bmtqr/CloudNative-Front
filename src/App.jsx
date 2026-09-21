import './App.css'
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from './authConfig';

function App() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).catch(e => console.error(e));
  };

  const handleLogout = () => {
    instance.logoutPopup().catch(e => console.error(e));
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Plataforma VidaSalud</h1>

      {isAuthenticated ? (
        <div>
          <p>✅ Sesión iniciada como: <strong>{accounts[0]?.username}</strong></p>
          <button onClick={handleLogout}>Cerrar Sesión</button>
        </div>
      ) : (
        <div>
          <p>Debes iniciar sesión para acceder al sistema.</p>
          <button onClick={handleLogin}>Iniciar Sesión con Microsoft</button>
        </div>
      )}
    </div>
  );
}

export default App;