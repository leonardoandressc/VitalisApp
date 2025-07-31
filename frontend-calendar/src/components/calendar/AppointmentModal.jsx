/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';
import { MdClose, MdLocationOn, MdVideocam, MdPhone, MdPerson, MdCalendarToday, MdAccessTime, MdCheck } from 'react-icons/md';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import dayjs from 'dayjs';

// Componentes estilizados para el modal
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.large};
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    width: 95%;
    max-height: 95vh;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const ModalContent = styled.div`
  display: flex;
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftSection = styled.div`
  flex: 1;
  padding-right: 1.5rem;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 1.5rem;
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RightSection = styled.div`
  flex: 1;
  padding-left: 1.5rem;
  
  @media (max-width: 768px) {
    padding-left: 0;
    padding-top: 1.5rem;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23718096' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 0.5rem 1rem;
  background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.surface};
  color: ${({ active, theme }) => active ? '#fff' : theme.colors.text};
  border: none;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ active, theme }) => active ? theme.colors.primary : theme.colors.backgroundHover};
  }
  
  &:first-of-type {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.small};
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.small};
  }
  
  &:last-of-type {
    border-top-right-radius: ${({ theme }) => theme.borderRadius.small};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.small};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const RadioInput = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 50%;
  margin: 0;
  display: grid;
  place-content: center;
  
  &::before {
    content: "";
    width: 0.65rem;
    height: 0.65rem;
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.2s;
    background-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:checked {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:checked::before {
    transform: scale(1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const TimeSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TimeSlot = styled.button`
  padding: 0.5rem;
  border: 1px solid ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, selected }) => selected ? `${theme.colors.primary}20` : theme.colors.surface};
  color: ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${({ theme, selected }) => selected ? `${theme.colors.primary}30` : theme.colors.backgroundHover};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: ${({ theme }) => theme.colors.backgroundAlt};
    border-color: ${({ theme }) => theme.colors.border};
  }
`;

const PatientSearchResult = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin-top: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
`;

const PatientItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const PatientName = styled.div`
  font-weight: 500;
`;

const PatientInfo = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SearchInputWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const SearchInput = styled(FormInput)`
  padding-left: 2.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
`;

const Checkbox = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  margin: 0;
  display: grid;
  place-content: center;
  
  &::before {
    content: "";
    width: 0.65rem;
    height: 0.65rem;
    transform: scale(0);
    transition: transform 0.2s;
    background-color: ${({ theme }) => theme.colors.primary};
    clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
  }
  
  &:checked {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  &:checked::before {
    transform: scale(1);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary}20;
  }
`;

const FloatingAddButton = styled(Button)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.round};
  padding: 0.5rem;
  min-width: auto;
  box-shadow: ${({ theme }) => theme.shadows.medium};
`;

// Datos de ejemplo
const mockSpecialists = [
  { id: 1, name: 'Dr. Juan Martínez', specialty: 'Medicina General' },
  { id: 2, name: 'Dra. Ana García', specialty: 'Cardiología' },
  { id: 3, name: 'Dr. Carlos López', specialty: 'Dermatología' },
];

const mockPatients = [
  { id: 1, name: 'María Rodríguez', email: 'maria@example.com', phone: '555-1234' },
  { id: 2, name: 'Pedro Sánchez', email: 'pedro@example.com', phone: '555-5678' },
  { id: 3, name: 'Laura Gómez', email: 'laura@example.com', phone: '555-9012' },
];

const mockTimeSlots = [
  { id: 1, time: '09:00', available: true },
  { id: 2, time: '09:30', available: true },
  { id: 3, time: '10:00', available: false },
  { id: 4, time: '10:30', available: true },
  { id: 5, time: '11:00', available: true },
  { id: 6, time: '11:30', available: false },
  { id: 7, time: '12:00', available: true },
  { id: 8, time: '12:30', available: true },
  { id: 9, time: '13:00', available: true },
  { id: 10, time: '15:00', available: true },
  { id: 11, time: '15:30', available: true },
  { id: 12, time: '16:00', available: true },
];

