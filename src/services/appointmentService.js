import api from '../api/axiosInstance';

// Listar todas las atenciones
export const getAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

// Agendar / Crear una cita
export const createAppointment = async (appointmentData) => {
  const response = await api.post('/appointments', appointmentData);
  return response.data;
};

// Cambiar el estado de la cita (SOLICITADA, CONFIRMADA, etc.)
export const updateAppointmentStatus = async (id, status) => {
  const response = await api.put(`/appointments/${id}/status`, { status });
  return response.data;
};