import { useState } from 'react';
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
  
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleViewChange = (newView) => {
    setView(newView);
  };
  
  const handleDateChange = (date) => {
    setCurrentDate(date);
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
    </CalendarContainer>
  );
}