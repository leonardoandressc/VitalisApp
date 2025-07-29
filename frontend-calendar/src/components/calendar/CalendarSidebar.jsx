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

const MiniCalendarHeader = styled.div`
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
  
  .day-name {
    text-align: center;
    font-size: 0.75rem;
    color: #6b7280;
    padding: 0.25rem;
  }
  
  .day {
    text-align: center;
    padding: 0.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    
    &:hover {
      background: #f3f4f6;
    }
    
    &.current {
      background: #3b82f6;
      color: white;
    }
    
    &.other-month {
      color: #d1d5db;
    }
    
    &.today {
      font-weight: bold;
      color: #3b82f6;
      
      &.current {
        color: white;
      }
    }
  }
`;

// ... (otros componentes styled se mantienen igual)

export default function CalendarSidebar({ currentDate, onDateChange }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  
  const navigateMonth = (amount) => {
    setCurrentMonth(prev => prev.add(amount, 'month'));
  };

  const renderMiniCalendar = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const daysInMonth = currentMonth.daysInMonth();
    const startDay = startOfMonth.day();
    const today = dayjs();
    
    const days = [];
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Nombres de los días
    dayNames.forEach(name => {
      days.push(<div key={`name-${name}`} className="day-name">{name}</div>);
    });
    
    // Días del mes anterior
    const prevMonthDays = startOfMonth.day();
    const prevMonth = currentMonth.subtract(1, 'month');
    const daysInPrevMonth = prevMonth.daysInMonth();
    
    for (let i = 0; i < prevMonthDays; i++) {
      const day = daysInPrevMonth - prevMonthDays + i + 1;
      const date = prevMonth.date(day);
      
      days.push(
        <div 
          key={`prev-${day}`} 
          className="day other-month"
          onClick={() => {
            onDateChange(date.toDate());
            setCurrentMonth(date);
          }}
        >
          {day}
        </div>
      );
    }
    
    // Días del mes actual
    for (let i = 1; i <= daysInMonth; i++) {
      const date = currentMonth.date(i);
      const isCurrent = dayjs(currentDate).isSame(date, 'day');
      const isToday = date.isSame(today, 'day');
      
      days.push(
        <div 
          key={`current-${i}`} 
          className={`day ${isCurrent ? 'current' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => onDateChange(date.toDate())}
        >
          {i}
        </div>
      );
    }
    
    // Días del siguiente mes
    const nextMonthDays = 6 - endOfMonth.day();
    const nextMonth = currentMonth.add(1, 'month');
    
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push(
        <div 
          key={`next-${i}`} 
          className="day other-month"
          onClick={() => {
            onDateChange(nextMonth.date(i).toDate());
            setCurrentMonth(nextMonth);
          }}
        >
          {i}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <SidebarContainer>
      <MiniCalendar>
        <MiniCalendarHeader>
          <button onClick={() => navigateMonth(-1)}>
            <MdChevronLeft size={16} />
          </button>
          <h3>{currentMonth.format('MMMM YYYY')}</h3>
          <button onClick={() => navigateMonth(1)}>
            <MdChevronRight size={16} />
          </button>
        </MiniCalendarHeader>
        <DaysGrid>
          {renderMiniCalendar()}
        </DaysGrid>
      </MiniCalendar>
      
      {/* ... (resto del sidebar se mantiene igual) */}
    </SidebarContainer>
  );
}