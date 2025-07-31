/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek } from 'react-icons/md';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';
import esLocale from '@fullcalendar/core/locales/es';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const CalendarHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(${({ theme }) => theme.colors.cardBackgroundRGB}, 0.8);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background: rgba(${({ theme }) => theme.colors.primaryRGB}, 0.1);
  }
`;

const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
`;

const DateTitle = styled.h2`
  margin: 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
  background: rgba(${({ theme }) => theme.colors.borderRGB}, 0.3);
  border-radius: 20px;
  padding: 0.25rem;
`;

const ViewButton = styled.button`
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 16px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  background: ${({ active, theme }) => 
    active === "true" ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active === "true" ? 'white' : theme.colors.text};
  
  svg {
    margin-right: 0.25rem;
  }
`;

const CalendarGrid = styled.div`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
`;

export default function AppleStyleCalendar() {
  const theme = useTheme();
  const calendarRef = useRef(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState([
    {
      title: 'Reunión importante',
      start: new Date(new Date().setHours(10, 0, 0)),
      end: new Date(new Date().setHours(11, 30, 0)),
      color: '#FF2D55'
    },
    {
      title: 'Almuerzo con equipo',
      start: new Date(new Date().setHours(13, 0, 0)),
      end: new Date(new Date().setHours(14, 0, 0)),
      color: '#5856D6'
    }
  ]);

  // Formatear fecha para el título
  const formatDateTitle = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  // Actualizar el calendario cuando cambia la vista o fecha
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(currentView);
      calendarApi.gotoDate(currentDate);
    }
  }, [currentView, currentDate]);

  // Navegación
  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setCurrentDate(calendarApi.getDate());
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setCurrentDate(calendarApi.getDate());
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setCurrentDate(new Date());
  };

  // Manejar cambio de vista
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <CalendarContainer>
      <CalendarHeader>
        <NavControls>
          <NavButton onClick={handlePrev}>
            <MdChevronLeft size={20} />
          </NavButton>
          <NavButton onClick={handleNext}>
            <MdChevronRight size={20} />
          </NavButton>
          <TodayButton onClick={handleToday}>
            <MdToday size={16} />
            Hoy
          </TodayButton>
          <DateTitle>{formatDateTitle(currentDate)}</DateTitle>
        </NavControls>

        <ViewControls>
          <ViewButton 
            active={currentView === 'timeGridDay' ? "true" : undefined}
            onClick={() => handleViewChange('timeGridDay')}
          >
            <MdViewDay size={16} />
            Día
          </ViewButton>
          <ViewButton 
            active={currentView === 'timeGridWeek' ? "true" : undefined}
            onClick={() => handleViewChange('timeGridWeek')}
          >
            <MdViewWeek size={16} />
            Semana
          </ViewButton>
        </ViewControls>
      </CalendarHeader>

      <CalendarGrid>
        <FullCalendar
          ref={calendarRef}
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          height="100%"
          nowIndicator={true}
          initialDate={currentDate}
          events={events}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          locales={[esLocale]}
          locale="es"
          firstDay={1}
          eventClick={(info) => {
            console.log('Evento clickeado:', info.event.title);
          }}
        />
      </CalendarGrid>
    </CalendarContainer>
  );
}