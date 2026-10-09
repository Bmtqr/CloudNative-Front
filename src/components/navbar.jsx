import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import {fetchUserRoles} from "../utils/token";

export const Navbar = () => {
  const { instance, accounts } = useMsal();
  const location = useLocation();
  const currentPath = location.pathname;

  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    const getUserRoles = async () => {
      if (accounts.length > 0) {
        const roles = await fetchUserRoles(instance, accounts[0]);
        setUserRoles(roles);
      }
    };
    getUserRoles();
  }, [instance, accounts]);

  const isAdmin = userRoles.includes("Admin");
  const isRecepcionista = userRoles.includes("Recepcionista");
  const isPaciente = userRoles.includes("Paciente");
  const isAuditor = userRoles.includes("Auditor");

  const isActive = (path) => currentPath === path;

  const handleLogout = () => {
    instance.logoutPopup();
  };

  const linkStyle = (path) => ({
    color: isActive(path) ? "var(--accent)" : "var(--text)",
    fontWeight: isActive(path) ? "600" : "500",
    backgroundColor: isActive(path) ? "var(--bg-app)" : "transparent",
  });

  return (
    <aside className="sidebar">
      <Link to="/dashboard" style={{textDecoration:"none"}}>
        <h2 className="sidebar-title" style={{cursor:"pointer"}}>VidaSalud</h2>
      </Link>
      
        <nav className="sidebar-nav">

          <Link to="/dashboard" className="sidebar-link" style={linkStyle("/dashboard")}>
            Dashboard
          </Link>

          <Link to="/appointments" className="sidebar-link" style={linkStyle("/appointments")}>
            Atenciones
          </Link>

          {(isRecepcionista || isAdmin) && (
            <Link to="/catalog" className="sidebar-link" style={linkStyle("/catalog")}>
              Catálogo
            </Link>
          )}

          {isAdmin && (
            <Link to="/report" className="sidebar-link" style={linkStyle("/report")}>
              Reporte
            </Link>
          )}
          {(isAdmin || isAuditor) && (
            <Link to="/audit" className="sidebar-link" style={linkStyle("/audit")}>
              Audit
            </Link>
          )}
        </nav>
      
      <div style={{marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-h)" }}>
            {accounts[0]?.name || accounts[0]?.username}
        </div>
        <div>
          <span className="badge badge-blue">
            {userRoles[0] || "Usuario"}
          </span>
        </div>
      </div>
        

      <button
          onClick={handleLogout}
          style={{ padding: "8px 12px", backgroundColor: "transparent", color: "#ef4444", border: "1px solid #ef4444", borderRadius: "6px", cursor: "pointer", fontWeight: "600"}}>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};
