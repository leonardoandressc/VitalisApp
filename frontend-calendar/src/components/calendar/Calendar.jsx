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
`;

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const calendarRef = useRef(null);
  const lastHandledDate = useRef(new Date());
  const theme = useTheme();

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

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(view);
    }
  }, []);

  const navigate = useCallback((amount) => {
    if (!calendarRef.current) return;
    const api = calendarRef.current.getApi();
    api[amount > 0 ? 'next' : 'prev']();
    handleDateChange(api.getDate());
  }, [handleDateChange]);

  const handleToday = useCallback(() => {
    handleDateChange(new Date());
  }, [handleDateChange]);

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
            handleDateChange(date);
            handleViewChange('timeGridDay');
          }} 
        />
      </ContentWrapper>
    </CalendarContainer>
  );
}
