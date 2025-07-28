import { useState, useEffect, useCallback, useRef } from 'react';
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

  // Función para manejar el cambio de fecha
  const changeDate = useCallback((amount, unit) => {
    const newDate = new Date(currentDate);
    
    switch(unit) {
      case 'day':
        newDate.setDate(newDate.getDate() + amount);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (amount * 7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + amount);
        break;
      default:
        break;
    }
    
    setCurrentDate(newDate);
    
    // Actualizar el calendario si existe
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(newDate);
    }
  }, [currentDate]);

  // Manejadores de navegación
  const handlePrev = useCallback(() => {
    changeDate(-1, view);
  }, [view, changeDate]);

  const handleNext = useCallback(() => {
    changeDate(1, view);
  }, [view, changeDate]);

  const handleToday = useCallback(() => {
    const today = new Date();
    setCurrentDate(today);
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
  }, []);

  // Efecto para manejar eventos del teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowUp':
          if (view === 'day') {
            e.preventDefault();
            changeDate(-1, 'week');
          }
          break;
        case 'ArrowDown':
          if (view === 'day') {
            e.preventDefault();
            changeDate(1, 'week');
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, handlePrev, handleNext, changeDate]);

  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  const handleDateChange = (date) => {
    setCurrentDate(date);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(date);
    }
  };
  
  const getCalendarView = () => {
    switch(view) {
      case 'day': return 'timeGridDay';
      case 'week': return 'timeGridWeek';
      case 'month': return 'dayGridMonth';
      default: return 'timeGridWeek';
    }
  };
  
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
            datesSet={(dateInfo) => {
              setCurrentDate(dateInfo.view.currentStart);
            }}
          />
        </CalendarWrapper>
      </MainContent>
      
      <CalendarSidebar 
        currentDate={currentDate} 
        onDateChange={handleDateChange} 
      />
    </CalendarContainer>
  );
}