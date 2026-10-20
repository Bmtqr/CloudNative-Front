export const MEDICAL_CENTERS = [
  { id: "1", name: "Centro Médico Central", address: "Av. Providencia 1234" },
  { id: "2", name: "Clínica Norte", address: "Av. Independencia 567" },
  { id: "3", name: "Centro de Salud Oriente", address: "Las Condes 890" },
  { id: "4", name: "Sucursal Poniente", address: "Av. Pajaritos 2450" }
];

export const getCenterNameById = (centerId) => {
  if (!centerId) return "Sin Centro";
  const found = MEDICAL_CENTERS.find((c) => String(c.id) === String(centerId));
  return found ? found.name : `Centro #${centerId}`;
};