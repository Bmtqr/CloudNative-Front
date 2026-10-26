import React, { useEffect, useState } from 'react';
import { getAllAuditEvents, getAuditEventsByAppointmentId } from '../services/auditService';

const Audit = () => {
  const [events, setEvents] = useState([]);
  const [filterId, setFilterId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAuditEvents = async (appointmentId = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = appointmentId.trim()
        ? await getAuditEventsByAppointmentId(appointmentId.trim())
        : await getAllAuditEvents();

      if (Array.isArray(data)) {
        setEvents(data);
      } else if (data && Array.isArray(data.content)) {
        setEvents(data.content);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error al cargar auditoría:', err);
      setError('No se pudo conectar con ms-audit o no hay datos.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditEvents();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAuditEvents(filterId);
  };

  const handleReset = () => {
    setFilterId('');
    fetchAuditEvents('');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2937' }}>Auditoria</h2>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
            Registro de eventos emitidos
          </p>
        </div>
        <button
          onClick={() => fetchAuditEvents(filterId)}
          style={{
            backgroundColor: '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Refrescar Datos
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Filtrar por ID de Atención (ej. 14)..."
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #d1d5db',
            width: '280px'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#374151',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 16px',
            cursor: 'pointer'
          }}
        >
          Buscar
        </button>
        {filterId && (
          <button
            type="button"
            onClick={handleReset}
            style={{
              backgroundColor: '#e5e7eb',
              color: '#374151',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 14px',
              cursor: 'pointer'
            }}
          >
            Limpiar Filtro
          </button>
        )}
      </form>

      {loading && <p style={{ color: '#0284c7' }}>Cargando eventos de auditoría...</p>}
      {error && <p style={{ color: '#dc2626' }}>{error}</p>}

      {!loading && events.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>No hay eventos de auditoría disponibles.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#f3f4f6', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px' }}>ID Registro</th>
                <th style={{ padding: '12px 16px' }}>Cita (Aggregate ID)</th>
                <th style={{ padding: '12px 16px' }}>Tipo de Evento</th>
                <th style={{ padding: '12px 16px' }}>Nuevo Estado</th>
                <th style={{ padding: '12px 16px' }}>Ejecutado Por</th>
                <th style={{ padding: '12px 16px' }}>Timestamp Evento</th>
                <th style={{ padding: '12px 16px' }}>Fecha Creación</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px 16px', color: '#6b7280' }}>#{ev.id}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#1f2937' }}>
                    #{ev.aggregateId}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.8rem'
                    }}>
                      {ev.eventType || 'N/A'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor:
                        ev.newStatus === 'CERRADA' ? '#f3f4f6' :
                        ev.newStatus === 'CONFIRMADA' ? '#dcfce7' :
                        ev.newStatus === 'EN_ATENCION' ? '#fef3c7' : '#e0e7ff',
                      color:
                        ev.newStatus === 'CERRADA' ? '#374151' :
                        ev.newStatus === 'CONFIRMADA' ? '#15803d' :
                        ev.newStatus === 'EN_ATENCION' ? '#b45309' : '#4338ca'
                    }}>
                      {ev.newStatus || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#4b5563' }}>{ev.executedBy || 'ANONYMOUS'}</td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.85rem' }}>
                    {ev.eventTimestamp ? new Date(ev.eventTimestamp).toLocaleString() : '-'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '0.85rem' }}>
                    {ev.createdAt ? new Date(ev.createdAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Audit;