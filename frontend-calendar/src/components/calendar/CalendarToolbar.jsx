/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { MdChevronLeft, MdChevronRight, MdToday, MdViewDay, MdViewWeek, MdDateRange, MdAdd, MdMenu } from 'react-icons/md';
import dayjs from 'dayjs';
import { IconButton } from '../ui/IconButton';
import { Button } from '../ui/Button';
import { ViewButton } from '../ui/ViewButton';
import { useMediaQuery } from '../../hooks/useMediaQuery';

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
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const DateTitle = styled.h2`
  margin-left: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-left: 0.25rem;
  }
  
  @media (max-width: 480px) {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ViewControls = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const MobileViewControls = styled.div`
  display: none;
  
  @media (max-width: 480px) {
    display: block;
  }
`;

export default function CalendarToolbar({ 
  currentDate, 
  onPrev, 
  onNext, 
  onToday, 
  currentView,
  onViewChange,
  onNewAppointment,
  toggleSidebar,
  showSidebar
}) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
  return (
    <ToolbarContainer>
      <NavSection>
        {isMobile && (
          <IconButton 
            onClick={toggleSidebar} 
            icon={<MdMenu size={20} />} 
            aria-label={showSidebar ? "Ocultar calendario" : "Mostrar calendario"}
          />
        )}
        <IconButton onClick={onPrev} icon={<MdChevronLeft size={20} />} aria-label="Anterior" />
        <IconButton onClick={onNext} icon={<MdChevronRight size={20} />} aria-label="Siguiente" />
        {!isSmallMobile && (
          <Button onClick={onToday} icon={<MdToday size={16} />}>Hoy</Button>
        )}
        {isSmallMobile && (
          <IconButton onClick={onToday} icon={<MdToday size={20} />} aria-label="Hoy" />
        )}
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
        
        <MobileViewControls>
          <IconButton 
            onClick={() => onViewChange(currentView === 'timeGridDay' ? 'timeGridWeek' : 'timeGridDay')} 
            icon={currentView === 'timeGridDay' ? <MdViewWeek size={20} /> : <MdViewDay size={20} />} 
            aria-label="Cambiar vista"
          />
        </MobileViewControls>

        {!isSmallMobile && (
          <Button onClick={onNewAppointment} icon={<MdAdd size={16} />}>Nueva cita</Button>
        )}
        {isSmallMobile && (
          <IconButton onClick={onNewAppointment} icon={<MdAdd size={20} />} aria-label="Nueva cita" />
        )}
      </NavSection>
    </ToolbarContainer>
  );
}
