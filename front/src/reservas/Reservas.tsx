import React, { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import './reservas.css';

// Tipos
interface ReservaApi {
  id: number;
  cliente: string;
  numeroTel: string;
  fechaInicio: string; // ISO
  fechaFin: string; // ISO
  departamentoId: number;
  estado?: string;
}

interface ReservaParsed extends Omit<ReservaApi, 'fechaInicio' | 'fechaFin'> {
  fechaInicio: Date;
  fechaFin: Date;
}

const departamentos = [
  { id: 1, nombre: 'Departamento Atlántico' },
  { id: 2, nombre: 'Departamento Medanos' },
];

// Utilidades
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

function addMonths(base: Date, diff: number) {
  return new Date(base.getFullYear(), base.getMonth() + diff, 1);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function generateMonthMatrix(base: Date) {
  const year = base.getFullYear();
  const month = base.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 Domingo
  const totalDays = daysInMonth(year, month);

  // Queremos semanas empezando en Lunes visualmente -> re-mapear
  const offset = (firstDayIndex - 1 + 7) % 7; // convierte para lunes=0

  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = new Array(offset).fill(null);

  for (let day = 1; day <= totalDays; day++) {
    currentWeek.push(new Date(year, month, day));
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }
  return weeks;
}

const formatDate = (d?: Date | null) => (d ? d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '');

// Componente principal
const Reservas: React.FC = () => {
  const [selectedDepto, setSelectedDepto] = useState<number>(1);
  const [reservas, setReservas] = useState<ReservaParsed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [visibleMonth, setVisibleMonth] = useState<Date>(() => new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [nombreCliente, setNombreCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [creating, setCreating] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch reservas
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get<ReservaApi[]>('/reservas');
        const parsed: ReservaParsed[] = data.map(r => ({
            ...r,
            fechaInicio: new Date(r.fechaInicio),
            fechaFin: new Date(r.fechaFin)
        }));
        setReservas(parsed);
      } catch (e: any) {
        setError('No se pudieron cargar las reservas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar las reservas del departamento seleccionado
  const reservasDepto = useMemo(() => reservas.filter(r => r.departamentoId === selectedDepto), [reservas, selectedDepto]);

  // Determinar si un día está reservado
  const isDayReserved = (day: Date) => {
    return reservasDepto.some(r => {
      // Consideramos ocupados todos los días dentro del rango [inicio, fin) (fin no inclusive)
      const inicio = startOfDay(r.fechaInicio);
      const fin = startOfDay(r.fechaFin);
      return day >= inicio && day < fin; // typical booking range
    });
  };

  const isInSelection = (day: Date) => {
    if (startDate && !endDate) return isSameDay(day, startDate);
    if (startDate && endDate) return day >= startOfDay(startDate) && day <= startOfDay(endDate);
    return false;
  };

  // Manejo de selección de rango
  const handleSelectDay = (day: Date | null) => {
    if (!day) return;
    const today = startOfDay(new Date());
    if (day < today) return; // pasado
    if (isDayReserved(day)) return; // ocupado

    if (!startDate) {
      setStartDate(day);
      setEndDate(null);
      return;
    }
    if (startDate && !endDate) {
      // Si el nuevo día es antes, reiniciamos
      if (day < startDate) {
        setStartDate(day);
        setEndDate(null);
        return;
      }
      // Verificar que el rango no tenga días ocupados en medio
      let cursor = startOfDay(startDate);
      let valid = true;
      while (cursor <= day) {
        if (isDayReserved(cursor) && !isSameDay(cursor, startDate)) { valid = false; break; }
        cursor = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() + 1);
      }
      if (!valid) {
        // Reinicio si hay conflicto
        setStartDate(day);
        setEndDate(null);
        return;
      }
      setEndDate(day);
      return;
    }
    // Si ya hay rango completo, empezar de nuevo
    setStartDate(day);
    setEndDate(null);
  };

  const clearSelection = () => { setStartDate(null); setEndDate(null); };

  const weeks = useMemo(() => generateMonthMatrix(visibleMonth), [visibleMonth]);

  const nextMonth = () => setVisibleMonth(m => addMonths(m, 1));
  const prevMonth = () => setVisibleMonth(m => addMonths(m, -1));

  const canSubmit = !!(startDate && endDate && nombreCliente.trim() && telefono.trim());

  const handleCreate = async () => {
    if (!canSubmit || !startDate || !endDate) return;
    setCreating(true);
    setSuccessMsg(null);
    setError(null);
    try {
      // Cambio: ahora enviamos a /reservas-request en lugar de /reservas
      await api.post('/reservas-request', {
        cliente: nombreCliente,
        numeroTel: telefono,
        fechaInicio: startDate.toISOString(),
        fechaFin: new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + 1).toISOString(),
        departamentoId: selectedDepto,
      });
      
      // Cambio: mensaje actualizado para reflejar que es una solicitud
      setSuccessMsg('Solicitud de reserva enviada correctamente. Recibirás una confirmación pronto.');
      
      // Nota: No refrescamos las reservas porque la solicitud está pendiente de aprobación
      // Solo limpiamos el formulario
      clearSelection();
      setNombreCliente('');
      setTelefono('');
    } catch (e: any) {
      console.error('Error al enviar solicitud:', e);
      
      // Mejorar el manejo de errores para mostrar información específica
      let errorMessage = 'Error enviando la solicitud de reserva. Por favor, intenta nuevamente.';
      
      if (e.response?.data?.message) {
        errorMessage = `Error: ${e.response.data.message}`;
      } else if (e.response?.status) {
        errorMessage = `Error del servidor (${e.response.status}). Por favor, intenta nuevamente.`;
      } else if (e.message) {
        errorMessage = `Error: ${e.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="reservas-wrapper">
      {/* estilos movidos a reservas.css */}

      <div className="panel fade-in" style={{ marginBottom: '1.5rem' }}>
        <h1 className="title">Solicitar Reserva</h1>
        <p style={{ margin: '0 0 1rem', fontSize: '.9rem', color: '#475569' }}>
          Elegí un departamento, seleccioná un rango de fechas disponible y completá tus datos para enviar tu solicitud de reserva. 
          Un administrador revisará tu solicitud y te contactará para confirmarla.
        </p>

        <div className="dept-selector">
          {departamentos.map(d => (
            <button
              key={d.id}
              className={`dept-button ${selectedDepto === d.id ? 'active' : ''}`}
              onClick={() => { setSelectedDepto(d.id); clearSelection(); }}
            >
              {d.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar fade-in">
          <div className="cal-header">
            <button className="nav-btn" onClick={prevMonth} aria-label="Mes anterior">‹</button>
            <div className="month-label">{visibleMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</div>
            <button className="nav-btn" onClick={nextMonth} aria-label="Mes siguiente">›</button>
          </div>
          <div className="weekdays">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <div key={d} style={{ textAlign: 'center' }}>{d}</div>)}
          </div>
          <div className="grid">
            {weeks.flat().map((day, idx) => {
              if (!day) return <div key={idx} className="day blank" />;
              const today = startOfDay(new Date());
              const past = day < today;
              const reserved = !past && isDayReserved(day);
              const selectedSingle = startDate && !endDate && isSameDay(day, startDate);
              const inRange = startDate && endDate && isInSelection(day);
              const rangeStart = startDate && endDate && isSameDay(day, startDate) && !isSameDay(startDate, endDate);
              const rangeEnd = startDate && endDate && isSameDay(day, endDate) && !isSameDay(startDate, endDate);

              const classNames = [
                'day',
                past && 'past',
                reserved && 'reserved',
                selectedSingle && 'single',
                rangeStart && 'range-start',
                rangeEnd && 'range-end',
                inRange && !rangeStart && !rangeEnd && 'in-range'
              ].filter(Boolean).join(' ');

              return (
                <div
                  key={idx}
                  className={classNames}
                  onClick={() => handleSelectDay(day)}
                  title={reserved ? 'Fecha ocupada' : formatDate(day)}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
          <div className="legend">
            <div className="legend-item"><span className="swatch" style={{ background: '#f1f5f9' }} /> Libre</div>
            <div className="legend-item"><span className="swatch" style={{ background: 'repeating-linear-gradient(45deg,#ef4444,#ef4444 6px,#dc2626 6px,#dc2626 12px)' }} /> Ocupado</div>
            <div className="legend-item"><span className="swatch" style={{ background: 'linear-gradient(135deg,#2563eb,#1d4ed8)' }} /> Selección</div>
          </div>
        </div>

        <div className="panel-form fade-in">
          <h2 style={{ margin: '0 0 .8rem', fontSize: '1rem', fontWeight: 600 }}>Detalles de la solicitud</h2>
          <div className="summary">
            <div><strong>Departamento:</strong> {departamentos.find(d => d.id === selectedDepto)?.nombre}</div>
            <div><strong>Entrada:</strong> {formatDate(startDate)}</div>
            <div><strong>Salida:</strong> {formatDate(endDate)}</div>
            {startDate && endDate && (
              <div><strong>Noches:</strong> {
                (() => {
                  if (!startDate || !endDate) return 0;
                  const diff = Math.round((startOfDay(endDate).getTime() - startOfDay(startDate).getTime()) / 86400000) + 1;
                  return diff;
                })()
              }</div>
            )}
          </div>

            <div className="form-group">
              <label htmlFor="nombre">Nombre y Apellido</label>
              <input id="nombre" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} placeholder="Juan Pérez" />
            </div>
            <div className="form-group">
              <label htmlFor="tel">Teléfono</label>
              <input id="tel" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="11 2345 6789" />
            </div>

            <div className="actions">
              <button className="btn btn-outline" type="button" onClick={clearSelection}>Limpiar</button>
              <button className="btn btn-primary" type="button" disabled={!canSubmit || creating} onClick={handleCreate}>
                {creating ? 'Enviando solicitud...' : 'Enviar Solicitud'}
              </button>
            </div>

            {loading && <div className="status">Cargando reservas...</div>}
            {error && <div className="status error">{error}</div>}
            {successMsg && <div className="status success">{successMsg}</div>}
        </div>
      </div>
    </div>
  );
};

export default Reservas;