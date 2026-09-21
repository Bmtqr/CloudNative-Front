import api from '../api/axiosInstance';

// Obtener todas las prestaciones
export const getServices = async () => {
  const response = await api.get('/catalog/services');
  return response.data;
};

// Crear una nueva prestación
export const createService = async (serviceData) => {
  const response = await api.post('/catalog/services', serviceData);
  return response.data;
};

// Actualizar precio o cupos
export const updateServiceQuota = async (id, data) => {
  const response = await api.put(`/catalog/services/${id}`, data);
  return response.data;
};