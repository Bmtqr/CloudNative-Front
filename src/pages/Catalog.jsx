import { useState, useEffect } from 'react';
import { getServices, createService } from '../services/catalogService';

export default function Catalog() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [serviceName, setServiceName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar el catálogo:", err);
      setError("No se pudo cargar el catálogo. Verifica que el BFF esté encendido.");
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
        isActive: true
      };

      const created = await createService(newService);
      setServices([...services, created]); 
      
      setServiceName('');
      setDescription('');
      setPrice('');
      alert("Prestación creada con éxito");
    } catch (err) {
      console.error("Error al crear:", err);
      alert("Hubo un error al crear la prestación.");
    }
  };

  if (loading) return <p>Cargando catálogo...</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Catálogo de Prestaciones</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Formulario de Creación */}
      <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc' }}>
        <h3>Agregar Nueva Prestación</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label>Nombre: </label>
            <input 
              type="text" 
              required 
              value={serviceName} 
              onChange={(e) => setServiceName(e.target.value)} 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Descripción: </label>
            <input 
              type="text" 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Precio ($): </label>
            <input 
              type="number" 
              required 
              min="0"
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
            />
          </div>
          <button type="submit">Guardar Prestación</button>
        </form>
      </div>

      {/* Tabla de Resultados */}
      <h3>Prestaciones Disponibles</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f4f4f4' }}>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {services.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay prestaciones registradas.</td></tr>
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
  );
}
