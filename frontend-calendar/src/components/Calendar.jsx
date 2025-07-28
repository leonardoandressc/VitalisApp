/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdMoreVert } from 'react-icons/md';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@emotion/react';
import { useState, useEffect } from 'react';

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Estilos modernos estilo Apple
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
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 0.3s ease-out;
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
  transition: all 0.2s;
  color: ${({ theme }) => theme.colors.text};
  
  &:hover {
    background: rgba(${({ theme }) => theme.colors.primaryRGB}, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const TodayButton = styled(NavButton)`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  width: auto;
  
  svg {
    margin-right: 0.25rem;
  }
`;

const DateTitle = styled.h2`
  margin: 0;
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
  transition: all 0.2s;
  background: ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.text};
  
  &:hover {
    background: ${({ active, theme }) => 
      !active && `rgba(${theme.colors.primaryRGB}, 0.1)`};
  }
  
  svg {
    margin-right: 0.25rem;
  }
`;

const CalendarGrid = styled.div`
  flex: 1;
  padding: 1rem;
  overflow: hidden;
`;

const EventDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 4px;
`;

export default function AppleStyleCalendar() {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    {
      title: 'Reunión de equipo',
      start: new Date(new Date().setHours(10, 0, 0)),
      end: new Date(new Date().setHours(11, 30, 0)),
      color: '#FF2D55',
      extendedProps: {
        description: 'Revisión del sprint actual'
      }
    },
    {
      title: 'Almuerzo con cliente',
      start: new Date(new Date().setHours(13, 0, 0)),
      end: new Date(new Date().setHours(14, 30, 0)),
      color: '#5856D6',
    }
  ]);

  // Formatear fecha para el título
  const formatDateTitle = (date) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  // Navegación
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'timeGridDay') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'timeGridDay') {
      newDate.setDate(newDate.getDate() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Render personalizado para eventos
  const renderEventContent = (eventInfo) => (
    <div css={css`
      display: flex;
      align-items: center;
      padding: 2px 4px;
      font-size: 0.8rem;
      font-weight: 500;
    `}>
      <EventDot color={eventInfo.event.backgroundColor} />
      <span>{eventInfo.event.title}</span>
    </div>
  );

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
            active={currentView === 'timeGridDay'}
            onClick={() => setCurrentView('timeGridDay')}
          >
            <MdViewDay size={16} />
            Día
          </ViewButton>
          <ViewButton 
            active={currentView === 'timeGridWeek'}
            onClick={() => setCurrentView('timeGridWeek')}
          >
            <MdViewWeek size={16} />
            Semana
          </ViewButton>
        </ViewControls>
      </CalendarHeader>

      <CalendarGrid>
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          height="100%"
          nowIndicator={true}
          initialDate={currentDate}
          events={events}
          eventContent={renderEventContent}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          windowResizeDelay={0}
          stickyHeaderDates={true}
          eventClick={(info) => {
            console.log('Event clicked:', info.event.title);
          }}
          dateClick={(info) => {
            console.log('Date clicked:', info.dateStr);
          }}
          locale="es"
          firstDay={1} // Lunes como primer día de la semana
        />
      </CalendarGrid>
    </CalendarContainer>
  );
}