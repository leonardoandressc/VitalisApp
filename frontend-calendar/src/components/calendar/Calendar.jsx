/** @jsxImportSource @emotion/react */
import { useState, useCallback, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import CalendarToolbar from './CalendarToolbar';
import CalendarSidebar from './CalendarSidebar';
import { useTheme } from '@emotion/react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MdAdd } from 'react-icons/md';
import AppointmentModal from './AppointmentModal';
import FloatingActionButton from '../ui/FloatingActionButton';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const HeaderWrapper = styled.header`
  width: 100%;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  z-index: 10;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CalendarWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  overflow: auto;
  
  /* Ocultar scrollbars pero mantener funcionalidad */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome/Safari/Opera */
  }
  
  /* Asegurar que el calendario se ajuste al contenedor */
  .fc-view-harness {
    height: 100% !important;
  }
  
  /* Estilos personalizados para FullCalendar */
  .fc-theme-standard .fc-scrollgrid {
    border-color: ${({ theme }) => theme.colors.border};
  }
  
  .fc-theme-standard td, .fc-theme-standard th {
    border-color: ${({ theme }) => theme.colors.border};
  }
  
  .fc-timegrid-slot-minor {
    border-top-style: dotted;
  }
  
  .fc-timegrid-now-indicator-line {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .fc-timegrid-now-indicator-arrow {
    border-color: ${({ theme }) => theme.colors.primary};
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
  
  .fc-col-header-cell {
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    padding: 0.75rem 0;
  }
  
  .fc-day-today {
    background-color: ${({ theme }) => theme.colors.lightHover} !important;
  }
`;

// Usando el componente importado FloatingActionButton en lugar de redefinirlo
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const calendarRef = useRef(null);
  const lastHandledDate = useRef(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Eventos de ejemplo
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Consulta - Juan Pérez',
      start: new Date(new Date().setHours(10, 0, 0)),
      end: new Date(new Date().setHours(10, 30, 0)),
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      extendedProps: {
        patient: 'Juan Pérez',
        status: 'confirmed',
        type: 'consultation'
      }
    },
    {
      id: '2',
      title: 'Revisión - María López',
      start: new Date(new Date().setHours(14, 0, 0)),
      end: new Date(new Date().setHours(14, 45, 0)),
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
      extendedProps: {
        patient: 'María López',
        status: 'confirmed',
        type: 'checkup'
      }
    },
    {
      id: '3',
      title: 'Tratamiento - Carlos Ruiz',
      start: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(11, 0, 0),
      end: new Date(new Date().setDate(new Date().getDate() + 1)).setHours(12, 0, 0),
      backgroundColor: theme.colors.info,
      borderColor: theme.colors.info,
      extendedProps: {
        patient: 'Carlos Ruiz',
        status: 'pending',
        type: 'treatment'
      }
    }
  ]);

  // Ajustar sidebar según el tamaño de pantalla
  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const calendarStyles = {
    '.fc': {
      fontFamily: theme.fonts.body,
      fontSize: '14px',
      color: theme.colors.text,
      '.fc-scroller': {
        overflow: 'hidden !important',
      },
      '.fc-scroller-liquid-absolute': {
        overflow: 'hidden !important',
      },
      '.fc-view-harness': {
        overflow: 'hidden !important',
      },
    },
    '.fc-timegrid-slot-label, .fc-col-header-cell': {
      backgroundColor: theme.colors.backgroundAlt,
      color: theme.colors.textSecondary,
      fontWeight: 500,
    },
    '.fc-scrollgrid': {
      borderColor: theme.colors.border,
    },
    '.fc-daygrid-day-number': {
      color: theme.colors.primary,
    },
    '.fc-timegrid-slot': {
      backgroundColor: theme.colors.surface,
    },
    '.fc-event': {
      backgroundColor: theme.colors.secondary,
      border: 'none',
      borderRadius: '6px',
      padding: '4px 6px',
      color: '#fff',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'transform 0.1s ease',
      '&:hover': {
        transform: 'scale(1.02)',
      }
    },
    '.fc-timegrid-now-indicator-arrow': {
      borderColor: theme.colors.primary,
    },
    '.fc-timegrid-now-indicator-line': {
      backgroundColor: theme.colors.primary,
    },
  };

    // Función para cambiar fecha
  const handleDateChange = useCallback((newDate) => {
    const date = new Date(newDate);
    if (date.getTime() !== lastHandledDate.current.getTime()) {
      lastHandledDate.current = date;
      setCurrentDate(date);
      if (calendarRef.current) {
        const api = calendarRef.current.getApi();
        if (!api.currentStart || new Date(api.currentStart).getTime() !== date.getTime()) {
          api.gotoDate(date);
        }
      }
    }
  }, []);

  // Función para cambiar vista
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  }, []);

  // Navegación entre fechas
  const navigate = useCallback((amount) => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api[amount > 0 ? 'next' : 'prev']();
    handleDateChange(api.getDate());
  }, [handleDateChange]);

  // Manejar el botón "Hoy"
  const handleToday = useCallback(() => {
    handleDateChange(new Date());
  }, [handleDateChange]);

  // Manejar el evento de cambio de fechas
  const handleDatesSet = useCallback(({ view }) => {
    const newDate = view.currentStart;
    if (newDate.getTime() !== lastHandledDate.current.getTime()) {
      lastHandledDate.current = newDate;
      setCurrentDate(newDate);
    }
  }, []);
  
  // Manejar clic en evento
  const handleEventClick = useCallback((info) => {
    // Abrir modal con la información del evento seleccionado
    setSelectedSlot({
      start: info.event.start,
      end: info.event.end,
      event: info.event
    });
    setShowAppointmentModal(true);
  }, []);
  
  // Manejar selección de slot
  const handleDateSelect = useCallback((info) => {
    setSelectedSlot({
      start: info.start,
      end: info.end
    });
    setShowAppointmentModal(true);
  }, []);
  
  // Cerrar modal
  const handleCloseModal = useCallback(() => {
    setShowAppointmentModal(false);
    setSelectedSlot(null);
  }, []);
  
  // Guardar cita
  const handleSaveAppointment = useCallback((appointmentData) => {
    // Si es una edición, actualizar el evento existente
    if (selectedSlot && selectedSlot.event) {
      const updatedEvents = events.map(event => {
        if (event.id === selectedSlot.event.id) {
          return {
            ...event,
            ...appointmentData
          };
        }
        return event;
      });
      setEvents(updatedEvents);
    } else {
      // Si es una nueva cita, agregar a la lista de eventos
      const newEvent = {
        id: String(Date.now()),
        ...appointmentData
      };
      setEvents([...events, newEvent]);
    }
    
    handleCloseModal();
  }, [events, selectedSlot]);
  
  // Alternar sidebar en móvil
  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  return (
    <CalendarContainer>
      <HeaderWrapper>
        <CalendarToolbar
          currentDate={currentDate}
          onPrev={() => navigate(-1)}
          onNext={() => navigate(1)}
          onToday={handleToday}
          currentView={currentView}
          onViewChange={handleViewChange}
          onNewAppointment={() => {
            setSelectedSlot({
              start: new Date(),
              end: new Date(new Date().setHours(new Date().getHours() + 1))
            });
            setShowAppointmentModal(true);
          }}
          toggleSidebar={toggleSidebar}
          showSidebar={showSidebar}
        />
      </HeaderWrapper>

      <ContentWrapper>
        <MainContent>
          <CalendarWrapper>
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
              initialView={currentView}
              headerToolbar={false}
              contentHeight="auto"
              nowIndicator={true}
              initialDate={currentDate}
              datesSet={handleDatesSet}
              locales={[esLocale]}
              locale="es"
              firstDay={1}
              dayMaxEvents={true}
              slotMinTime="07:00:00"
              slotMaxTime="22:00:00"
              slotDuration="00:30:00"
              expandRows={true}
              selectable={true}
              selectMirror={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              events={events}
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              }}
              dayHeaderFormat={{
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              }}
              dayHeaderClassNames="custom-day-header"
              slotLabelClassNames="custom-slot-label"
              viewClassNames="custom-calendar-view"
              dayCellClassNames="custom-day-cell"
              height="100%"
              {...calendarStyles}
            />
          </CalendarWrapper>
        </MainContent>

        {showSidebar && (
          <CalendarSidebar 
            currentDate={currentDate} 
            onDateChange={(date) => {
              handleDateChange(date);
              handleViewChange('timeGridDay');
            }} 
          />
        )}
      </ContentWrapper>
      
      {/* Botón flotante para agregar cita (solo en móvil) */}
      <FloatingActionButton 
        onClick={() => {
          setSelectedSlot({
            start: new Date(),
            end: new Date(new Date().setHours(new Date().getHours() + 1))
          });
          setShowAppointmentModal(true);
        }}
        aria-label="Nueva cita"
      >
        <MdAdd />
      </FloatingActionButton>
      
      {/* Modal para agendar/editar cita */}
      {showAppointmentModal && (
        <AppointmentModal 
          isOpen={showAppointmentModal}
          onClose={handleCloseModal}
          onSave={handleSaveAppointment}
          selectedSlot={selectedSlot}
        />
      )}
    </CalendarContainer>
  );
}
