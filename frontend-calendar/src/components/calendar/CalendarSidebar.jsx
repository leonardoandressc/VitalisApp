import { useState } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { MdCalendarToday, MdPeople, MdChevronLeft, MdChevronRight } from 'react-icons/md';

const SidebarContainer = styled.div`
  width: 280px;
  border-left: 1px solid #e5e7eb;
  padding: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    flex-grow: 1;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 4px;
    
    &:hover {
      background: #f3f4f6;
    }
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 1.5rem;
`;

const DayName = styled.div`
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
  padding: 0.25rem;
`;

const Day = styled.div`
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background: #f3f4f6;
  }
  
  ${({ $isCurrent }) => $isCurrent && `
    background: #3b82f6;
    color: white;
  `}
  
  ${({ $isOtherMonth }) => $isOtherMonth && `
    color: #d1d5db;
  `}
  
  ${({ $isToday }) => $isToday && `
    font-weight: bold;
    color: #3b82f6;
  `}
`;

const SelectorSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

export default function CalendarSidebar({ currentDate, onDateChange }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  
  const navigateMonth = (amount) => {
    setCurrentMonth(prev => prev.add(amount, 'month'));
  };

  const renderCalendar = () => {
    const startOfMonth = currentMonth.startOf('month');
    const startDay = startOfMonth.day();
    const daysInMonth = currentMonth.daysInMonth();
    const today = dayjs();
    
    // Días de la semana
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Calcular días a mostrar
    const days = [];
    const totalDays = 42; // 6 semanas
    
    for (let i = 0; i < totalDays; i++) {
      const dayOffset = i - startDay;
      const date = currentMonth.startOf('month').add(dayOffset, 'day');
      const isCurrentMonth = date.month() === currentMonth.month();
      const isCurrent = dayjs(currentDate).isSame(date, 'day');
      const isToday = date.isSame(today, 'day');
      
      days.push(
        <Day
          key={i}
          $isCurrent={isCurrent}
          $isOtherMonth={!isCurrentMonth}
          $isToday={isToday && isCurrentMonth}
          onClick={() => {
            onDateChange(date.toDate());
            if (!isCurrentMonth) {
              setCurrentMonth(date);
            }
          }}
        >
          {date.date()}
        </Day>
      );
    }
    
    return (
      <>
        <CalendarHeader>
          <button onClick={() => navigateMonth(-1)}>
            <MdChevronLeft size={16} />
          </button>
          <h3>{currentMonth.format('MMMM YYYY')}</h3>
          <button onClick={() => navigateMonth(1)}>
            <MdChevronRight size={16} />
          </button>
        </CalendarHeader>
        
        <DaysGrid>
          {dayNames.map(name => (
            <DayName key={name}>{name}</DayName>
          ))}
          {days}
        </DaysGrid>
      </>
    );
  };
  
  return (
    <SidebarContainer>
      {renderCalendar()}
      
      <SelectorSection>
        {/* Aquí irían los selectores de calendarios/usuarios */}
      </SelectorSection>
    </SidebarContainer>
  );
}