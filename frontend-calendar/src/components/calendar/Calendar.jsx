import { useState, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import CalendarToolbar from './CalendarToolbar';
import CalendarSidebar from './CalendarSidebar';

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f9fafb;
`;

const HeaderWrapper = styled.header`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e5e7eb;
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
  background: white;
  overflow: auto;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const calendarRef = useRef(null);
  const updateSource = useRef('state'); // 'state' | 'calendar'

  // Maneja cambios de fecha
  const handleDateChange = useCallback((date, source = 'state') => {
    updateSource.current = source;
    setCurrentDate(date);
    
    if (calendarRef.current && source === 'state') {
      const api = calendarRef.current.getApi();
      api.gotoDate(date);
    }
  }, []);

  // Maneja cambios de vista
  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  }, []);

  // Navegación
  const navigate = useCallback((amount) => {
    if (!calendarRef.current) return;
    
    const api = calendarRef.current.getApi();
    api[amount > 0 ? 'next' : 'prev']();
    handleDateChange(api.getDate(), 'state');
  }, [handleDateChange]);

  // Ir a la fecha actual
  const handleToday = useCallback(() => {
    handleDateChange(new Date(), 'state');
  }, [handleDateChange]);

  // Handler para cambios de fecha desde el calendario
  const handleDatesSet = useCallback(({ view }) => {
    if (updateSource.current === 'calendar') {
      const newDate = view.currentStart;
      setCurrentDate(newDate);
    }
    updateSource.current = 'calendar';
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
              height="100%"
              nowIndicator={true}
              initialDate={currentDate}
              datesSet={handleDatesSet}
              locales={[esLocale]}
              locale="es"
              firstDay={1}
            />
          </CalendarWrapper>
        </MainContent>

        <CalendarSidebar 
          currentDate={currentDate} 
          onDateChange={(date) => {
            handleDateChange(date, 'state');
            handleViewChange('timeGridDay');
          }} 
        />
      </ContentWrapper>
    </CalendarContainer>
  );
}