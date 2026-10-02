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
    color: isActive(path) ? "#ffffff" : "#bdc3c7",
    textDecoration: "none",
    fontWeight: isActive(path) ? "bold" : "500",
    padding: "8px 12px",
    borderRadius: "8px",
    backgroundColor: isActive(path) ? "#34495e" : "transparent",
  });

  return (
    <nav
      style={{display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#2c3e50", padding: "12px 24px", color: "white"}}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>

        <Link to="/dashboard" style={{ fontSize: "18px", marginRight: "10px", color: "white", textDecoration: "none", fontWeight: "bold"}}>
          VidaSalud
        </Link>

        <Link to="/dashboard" style={linkStyle("/dashboard")}>
          Dashboard
        </Link>

        <Link to="/appointments" style={linkStyle("/appointments")}>
          Atenciones
        </Link>

        {(isRecepcionista || isAdmin) && (
          <Link to="/catalog" style={linkStyle("/catalog")}>
            Catálogo
          </Link>
        )}

        {isAdmin && (
          <Link to="/report" style={linkStyle("/report")}>
            Reporte
          </Link>
        )}
        {(isAdmin || isAuditor) && (
          <Link to="/audit" style={linkStyle("/audit")}>
            Audit
          </Link>
        )}
      </div>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <span style={{ fontSize: "14px", color: "#bdc3c7" }}>
          {accounts[0]?.name || accounts[0]?.username}
        </span>

        <span
          style={{ fontSize: "10px", backgroundColor: "#e67e22", padding: "2px 6px", borderRadius: "4px", textTransform: "uppercase"}}>
          {userRoles[0] || "Usuario"}
        </span>

        <button
          onClick={handleLogout}
          style={{ padding: "6px 12px", backgroundColor: "#e74c3c", color: "white", border: "none", borderRadius: "4px", cursor: "pointer"}}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};
