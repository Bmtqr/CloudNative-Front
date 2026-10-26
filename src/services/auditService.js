const BASE_URL = 'https://mxw86gy6c3.execute-api.us-east-1.amazonaws.com/api/audit';

export const getAllAuditEvents = async () => {
  const response = await fetch(BASE_URL, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};

export const getAuditEventsByAppointmentId = async (id) => {
  const response = await fetch(`${BASE_URL}/appointment/${id}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  return await response.json();
};