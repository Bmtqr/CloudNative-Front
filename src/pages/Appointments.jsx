import React, { useState, useEffect } from 'react';
import { 
  getAppointments, 
  createAppointment, 
  deleteAppointment,
  updateAppointmentStatus 
} from '../services/appointmentService';
import { getServices } from '../services/catalogService';
import { MEDICAL_CENTERS, getCenterNameById } from '../constants/centers';

const AVAILABLE_STATUSES = [
  'SOLICITADA',
  'CONFIRMADA',
  'EN_ESPERA',
  'EN_ATENCION',
  'CERRADA',
  'CANCELADA'
];

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Formulario de cita
  const [formData, setFormData] = useState({
    patientId: '',
    patientEmail: '',
    centerId: MEDICAL_CENTERS[0]?.id || '1',
    serviceId: '',
    appointmentDate: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Edición de estados en tabla
  const [editingId, setEditingId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appData, servData] = await Promise.all([
        getAppointments(),
        getServices().catch(() => [])
      ]);
      setAppointments(Array.isArray(appData) ? appData : []);
      const servList = Array.isArray(servData) ? servData : [];
      setServices(servList);

      if (servList.length > 0 && !formData.serviceId) {
        setFormData((prev) => ({ ...prev, serviceId: servList[0].id }));
      }
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al sincronizar datos con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      const payload = {
        patientId: Number(formData.patientId),
        patientEmail: formData.patientEmail,
        centerId: String(formData.centerId),
        serviceId: Number(formData.serviceId),
        appointmentDate: formData.appointmentDate
      };

      await createAppointment(payload);
      setFormData((prev) => ({
        ...prev,
        patientId: '',
        patientEmail: '',
        appointmentDate: ''
      }));

      const updated = await getAppointments();
      setAppointments(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Error al agendar atención:', err);
      setSubmitError('No se pudo crear la atención. Revisa los datos ingresados.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveStatus = async (id) => {
    try {
      setUpdatingId(id);
      await updateAppointmentStatus(id, selectedStatus);
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: selectedStatus } : item))
      );
      setEditingId(null);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert(`No se pudo actualizar el estado: ${err.response?.data?.message || err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`¿Deseas eliminar la atención #${id}?`)) return;
    try {
      setDeletingId(id);
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar cita:', err);
      alert('No se pudo eliminar la cita seleccionada.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Agendamiento y Control de Atenciones</h2>

      {/* Formulario */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px' }}>Agendar Nueva Atención</h3>
        {submitError && <p style={{ color: '#ef4444', marginBottom: '14px' }}>{submitError}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">RUT / ID Paciente:</label>
            <input
              type="number"
              name="patientId"
              className="form-control"
              placeholder="Ej: 18456789"
              required
              value={formData.patientId}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo Notificación:</label>
            <input
              type="email"
              name="patientEmail"
              className="form-control"
              placeholder="paciente@mail.cl"
              required
              value={formData.patientEmail}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Centro Médico:</label>
            <select
              name="centerId"
              className="form-control"
              required
              value={formData.centerId}
              onChange={handleChange}
            >
              {MEDICAL_CENTERS.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Prestación / Servicio:</label>
            <select
              name="serviceId"
              className="form-control"
              required
              value={formData.serviceId}
              onChange={handleChange}
            >
              {services.length === 0 ? (
                <option value="">No hay prestaciones en catálogo</option>
              ) : (
                services.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.id} - {s.serviceName || 'Servicio'}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Atención:</label>
            <input
              type="date"
              name="appointmentDate"
              className="form-control"
              required
              value={formData.appointmentDate}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting}
              style={{ width: '100%' }}
            >
              {submitting ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de atenciones */}
      <h3 style={{ marginBottom: '16px' }}>Listado de Atenciones Clínicas</h3>
      {loading && <p>Cargando atenciones...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Paciente</th>
                <th>Correo</th>
                <th>Centro</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center' }}>
                    No hay atenciones agendadas.
                  </td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.patientId}</td>
                    <td>{item.patientEmail}</td>
                    <td>
                      <strong>{getCenterNameById(item.centerId)}</strong>
                    </td>
                    <td>#{item.serviceId}</td>
                    <td>{item.appointmentDate}</td>
                    <td>
                      {editingId === item.id ? (
                        <select
                          className="form-control"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          {AVAILABLE_STATUSES.map((st) => (
                            <option key={st} value={st}>{st}</option>
                          ))}
                        </select>
                      ) : (
                        <strong>{item.status || 'SOLICITADA'}</strong>
                      )}
                    </td>
                    <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                      {editingId === item.id ? (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleSaveStatus(item.id)}
                            disabled={updatingId === item.id}
                            style={{
                              backgroundColor: '#dcfce7',
                              color: '#15803d',
                              border: '1px solid #86efac',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            {updatingId === item.id ? 'Guardando...' : 'Guardar'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            style={{
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id);
                              setSelectedStatus(item.status || 'SOLICITADA');
                            }}
                            style={{
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              border: '1px solid #c7d2fe',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            Editar Estado
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#b91c1c',
                              border: '1px solid #fca5a5',
                              borderRadius: '6px',
                              padding: '5px 10px',
                              fontSize: '0.85rem',
                              cursor: 'pointer'
                            }}
                          >
                            {deletingId === item.id ? '...' : 'Eliminar'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Appointments;