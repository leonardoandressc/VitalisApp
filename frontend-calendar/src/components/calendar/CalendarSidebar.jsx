import { useState } from 'react';
import styled from '@emotion/styled';
import dayjs from 'dayjs';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd } from 'react-icons/md';
// Cambiamos MdViewMonth por MdDateRange que sí existeimport { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd } from 'react-icons/md';

const SidebarContainer = styled.div`
  width: 280px;
  border-left: 1px solid #e5e7eb;
  padding: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
`;

const MiniCalendar = styled.div`
  margin-bottom: 2rem;
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
  }
  
  .days {
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
    }
  }
`;

const SelectorSection = styled.div`
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

const SelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
`;

const SelectorTitle = styled.h3`
  margin: 0;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export default function CalendarSidebar({ currentDate, onDateChange }) {
  const [currentMonth] = useState(dayjs());
  const [selectedType, setSelectedType] = useState('calendars');
  
  const renderMiniCalendar = () => {
    const startOfMonth = dayjs(currentMonth).startOf('month');
    const daysInMonth = dayjs(currentMonth).daysInMonth();
    const startDay = startOfMonth.day();
    
    const days = [];
    
    // Días de la semana
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayNames.forEach(name => {
      days.push(<div key={`name-${name}`} className="day-name">{name}</div>);
    });
    
    // Espacios vacíos al inicio
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="day"></div>);
    }
    
    // Días del mes
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = dayjs(currentMonth).date(i);
      const isCurrent = dayjs(currentDate).isSame(dayDate, 'day');
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`day ${isCurrent ? 'current' : ''}`}
          onClick={() => onDateChange(dayDate.toDate())}
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
        <div className="header">
          <h3>{dayjs(currentMonth).format('MMMM YYYY')}</h3>
        </div>
        <div className="days">
          {renderMiniCalendar()}
        </div>
      </MiniCalendar>
      
      <SelectorSection>
        <SelectorHeader onClick={() => setSelectedType('calendars')}>
          <SelectorTitle>
            <MdCalendarToday size={16} />
            Calendarios
          </SelectorTitle>
          <MdExpandMore size={16} />
        </SelectorHeader>
        
        {/* Aquí iría la lista de calendarios */}
      </SelectorSection>
      
      <SelectorSection>
        <SelectorHeader onClick={() => setSelectedType('users')}>
          <SelectorTitle>
            <MdPeople size={16} />
            Usuarios
          </SelectorTitle>
          <MdExpandMore size={16} />
        </SelectorHeader>
        
        {/* Aquí iría la lista de usuarios */}
      </SelectorSection>
    </SidebarContainer>
  );
}