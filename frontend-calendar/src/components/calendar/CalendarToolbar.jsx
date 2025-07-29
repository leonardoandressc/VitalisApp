/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd } from 'react-icons/md';
import dayjs from 'dayjs';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DateTitle = styled.h2`
  margin-left: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ViewControls = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.light};
  border-radius: 8px;
  overflow: hidden;
`;

const ViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ active, theme }) => active ? theme.colors.primary : 'transparent'};
  color: ${({ active, theme }) => active ? '#fff' : theme.colors.textMuted};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: 0.2s ease;

  &:hover {
    background: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.lightHover};
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
        <IconButton onClick={onPrev} icon={<MdChevronLeft size={20} />} />
        <IconButton onClick={onNext} icon={<MdChevronRight size={20} />} />
        <Button onClick={onToday} icon={<MdToday size={16} />}>Hoy</Button>
        <DateTitle>{dayjs(currentDate).format('MMMM D, YYYY')}</DateTitle>
      </NavSection>

      <NavSection>
        <ViewControls>
          <ViewButton active={currentView === 'timeGridDay'} onClick={() => onViewChange('timeGridDay')}>
            <MdViewDay size={16} />
            Día
          </ViewButton>
          <ViewButton active={currentView === 'timeGridWeek'} onClick={() => onViewChange('timeGridWeek')}>
            <MdViewWeek size={16} />
            Semana
          </ViewButton>
          <ViewButton active={currentView === 'dayGridMonth'} onClick={() => onViewChange('dayGridMonth')}>
            <MdDateRange size={16} />
            Mes
          </ViewButton>
        </ViewControls>

        <Button icon={<MdAdd size={16} />}>Nueva cita</Button>
      </NavSection>
    </ToolbarContainer>
  );
}