export default function AppointmentModal({ isOpen, onClose, onSave, selectedSlot }) {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    specialistId: '',
    patientId: '',
    patientName: '',
    start: selectedSlot ? new Date(selectedSlot.start) : new Date(),
    end: selectedSlot ? new Date(selectedSlot.end) : new Date(new Date().setHours(new Date().getHours() + 1)),
    notes: '',
    location: 'office',
    customLocation: '',
    status: 'pending',
    isRecurring: false,
    scheduleType: 'default'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  
  // Actualizar formulario cuando cambia el slot seleccionado
  useEffect(() => {
    if (selectedSlot) {
      // Si es un evento existente
      if (selectedSlot.event) {
        const event = selectedSlot.event;
        setFormData({
          ...formData,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          // Aquí se pueden agregar más propiedades del evento si están disponibles
        });
      } else {
        // Si es un nuevo slot
        setFormData({
          ...formData,
          start: new Date(selectedSlot.start),
          end: new Date(selectedSlot.end)
        });
      }
    }
  }, [selectedSlot]);
  
  // Manejar búsqueda de pacientes
  useEffect(() => {
    if (searchTerm.length > 2) {
      // Simulación de búsqueda
      const results = mockPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchTerm]);
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePatientSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handlePatientSelect = (patient) => {
    setFormData({
      ...formData,
      patientId: patient.id,
      patientName: patient.name
    });
    setSearchTerm(patient.name);
    setShowSearchResults(false);
  };
  
  const handleTimeSlotSelect = (slotId) => {
    setSelectedTimeSlot(slotId);
    // Aquí se podría actualizar la hora de inicio y fin basado en el slot seleccionado
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Crear objeto de evento para el calendario
    const appointmentData = {
      title: formData.title || `Cita - ${formData.patientName}`,
      start: formData.start,
      end: formData.end,
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
      extendedProps: {
        specialist: formData.specialistId,
        patient: formData.patientName,
        notes: formData.notes,
        location: formData.location === 'custom' ? formData.customLocation : formData.location,
        status: formData.status,
        isRecurring: formData.isRecurring
      }
    };
    
    onSave(appointmentData);
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {selectedSlot && selectedSlot.event ? 'Editar Cita' : 'Nueva Cita'}
          </ModalTitle>
          <IconButton onClick={onClose} icon={<MdClose size={20} />} />
        </ModalHeader>
        
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <LeftSection>
              <FormGroup>
                <FormLabel>Especialista</FormLabel>
                <FormSelect 
                  name="specialistId" 
                  value={formData.specialistId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Seleccionar especialista</option>
                  {mockSpecialists.map(specialist => (
                    <option key={specialist.id} value={specialist.id}>
                      {specialist.name} - {specialist.specialty}
                    </option>
                  ))}
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Motivo de la cita</FormLabel>
                <FormInput 
                  type="text" 
                  name="title" 
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Consulta general, Revisión, etc."
                />
              </FormGroup>
              
              <Card>
                <CardTitle>
                  <MdCalendarToday size={18} />
                  Fecha y hora
                </CardTitle>
                
                <ToggleButtonGroup>
                  <ToggleButton 
                    type="button"
                    active={formData.scheduleType === 'default'}
                    onClick={() => setFormData({...formData, scheduleType: 'default'})}
                  >
                    Default
                  </ToggleButton>
                  <ToggleButton 
                    type="button"
                    active={formData.scheduleType === 'custom'}
                    onClick={() => setFormData({...formData, scheduleType: 'custom'})}
                  >
                    Personalizado
                  </ToggleButton>
                </ToggleButtonGroup>
                
                {formData.scheduleType === 'default' ? (
                  <>
                    <FormGroup>
                      <FormLabel>Fecha</FormLabel>
                      <FormInput 
                        type="date" 
                        value={dayjs(formData.start).format('YYYY-MM-DD')}
                        onChange={(e) => {
                          const newDate = dayjs(e.target.value).toDate();
                          const newStart = new Date(newDate);
                          newStart.setHours(formData.start.getHours(), formData.start.getMinutes());
                          
                          const newEnd = new Date(newDate);
                          newEnd.setHours(formData.end.getHours(), formData.end.getMinutes());
                          
                          setFormData({
                            ...formData,
                            start: newStart,
                            end: newEnd
                          });
                        }}
                      />
                    </FormGroup>
                    
                    <FormLabel>Horarios disponibles</FormLabel>
                    <TimeSlotGrid>
                      {mockTimeSlots.map(slot => (
                        <TimeSlot
                          key={slot.id}
                          disabled={!slot.available}
                          selected={selectedTimeSlot === slot.id}
                          onClick={() => handleTimeSlotSelect(slot.id)}
                        >
                          {slot.time}
                        </TimeSlot>
                      ))}
                    </TimeSlotGrid>
                  </>
                ) : (
                  <>
                    <FormGroup>
                      <FormLabel>Fecha y hora de inicio</FormLabel>
                      <FormInput 
                        type="datetime-local" 
                        value={dayjs(formData.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => {
                          const newStart = new Date(e.target.value);
                          // Calcular nueva hora de fin (por defecto +30min)
                          const newEnd = new Date(newStart);
                          newEnd.setMinutes(newStart.getMinutes() + 30);
                          
                          setFormData({
                            ...formData,
                            start: newStart,
                            end: newEnd
                          });
                        }}
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel>Fecha y hora de fin</FormLabel>
                      <FormInput 
                        type="datetime-local" 
                        value={dayjs(formData.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            end: new Date(e.target.value)
                          });
                        }}
                      />
                    </FormGroup>
                  </>
                )}
                
                <CheckboxLabel>
                  <Checkbox 
                    type="checkbox" 
                    name="isRecurring" 
                    checked={formData.isRecurring}
                    onChange={handleInputChange}
                  />
                  Evento recurrente
                </CheckboxLabel>
              </Card>
              
              <Card>
                <CardTitle>
                  <MdLocationOn size={18} />
                  Lugar de la cita
                </CardTitle>
                
                <RadioGroup>
                  <RadioOption>
                    <RadioInput 
                      type="radio" 
                      name="location" 
                      value="office" 
                      checked={formData.location === 'office'}
                      onChange={handleInputChange}
                    />
                    En consultorio
                  </RadioOption>
                  
                  <RadioOption>
                    <RadioInput 
                      type="radio" 
                      name="location" 
                      value="meet" 
                      checked={formData.location === 'meet'}
                      onChange={handleInputChange}
                    />
                    <MdVideocam size={18} />
                    Google Meet
                  </RadioOption>
                  
                  <RadioOption>
                    <RadioInput 
                      type="radio" 
                      name="location" 
                      value="phone" 
                      checked={formData.location === 'phone'}
                      onChange={handleInputChange}
                    />
                    <MdPhone size={18} />
                    Teléfono
                  </RadioOption>
                  
                  <RadioOption>
                    <RadioInput 
                      type="radio" 
                      name="location" 
                      value="custom" 
                      checked={formData.location === 'custom'}
                      onChange={handleInputChange}
                    />
                    Otro sitio
                  </RadioOption>
                </RadioGroup>
                
                {formData.location === 'custom' && (
                  <FormInput 
                    type="text" 
                    name="customLocation" 
                    value={formData.customLocation}
                    onChange={handleInputChange}
                    placeholder="Especificar ubicación"
                  />
                )}
              </Card>
            </LeftSection>
            
            <RightSection>
              <FormGroup>
                <FormLabel>Paciente</FormLabel>
                <SearchInputWrapper>
                  <SearchIcon>
                    <MdPerson size={18} />
                  </SearchIcon>
                  <SearchInput 
                    type="text" 
                    value={searchTerm}
                    onChange={handlePatientSearch}
                    placeholder="Buscar paciente..."
                  />
                </SearchInputWrapper>
                
                {showSearchResults && (
                  <PatientSearchResult>
                    {searchResults.length > 0 ? (
                      searchResults.map(patient => (
                        <PatientItem 
                          key={patient.id} 
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <PatientName>{patient.name}</PatientName>
                          <PatientInfo>{patient.email} • {patient.phone}</PatientInfo>
                        </PatientItem>
                      ))
                    ) : (
                      <PatientItem>
                        <PatientName>No se encontraron resultados</PatientName>
                        <FloatingAddButton 
                          icon={<MdAdd size={16} />}
                          onClick={() => {
                            // Aquí iría la lógica para agregar un nuevo paciente
                            alert('Funcionalidad para agregar nuevo paciente');
                          }}
                        >
                          Agregar paciente
                        </FloatingAddButton>
                      </PatientItem>
                    )}
                  </PatientSearchResult>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Notas</FormLabel>
                <FormTextarea 
                  name="notes" 
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Agregar notas o instrucciones para el paciente..."
                />
              </FormGroup>
            </RightSection>
          </ModalContent>
          
          <ModalFooter>
            <FormSelect 
              name="status" 
              value={formData.status}
              onChange={handleInputChange}
              style={{ width: 'auto' }}
            >
              <option value="pending">Inconfirmado</option>
              <option value="confirmed">Confirmado</option>
            </FormSelect>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                icon={<MdCheck size={16} />}
              >
                {selectedSlot && selectedSlot.event ? 'Actualizar' : 'Agendar cita'}
              </Button>
            </div>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
}