/** @jsxImportSource @emotion/react */
import { useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import CalendarToolbar from './CalendarToolbar';
import CalendarSidebar from './CalendarSidebar';
import { useTheme } from '@emotion/react';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: ${({ theme }) => theme.colors.background};
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
`;
export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const calendarRef = useRef(null);
  const lastHandledDate = useRef(new Date());
  const theme = useTheme();

  const calendarStyles = {
  '.fc': {
    fontFamily: "'Roboto', sans-serif",
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
    backgroundColor: theme.colors.background,
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
    padding: '2px 4px',
    color: '#fff',
    fontSize: '12px',
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
              slotDuration="01:00:00"
              expandRows={true}
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

        <CalendarSidebar 
          currentDate={currentDate} 
          onDateChange={(date) => {
            handleDateChange(date);
            handleViewChange('timeGridDay');
          }} 
        />
      </ContentWrapper>
    </CalendarContainer>
  );
}
