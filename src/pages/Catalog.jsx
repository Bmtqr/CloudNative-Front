import { useState, useEffect } from "react";
import { getServices, createService, deleteService } from "../services/catalogService";

import { useMsal } from "@azure/msal-react";
import {fetchUserRoles} from "../utils/token";

export default function Catalog() {
  const { instance, accounts } = useMsal();
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = async (id) => {
      const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la prestación #${id}?`);
      if (!confirmDelete) return;
  
      try {
        setDeletingId(id);
        if (typeof deleteService === 'function') {
          await deleteService(id);
        }
        // Actualizar la lista localmente de inmediato
        setServices((prev) => prev.filter((s) => s.id !== id));
      } catch (err) {
        console.error('Error al eliminar la prestación:', err);
        alert('No se pudo eliminar la prestación.');
      } finally {
        setDeletingId(null);
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
            <th style={{ textAlign: 'center' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
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
                <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      disabled={deletingId === s.id}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: deletingId === s.id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === s.id ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {deletingId === s.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
              </tr>
              
            ))
          )}
        </tbody>
      </table>
     </div> 
    </div>
  );
}