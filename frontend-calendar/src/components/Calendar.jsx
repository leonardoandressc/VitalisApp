/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek} from 'react-icons/md';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useTheme } from '@emotion/react';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
`;

// ... (Todos los demás estilos del calendario que ya tenías)

export default function Calendar() {
  const theme = useTheme();
  const [currentView, setCurrentView] = useState('dayGridMonth');

  return (
    <CalendarContainer>
      {/* Header con controles */}
      <CalendarHeader>
        {/* Controles de navegación */}
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
          <ViewButton 
            active={currentView === 'timeGridDay'}
            onClick={() => setCurrentView('timeGridDay')}
          >
            <MdViewDay /> Día
          </ViewButton>
          <ViewButton 
            active={currentView === 'timeGridWeek'}
            onClick={() => setCurrentView('timeGridWeek')}
          >
            <MdViewWeek /> Semana
          </ViewButton>
          <ViewButton 
            active={currentView === 'dayGridMonth'}
            onClick={() => setCurrentView('dayGridMonth')}
          >
            <MdViewMonth /> Mes
          </ViewButton>
        </ViewControls>
      </CalendarHeader>

      {/* Cuerpo del calendario */}
      <CalendarGrid>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={currentView}
          headerToolbar={false}
          height="100%"
          events={[
            { title: 'Reunión', start: '2023-10-10T10:30:00', end: '2023-10-10T11:30:00' }
          ]}
        />
      </CalendarGrid>
    </CalendarContainer>
  );
}