import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdViewMonth } from 'react-icons/md';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';



const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  background: ${({ theme }) => theme.colors.background};
`;

/* ----- Header (Controles y Vistas) ----- */
const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
`;

const ViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${({ theme, active }) => 
    active ? theme.colors.primary : 'transparent'};
  color: ${({ theme, active }) => 
    active ? 'white' : theme.colors.text};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme, active }) => 
      !active && theme.colors.accent};
  }
`;

const NavControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.accent};
  }
`;

/* ----- Cuerpo del Calendario ----- */
const CalendarGrid = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
`;

// Ejemplo de integración con FullCalendar (personalizado)
const StyledCalendar = styled.div`
  .fc { /* FullCalendar container */
    height: 100%;
    font-family: ${({ theme }) => theme.fonts.body};
  }
  .fc-event {
    background: ${({ theme }) => theme.colors.primary};
    border: none;
    border-radius: 6px;
  }
  .fc-daygrid-day {
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

export default function Calendar() {
  const [currentView, setCurrentView] = useState('dayGridMonth');

  return (
    <CalendarContainer>
      {/* Header: Controles de navegación */}
      <CalendarHeader>
        <NavControls>
          <button css={css`background: none; border: none; font-size: 1.5rem;`}>
            <MdChevronLeft />
          </button>
          <h3 css={css`margin: 0 1rem;`}>Octubre 2023</h3>
          <button css={css`background: none; border: none; font-size: 1.5rem;`}>
            <MdChevronRight />
          </button>
          <TodayButton>
            <MdToday /> Hoy
          </TodayButton>
        </NavControls>

        {/* Selector de vista */}
        <ViewControls>
          <ViewButton active={currentView === 'timeGridDay'}>
            <MdViewDay /> Día
          </ViewButton>
          <ViewButton active={currentView === 'timeGridWeek'}>
            <MdViewWeek /> Semana
          </ViewButton>
          <ViewButton active={currentView === 'dayGridMonth'}>
            <MdViewMonth /> Mes
          </ViewButton>
        </ViewControls>
      </CalendarHeader>

      {/* Cuerpo del calendario */}
      <CalendarGrid>
        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={currentView}
            headerToolbar={false} // Ocultamos la toolbar nativa (usamos la nuestra)
            height="100%"
            events={[
                { title: 'Reunión', start: '2023-10-10T10:30:00', end: '2023-10-10T11:30:00' }
            ]}
        />
      </CalendarGrid>
    </CalendarContainer>
  );
}