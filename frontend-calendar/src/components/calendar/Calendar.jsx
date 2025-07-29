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
  flex-direction: column; /* Cambiamos a columna para estructura vertical */
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
  overflow: auto;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 10; /* Aseguramos que esté sobre otros elementos */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
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

  const navigate = useCallback((amount) => {
    if (!calendarRef.current) return;
    
    const api = calendarRef.current.getApi();
    
    if (view === 'timeGridDay') {
      api.prev(); // o api.next() según la dirección
    } else if (view === 'timeGridWeek') {
      api.prev(); // o api.next()
    } else if (view === 'dayGridMonth') {
      api.prev(); // o api.next()
    }
  }, [view]);

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

  return (
    <CalendarContainer>
      <HeaderWrapper>
        <CalendarToolbar
          currentDate={currentDate}
          onPrev={handlePrev}
          onNext={handleNext}
          onToday={handleToday}
          view={view}
          onViewChange={handleViewChange}
        />
      </HeaderWrapper>

      <ContentWrapper>
        <MainContent>
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
            />
          </CalendarWrapper>
        </MainContent>

        <CalendarSidebar 
          currentDate={currentDate} 
          onDateChange={handleDateChange} 
        />
      </ContentWrapper>
    </CalendarContainer>
  );
}