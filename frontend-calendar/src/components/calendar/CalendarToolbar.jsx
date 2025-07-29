/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd } from 'react-icons/md';
import dayjs from 'dayjs';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  max-width: 100%;
  margin: 0 auto;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
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
  view, 
  onViewChange 
}) {
  return (
    <ToolbarContainer>
      <NavSection>
        <button 
          css={css`
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            &:hover {
              background: #f3f4f6;
            }
          `}
          onClick={onPrev}
        >
          <MdChevronLeft size={20} />
        </button>
        
        <button 
          css={css`
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 4px;
            &:hover {
              background: #f3f4f6;
            }
          `}
          onClick={onNext}
        >
          <MdChevronRight size={20} />
        </button>
        
        <button 
          css={css`
            background: none;
            border: 1px solid #e5e7eb;
            cursor: pointer;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 0.25rem;
            font-weight: 500;
            &:hover {
              background: #f3f4f6;
            }
          `}
          onClick={onToday}
        >
          <MdToday size={16} />
          Hoy
        </button>
        
        <DateTitle>
          {dayjs(currentDate).format('MMMM D, YYYY')}
        </DateTitle>
      </NavSection>
      
      <NavSection>
        <ViewControls>
          <ViewButton 
            active={view === 'day'}
            onClick={() => onViewChange('day')}
          >
            <MdViewDay size={16} />
            Día
          </ViewButton>
          <ViewButton 
            active={view === 'week'}
            onClick={() => onViewChange('week')}
          >
            <MdViewWeek size={16} />
            Semana
          </ViewButton>
          <ViewButton 
            active={view === 'month'}
            onClick={() => onViewChange('month')}
          >
            <MdDateRange size={16} /> {/* Cambiado a MdDateRange */}
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