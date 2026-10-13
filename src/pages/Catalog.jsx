import { useState, useEffect } from "react";
import { getServices, createService } from "../services/catalogService";

import { useMsal } from "@azure/msal-react";
import {fetchUserRoles} from "../utils/token";

export default function Catalog() {
  const { instance, accounts } = useMsal();
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    const getUserRoles = async () => {
      if (accounts.length > 0) {
        const roles = await fetchUserRoles(instance, accounts[0]);
        setIsAdmin(roles.includes("Admin"));
      }
    };
    getUserRoles();
    fetchServices();
  }, [instance, accounts]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar el catálogo:", err);
      setError(
        "No se pudo cargar el catálogo. Verifica que el BFF esté encendido.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newService = {
        serviceName,
        description,
        price: parseFloat(price),
        isActive: true,
      };

      const created = await createService(newService);
      setServices([...services, created]);

      setServiceName("");
      setDescription("");
      setPrice("");
      alert("Prestación creada con éxito");
    } catch (err) {
      console.error("Error al crear:", err);
      alert("Hubo un error al crear la prestación.");
    }
  };

  if (loading) return <div className="page-container"><p>Cargando catálogo...</p></div>;

  return (
    <div className="page-container">
      <h2 className="page-title">Catálogo de Prestaciones</h2>

      {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

      {isAdmin && (
        <div className="card">
          <h3 style={{ marginTop: 0, marginBottom: '24px', color: 'var(--text-h)' }}>Agregar Nueva Prestación</h3>
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="form-label">Nombre: </label>
              <input type="text" className="form-control" required value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción: </label>
              <input type="text" className="form-control" required value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Precio ($): </label>
              <input type="number" className="form-control" required min="0" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div style={{display:'flex', alignItems: 'flex-end'}}>
              <button type="submit" className="btn-primary" style={{width: '100%'}}>
                Guardar Prestación
              </button>
            </div>
          </form>
        </div>
      )}

      <h3 style={{ marginBottom: '16px', color: 'var(--text-h)' }}> Prestaciones Disponibles</h3>
      <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No hay prestaciones registradas.
              </td>
            </tr>
          ) : (
            services.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.serviceName}</td>
                <td>{s.description}</td>
                <td>${s.price}</td>
                <td>{s.isActive ? "Activo" : "Inactivo"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
     </div> 
    </div>
  );
}