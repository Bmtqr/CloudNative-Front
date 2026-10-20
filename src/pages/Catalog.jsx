import React, { useState, useEffect } from 'react';
import { 
  getServices, 
  createService, 
  deleteService, 
  updateServiceQuota 
} from '../services/catalogService';
import { useMsal } from '@azure/msal-react';
import { fetchUserRoles } from '../utils/token';

export default function Catalog() {
  const { instance, accounts } = useMsal();
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Formulario: Crear Prestación + Cupo inicial
  const [newService, setNewService] = useState({
    serviceName: '',
    description: '',
    price: '',
    initialQuota: 15
  });
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(null);

  // Panel: Actualizar cupos de un servicio existente
  const [quotaServiceId, setQuotaServiceId] = useState('');
  const [quotaAmount, setQuotaAmount] = useState(10);
  const [updatingQuota, setUpdatingQuota] = useState(false);
  const [quotaSuccess, setQuotaSuccess] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (accounts.length > 0) {
        try {
          const roles = await fetchUserRoles(instance, accounts[0]);
          setIsAdmin(roles.includes('Admin'));
        } catch (e) {
          console.error('Error al obtener roles:', e);
        }
      }
      await loadServices();
    };
    initialize();
  }, [instance, accounts]);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServices();
      const list = Array.isArray(data) ? data : [];
      setServices(list);
      if (list.length > 0 && !quotaServiceId) {
        setQuotaServiceId(list[0].id);
      }
    } catch (err) {
      console.error('Error al cargar catálogo:', err);
      setError('No se pudo sincronizar el catálogo de prestaciones.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateSuccess(null);
    try {
      const payload = {
        serviceName: newService.serviceName,
        description: newService.description,
        price: parseFloat(newService.price) || 0,
        isActive: true
      };

      const created = await createService(payload);

      // Si se definió cupo inicial, se le asigna inmediatamente
      if (newService.initialQuota && created?.id) {
        await updateServiceQuota(created.id, { quota: Number(newService.initialQuota) });
      }

      setCreateSuccess(`Prestación #${created.id} ("${created.serviceName}") creada exitosamente.`);
      setNewService({ serviceName: '', description: '', price: '', initialQuota: 15 });
      await loadServices();
    } catch (err) {
      console.error('Error al crear prestación:', err);
      alert('Error al registrar la prestación en catálogo.');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateQuota = async (e) => {
    e.preventDefault();
    if (!quotaServiceId) return;
    setUpdatingQuota(true);
    setQuotaSuccess(null);
    try {
      await updateServiceQuota(quotaServiceId, { quota: Number(quotaAmount) });
      setQuotaSuccess(`Cupos actualizados (${quotaAmount}) para la prestación #${quotaServiceId}.`);
    } catch (err) {
      console.error('Error al actualizar cupo:', err);
      alert('No se pudo asignar el cupo. Verifica la conexión con ms-catalog.');
    } finally {
      setUpdatingQuota(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Deseas dar de baja la prestación #${id}?`)) return;
    try {
      setDeletingId(id);
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Error al eliminar prestación:', err);
      alert('No se pudo eliminar la prestación.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <p>Cargando catálogo...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2 className="page-title">Catálogo de Prestaciones y Disponibilidad</h2>

      {error && <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>}

      {isAdmin && (
        <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
          {/* Formulario 1: Nueva Prestación */}
          <div className="card">
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Nueva Prestación Médica</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
              Registra una prestación y define sus cupos iniciales de atención.
            </p>
            {createSuccess && (
              <p style={{ color: '#16a34a', marginBottom: '12px', fontWeight: '500' }}>
                {createSuccess}
              </p>
            )}
            <form onSubmit={handleCreateService} className="form-grid">
              <div className="form-group">
                <label className="form-label">Nombre:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Medicina General"
                  required
                  value={newService.serviceName}
                  onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej: Control y diagnóstico clínico"
                  required
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio ($):</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="15000"
                  min="0"
                  required
                  value={newService.price}
                  onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Cupos Iniciales:</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  required
                  value={newService.initialQuota}
                  onChange={(e) => setNewService({ ...newService, initialQuota: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={creating} style={{ width: '100%' }}>
                  {creating ? 'Guardando...' : 'Crear Prestación'}
                </button>
              </div>
            </form>
          </div>

          {/* Formulario 2: Actualización de Cupos */}
          <div className="card" style={{ borderLeft: '4px solid #3b82f6' }}>
            <h3 style={{ marginTop: 0, marginBottom: '8px' }}>Asignación de Cupos Disponibles</h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '16px' }}>
              Modifica la cantidad de atenciones disponibles para un servicio existente.
            </p>
            {quotaSuccess && (
              <p style={{ color: '#16a34a', marginBottom: '12px', fontWeight: '500' }}>
                {quotaSuccess}
              </p>
            )}
            <form onSubmit={handleUpdateQuota} style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ minWidth: '240px', flex: 1 }}>
                <label className="form-label">Prestación:</label>
                <select
                  className="form-control"
                  value={quotaServiceId}
                  onChange={(e) => setQuotaServiceId(e.target.value)}
                  required
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.id} - {s.serviceName || 'Servicio'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: '160px' }}>
                <label className="form-label">Cupos a Asignar:</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  required
                  value={quotaAmount}
                  onChange={(e) => setQuotaAmount(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={updatingQuota} style={{ height: '38px' }}>
                {updatingQuota ? 'Asignando...' : 'Actualizar Cupos'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de Servicios */}
      <h3 style={{ marginBottom: '16px' }}>Prestaciones Disponibles</h3>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Estado</th>
              {isAdmin && <th style={{ textAlign: 'center' }}>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center' }}>
                  No hay prestaciones registradas.
                </td>
              </tr>
            ) : (
              services.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td><strong>{s.serviceName}</strong></td>
                  <td>{s.description}</td>
                  <td>${Number(s.price).toLocaleString('es-CL')}</td>
                  <td>
                    <span style={{ color: s.isActive ? '#15803d' : '#991b1b', fontWeight: '500' }}>
                      {s.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {isAdmin && (
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
                          padding: '5px 12px',
                          fontSize: '0.85rem',
                          cursor: deletingId === s.id ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {deletingId === s.id ? 'Eliminando...' : 'Dar de baja'}
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}