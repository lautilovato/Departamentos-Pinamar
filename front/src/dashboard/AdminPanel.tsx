import React, { useState, useEffect, useMemo } from 'react';
import { apiService } from '../services/api';
import './AdminPanel.css';

interface Reserva {
  id: number;
  cliente: string;
  numeroTel: string;
  numeroDepartamento: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
}

interface ReservaParsed extends Omit<Reserva, 'fechaInicio' | 'fechaFin'> {
  fechaInicio: Date;
  fechaFin: Date;
}

const departamentos = [
  { id: 1, nombre: 'Departamento Atlántico', codigo: 'ATL001' },
  { id: 2, nombre: 'Departamento Medanos', codigo: 'MED002' },
];

// Utilidades del calendario
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

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

const AdminPanel: React.FC = () => {
  const [reservasPendientes, setReservasPendientes] = useState<Reserva[]>([]);
  const [reservasConfirmadas, setReservasConfirmadas] = useState<Reserva[]>([]);
  const [reservasRechazadas, setReservasRechazadas] = useState<Reserva[]>([]);
  const [todasReservas, setTodasReservas] = useState<ReservaParsed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados del calendario
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => new Date());
  const [selectedDepto, setSelectedDepto] = useState<number>(1);

  const cargarReservas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pendientes, confirmadas, rechazadas, todas] = await Promise.all([
        apiService.reservas.getByEstado('pendiente'),
        apiService.reservas.getByEstado('confirmada'),
        apiService.reservas.getByEstado('rechazada'),
        apiService.reservas.getAll()
      ]);

      setReservasPendientes(pendientes);
      setReservasConfirmadas(confirmadas);
      setReservasRechazadas(rechazadas);
      
      // Parsear todas las reservas para el calendario
      const reservasParsed: ReservaParsed[] = todas.map((r: Reserva) => ({
        ...r,
        fechaInicio: new Date(r.fechaInicio),
        fechaFin: new Date(r.fechaFin)
      }));
      setTodasReservas(reservasParsed);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  const confirmarReserva = async (id: number) => {
    try {
      await apiService.reservas.confirmar(id);
      await cargarReservas();
    } catch (error) {
      console.error('Error confirmando reserva:', error);
      setError('Error al confirmar la reserva');
    }
  };

  const rechazarReserva = async (id: number) => {
    try {
      await apiService.reservas.rechazar(id);
      await cargarReservas();
    } catch (error) {
      console.error('Error rechazando reserva:', error);
      setError('Error al rechazar la reserva');
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  // Lógica del calendario
  const reservasDepto = useMemo(() => {
    const codigoDepto = departamentos.find(d => d.id === selectedDepto)?.codigo;
    return todasReservas.filter(r => r.numeroDepartamento === codigoDepto && r.estado === 'confirmada');
  }, [todasReservas, selectedDepto]);

  const isDayReserved = (day: Date) => {
    return reservasDepto.some(r => {
      const inicio = startOfDay(r.fechaInicio);
      const fin = startOfDay(r.fechaFin);
      return day >= inicio && day < fin;
    });
  };

  const weeks = useMemo(() => generateMonthMatrix(visibleMonth), [visibleMonth]);

  const nextMonth = () => setVisibleMonth(m => addMonths(m, 1));
  const prevMonth = () => setVisibleMonth(m => addMonths(m, -1));

  if (loading) {
    return <div className="admin-panel-loading">Cargando...</div>;
  }

  return (
    <div className="admin-panel">
      <h1 className="admin-title">Panel de Administrador</h1>
      
      {error && <div className="error-message">{error}</div>}

      <div className="admin-content">
        {/* Sección del calendario */}
        <div className="calendar-section">
          <h2 className="calendar-title">Calendario de Ocupación</h2>
          
          <div className="dept-selector">
            {departamentos.map(d => (
              <button
                key={d.id}
                className={`dept-button ${selectedDepto === d.id ? 'active' : ''}`}
                onClick={() => setSelectedDepto(d.id)}
              >
                {d.nombre}
              </button>
            ))}
          </div>

          <div className="calendar">
            <div className="cal-header">
              <button className="nav-btn" onClick={prevMonth}>‹</button>
              <div className="month-label">
                {visibleMonth.toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
              </div>
              <button className="nav-btn" onClick={nextMonth}>›</button>
            </div>
            
            <div className="weekdays">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                <div key={d} className="weekday">{d}</div>
              ))}
            </div>
            
            <div className="calendar-grid">
              {weeks.flat().map((day, idx) => {
                if (!day) return <div key={idx} className="day blank" />;
                
                const today = startOfDay(new Date());
                const past = day < today;
                const reserved = !past && isDayReserved(day);
                
                const classNames = [
                  'day',
                  past && 'past',
                  reserved && 'reserved'
                ].filter(Boolean).join(' ');

                return (
                  <div
                    key={idx}
                    className={classNames}
                    title={reserved ? 'Fecha ocupada' : day.toLocaleDateString()}
                  >
                    {day.getDate()}
                  </div>
                );
              })}
            </div>

            <div className="legend">
              <div className="legend-item">
                <span className="swatch libre" />
                <span>Libre</span>
              </div>
              <div className="legend-item">
                <span className="swatch ocupado" />
                <span>Ocupado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de reservas */}
        <div className="reservas-management">
          {/* Reservas Pendientes */}
          <div className="reservas-section compact">
            <h3 className="section-title pendientes">
              Pendientes ({reservasPendientes.length})
            </h3>
            {reservasPendientes.length === 0 ? (
              <p className="no-reservas">No hay reservas pendientes</p>
            ) : (
              <div className="reservas-list">
                {reservasPendientes.map((reserva) => (
                  <div key={reserva.id} className="reserva-item pendiente">
                    <div className="reserva-info-compact">
                      <div className="cliente-info">
                        <strong>{reserva.cliente}</strong>
                        <span className="depto">Dto. {reserva.numeroDepartamento}</span>
                      </div>
                      <div className="fechas-info">
                        <span>{new Date(reserva.fechaInicio).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(reserva.fechaFin).toLocaleDateString()}</span>
                      </div>
                      <div className="tel-info">📞 {reserva.numeroTel}</div>
                    </div>
                    <div className="reserva-actions-compact">
                      <button
                        className="btn-confirmar-sm"
                        onClick={() => confirmarReserva(reserva.id)}
                        title="Confirmar"
                      >
                        ✓
                      </button>
                      <button
                        className="btn-rechazar-sm"
                        onClick={() => rechazarReserva(reserva.id)}
                        title="Rechazar"
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reservas Confirmadas */}
          <div className="reservas-section compact">
            <h3 className="section-title confirmadas">
              Confirmadas ({reservasConfirmadas.length})
            </h3>
            {reservasConfirmadas.length === 0 ? (
              <p className="no-reservas">No hay reservas confirmadas</p>
            ) : (
              <div className="reservas-list">
                {reservasConfirmadas.map((reserva) => (
                  <div key={reserva.id} className="reserva-item confirmada">
                    <div className="reserva-info-compact">
                      <div className="cliente-info">
                        <strong>{reserva.cliente}</strong>
                        <span className="depto">Dto. {reserva.numeroDepartamento}</span>
                      </div>
                      <div className="fechas-info">
                        <span>{new Date(reserva.fechaInicio).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(reserva.fechaFin).toLocaleDateString()}</span>
                      </div>
                      <div className="tel-info">📞 {reserva.numeroTel}</div>
                    </div>
                    <div className="estado-badge-sm confirmada">✓</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reservas Rechazadas */}
          <div className="reservas-section compact">
            <h3 className="section-title rechazadas">
              Rechazadas ({reservasRechazadas.length})
            </h3>
            {reservasRechazadas.length === 0 ? (
              <p className="no-reservas">No hay reservas rechazadas</p>
            ) : (
              <div className="reservas-list">
                {reservasRechazadas.map((reserva) => (
                  <div key={reserva.id} className="reserva-item rechazada">
                    <div className="reserva-info-compact">
                      <div className="cliente-info">
                        <strong>{reserva.cliente}</strong>
                        <span className="depto">Dto. {reserva.numeroDepartamento}</span>
                      </div>
                      <div className="fechas-info">
                        <span>{new Date(reserva.fechaInicio).toLocaleDateString()}</span>
                        <span>→</span>
                        <span>{new Date(reserva.fechaFin).toLocaleDateString()}</span>
                      </div>
                      <div className="tel-info">📞 {reserva.numeroTel}</div>
                    </div>
                    <div className="estado-badge-sm rechazada">✗</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;