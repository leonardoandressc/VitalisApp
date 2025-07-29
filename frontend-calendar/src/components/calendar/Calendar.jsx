import { useState, useCallback, useRef, useEffect } from 'react';
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
  height: 100vh;
  background: #f9fafb;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const CalendarWrapper = styled.div`
  flex: 1;
  padding: 1rem;
  background: white;
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const calendarRef = useRef(null);
  const updateSource = useRef('state'); // 'state' | 'calendar'
  
  // Función para cambiar fecha sincronizando ambos sistemas
  const syncDateChange = useCallback((newDate, source) => {
    updateSource.current = source;
    setCurrentDate(newDate);
    
    if (calendarRef.current && source === 'state') {
      const calendarApi = calendarRef.current.getApi();
      if (!calendarApi.currentStart || 
          new Date(calendarApi.currentStart).getTime() !== newDate.getTime()) {
        calendarApi.gotoDate(newDate);
      }
    }
  }, []);
  
  // Navegación
  const navigateDate = useCallback((amount, unit) => {
    const newDate = new Date(currentDate);
    
    if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
    else if (unit === 'week') newDate.setDate(newDate.getDate() + (amount * 7));
    else if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);

    syncDateChange(newDate, 'state');
  }, [currentDate, syncDateChange]);

  const handlePrev = useCallback(() => navigateDate(-1, view), [view, navigateDate]);
  const handleNext = useCallback(() => navigateDate(1, view), [view, navigateDate]);

  const handleToday = useCallback(() => {
    syncDateChange(new Date(), 'state');
  }, [syncDateChange]);

  // Manejo de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (view === 'day' && e.key === 'ArrowUp') {
        e.preventDefault();
        navigateDate(-1, 'week');
      } else if (view === 'day' && e.key === 'ArrowDown') {
        e.preventDefault();
        navigateDate(1, 'week');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handlePrev, handleNext, navigateDate]);

  // Handler para cambios de fecha desde el calendario
  const handleDatesSet = useCallback((dateInfo) => {
    if (updateSource.current === 'calendar') {
      const newDate = dateInfo.view.currentStart;
      if (newDate.getTime() !== currentDate.getTime()) {
        setCurrentDate(newDate);
      }
    }
    updateSource.current = 'calendar';
  }, [currentDate]);

  // Handler para cambios de vista
  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Mapeo de vistas
  const getCalendarView = () => {
    switch(view) {
      case 'day': return 'timeGridDay';
      case 'week': return 'timeGridWeek';
      case 'month': return 'dayGridMonth';
      default: return 'timeGridWeek';
    }
  };

  const handleDateChange = useCallback((newDate) => {
    setCurrentDate(newDate);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(newDate);
      if (view !== 'day') {
        setView('day');
      }
    }
  }, [view]);

  const handleViewChange = useCallback((newView) => {
    setView(newView);
  }, []);

  return (
    <CalendarContainer>
      <MainContent>
        <CalendarToolbar
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          view={view}
          onViewChange={handleViewChange}
        />
        
        <CalendarWrapper>
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView={getCalendarView()}
            headerToolbar={false}
            height="100%"
            nowIndicator={true}
            initialDate={currentDate}
            locales={[esLocale]}
            locale="es"
            firstDay={1}
            datesSet={handleDatesSet}
          />
        </CalendarWrapper>
      </MainContent>
      
      <CalendarSidebar 
        currentDate={currentDate} 
        onDateChange={(date) => syncDateChange(date, 'state')} 
      />
    </CalendarContainer>
  );
}