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
  const ignoreDateChange = useRef(false);

  const changeDate = useCallback((amount, unit) => {
    ignoreDateChange.current = true;
    const newDate = new Date(currentDate);
    
    if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
    else if (unit === 'week') newDate.setDate(newDate.getDate() + (amount * 7));
    else if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);

    setCurrentDate(newDate);
    
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(newDate);
    }
    
    ignoreDateChange.current = false;
  }, [currentDate]);

  const handlePrev = useCallback(() => changeDate(-1, view), [view, changeDate]);
  const handleNext = useCallback(() => changeDate(1, view), [view, changeDate]);

  const handleToday = useCallback(() => {
    ignoreDateChange.current = true;
    const today = new Date();
    setCurrentDate(today);
    if (calendarRef.current) {
      calendarRef.current.getApi().today();
    }
    ignoreDateChange.current = false;
  }, []);

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
        changeDate(-1, 'week');
      } else if (view === 'day' && e.key === 'ArrowDown') {
        e.preventDefault();
        changeDate(1, 'week');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, handlePrev, handleNext, changeDate]);

  const handleViewChange = (newView) => setView(newView);
  
  const handleDateChange = (date) => {
    ignoreDateChange.current = true;
    setCurrentDate(date);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(date);
    }
    ignoreDateChange.current = false;
  };

  const handleDatesSet = useCallback((dateInfo) => {
    if (!ignoreDateChange.current) {
      setCurrentDate(dateInfo.view.currentStart);
    }
  }, []);

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
            datesSet={handleDatesSet}
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