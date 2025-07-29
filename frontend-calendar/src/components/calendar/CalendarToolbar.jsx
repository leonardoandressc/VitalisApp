import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd } from 'react-icons/md';
import dayjs from 'dayjs';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  width: 100%;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #111827;
  
  &:hover {
    background: #f3f4f6;
  }
`;

const TodayButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
`;

const DateTitle = styled.h2`
  margin: 0 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

const ViewControls = styled.div`
  display: flex;
  background: #f3f4f6;
  border-radius: 6px;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ active }) => active ? '#3b82f6' : 'transparent'};
  color: ${({ active }) => active ? 'white' : '#4b5563'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
`;

const AddButton = styled.button`
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

export default function CalendarToolbar({ 
  currentDate, 
  onPrev, 
  onNext, 
  onToday, 
  currentView,
  onViewChange 
}) {
  return (
    <ToolbarContainer>
      <NavSection>
        <NavButton onClick={onPrev}>
          <MdChevronLeft size={20} />
        </NavButton>
        
        <NavButton onClick={onNext}>
          <MdChevronRight size={20} />
        </NavButton>
        
        <TodayButton onClick={onToday}>
          <MdToday size={16} />
          Hoy
        </TodayButton>
        
        <DateTitle>
          {dayjs(currentDate).format('MMMM D, YYYY')}
        </DateTitle>
      </NavSection>
      
      <NavSection>
        <ViewControls>
          <ViewButton 
            active={currentView === 'timeGridDay'}
            onClick={() => onViewChange('timeGridDay')}
          >
            <MdViewDay size={16} />
            Día
          </ViewButton>
          <ViewButton 
            active={currentView === 'timeGridWeek'}
            onClick={() => onViewChange('timeGridWeek')}
          >
            <MdViewWeek size={16} />
            Semana
          </ViewButton>
          <ViewButton 
            active={currentView === 'dayGridMonth'}
            onClick={() => onViewChange('dayGridMonth')}
          >
            <MdDateRange size={16} />
            Mes
          </ViewButton>
        </ViewControls>
        
        <AddButton>
          <MdAdd size={16} />
          Nueva cita
        </AddButton>
      </NavSection>
    </ToolbarContainer>
  );
}