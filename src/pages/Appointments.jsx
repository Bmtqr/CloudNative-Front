<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { getAppointments, createAppointment } from '../services/appointmentService';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

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

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Gestión de Atenciones y Citas</h2>

      {/* Formulario de Registro */}
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Agendar Nueva Atención</h3>
        
        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px', maxWidth: '500px' }}>
          <div>
            <label>ID Paciente: </label>
            <input
              type="number"
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label>Correo del Paciente: </label>
            <input
              type="email"
              name="patientEmail"
              value={formData.patientEmail}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label>ID Centro Médico: </label>
            <input
              type="number"
              name="centerId"
              value={formData.centerId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label>ID Servicio / Prestación: </label>
            <input
              type="number"
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div>
            <label>Fecha de Atención: </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: submitting ? 'not-allowed' : 'pointer'
            }}
          >
            {submitting ? 'Agendando...' : 'Agendar Cita'}
          </button>
        </form>
      </div>

      {/* Lista de Atenciones */}
      <h3>Listado de Atenciones Registradas</h3>

      {loading && <p>Cargando atenciones...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textWrap: 'nowrap' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Paciente (ID)</th>
              <th>Email</th>
              <th>Centro</th>
              <th>Servicio</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Appointments;
=======
export default function Appointments() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Gestión de Atenciones y Citas</h2>
      <p>Módulo de citas en construcción...</p>
    </div>
  );
}
>>>>>>> aws
