import React, { useState, useEffect } from 'react';
import { getAppointments, createAppointment, deleteAppointment } from '../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Estado para el formulario de agendamiento
  const [formData, setFormData] = useState({
    patientId: '',
    patientEmail: '',
    centerId: '',
    serviceId: '',
    appointmentDate: ''
  });

  // Cargar atenciones al montar el componente
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error al obtener atenciones:', err);
      setError('No se pudieron cargar las atenciones. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    // Formatear payload convirtiendo IDs a números
    const payload = {
      patientId: Number(formData.patientId),
      patientEmail: formData.patientEmail,
      centerId: Number(formData.centerId),
      serviceId: Number(formData.serviceId),
      appointmentDate: formData.appointmentDate
    };

    try {
      await createAppointment(payload);
      // Limpiar el formulario al guardar exitosamente
      setFormData({
        patientId: '',
        patientEmail: '',
        centerId: '',
        serviceId: '',
        appointmentDate: ''
      });
      // Recargar la tabla
      await fetchAppointments();
    } catch (err) {
      console.error('Error al agendar atención:', err);
      setSubmitError('Error al crear la atención. Revisa los datos e intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar la atención #${id}?`);
    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      if (typeof deleteAppointment === 'function') {
        await deleteAppointment(id);
      }
      // Actualizar la lista localmente de inmediato
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Error al eliminar la atención:', err);
      alert('No se pudo eliminar la atención.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Gestión de Atenciones y Citas</h2>

      {/* Formulario de Registro */}
      <div className="card">
        <h3 style={{marginTop: 0, marginBottom: '24px', color: 'var(--text-h)'}}>Agendar Nueva Atención</h3>
        
        {submitError && <p style={{ color: '#ef4444' ,marginBottom: '16px'}}>{submitError}</p>}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label">ID Paciente: </label>
            <input type="number" name="patientId" className="form-control" value={formData.patientId} onChange={handleChange} required />         
          </div>

          <div className="form-group">
            <label className="form-label">Correo del Paciente: </label>
            <input type="email" name="patientEmail" className="form-control" value={formData.patientEmail} onChange={handleChange} required />
            </div>

          <div className="form-group">
            <label className="form-label">ID Centro Médico: </label>
            <input type="number" name="centerId" className="form-control" value={formData.centerId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">ID Servicio / Prestación: </label>
            <input type="number" name="serviceId" className="form-control" value={formData.serviceId} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Fecha de Atención: </label>
            <input type="date" name="appointmentDate" className="form-control" value={formData.appointmentDate} onChange={handleChange} required />
          </div>

          <div style={{display:'flex', alignItems: 'flex-end'}}>
            <button type="submit" className="btn-primary" disabled={submitting} style={{width: '100%'}}>
            {submitting ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>

      {/* Lista de Atenciones */}
      <h3 style={{marginBottom: '16px', color: 'var(--text-h'}}>Listado de Atenciones Registradas</h3>

      {loading && <p>Cargando atenciones...</p>}
      {error && <p style={{ color: '#ef4444' }}>{error}</p>}

      {!loading && !error && (
        <div className="table-container">
        <table  className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente (ID)</th>
              <th>Email</th>
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
                  No hay atenciones registradas.
                </td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.patientId}</td>
                  <td>{item.patientEmail}</td>
                  <td>{item.centerId}</td>
                  <td>{item.serviceId}</td>
                  <td>{item.appointmentDate}</td>
                  <td>
                    <strong>{item.status || 'SOLICITADA'}</strong>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        border: '1px solid #fca5a5',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: deletingId === item.id ? 'not-allowed' : 'pointer',
                        opacity: deletingId === item.id ? 0.6 : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                    </button>
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