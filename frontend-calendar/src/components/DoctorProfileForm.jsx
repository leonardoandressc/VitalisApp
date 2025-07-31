import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { Tag } from './ui/Tag';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/api';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2rem;
`;

const FormSubtitle = styled.p`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  border-bottom: 2px solid ${props => props.theme.colors.primary};
  padding-bottom: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ServicesContainer = styled.div`
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ServiceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.theme.colors.backgroundSecondary};
  }
  
  ${props => props.selected && `
    background-color: ${props.theme.colors.primary};
    color: white;
    border-color: ${props.theme.colors.primary};
  `}
`;

const SelectedServicesContainer = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SearchInput = styled(Input)`
  margin-bottom: 1rem;
`;

const RequiredLabel = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  display: block;
  
  &::after {
    content: ' *';
    color: ${props => props.theme.colors.error};
  }
`;

const OptionalLabel = styled.label`
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
  display: block;
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid ${props => props.theme.colors.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const DoctorProfileForm = ({ onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    professional_license: '',
    phone: '',
    specialty_license: '',
    office: '',
    emergency_contact: '',
    website: '',
    specialty_id: '',
    sub_specialty_id: '',
    clinic_id: ''
  });
  
  // Options data
  const [specialties, setSpecialties] = useState([]);
  const [subSpecialties, setSubSpecialties] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [services, setServices] = useState([]);
  
  // Selected items
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedInsurances, setSelectedInsurances] = useState([]);
  
  // Search states
  const [serviceSearch, setServiceSearch] = useState('');
  const [insuranceSearch, setInsuranceSearch] = useState('');
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  
  useEffect(() => {
    loadInitialData();
  }, []);
  
  useEffect(() => {
    if (formData.specialty_id) {
      loadSubSpecialties(formData.specialty_id);
    } else {
      setSubSpecialties([]);
      setFormData(prev => ({ ...prev, sub_specialty_id: '' }));
    }
  }, [formData.specialty_id]);
  
  const loadInitialData = async () => {
    try {
      const [specialtiesRes, insurancesRes, clinicsRes, servicesRes] = await Promise.all([
        api.get('/doctor-profile/specialties'),
        api.get('/doctor-profile/insurances'),
        api.get('/doctor-profile/clinics'),
        api.get('/doctor-profile/services')
      ]);
      
      setSpecialties(specialtiesRes.data.specialties || []);
      setInsurances(insurancesRes.data.insurances || []);
      setClinics(clinicsRes.data.clinics || []);
      setServices(servicesRes.data.services || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };
  
  const loadSubSpecialties = async (specialtyId) => {
    try {
      const response = await api.get(`/doctor-profile/sub-specialties?specialty_id=${specialtyId}`);
      setSubSpecialties(response.data.sub_specialties || []);
    } catch (error) {
      console.error('Error loading sub-specialties:', error);
    }
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleServiceToggle = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.find(s => s.id === service.id);
      if (isSelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };
  
  const handleInsuranceToggle = (insurance) => {
    setSelectedInsurances(prev => {
      const isSelected = prev.find(i => i.id === insurance.id);
      if (isSelected) {
        return prev.filter(i => i.id !== insurance.id);
      } else {
        return [...prev, insurance];
      }
    });
  };
  
  const removeService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };
  
  const removeInsurance = (insuranceId) => {
    setSelectedInsurances(prev => prev.filter(i => i.id !== insuranceId));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.professional_license.trim()) {
      newErrors.professional_license = 'La cédula profesional es obligatoria';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const profileData = {
        ...formData,
        specialty_id: formData.specialty_id || null,
        sub_specialty_id: formData.sub_specialty_id || null,
        clinic_id: formData.clinic_id || null,
        service_ids: selectedServices.map(s => s.id),
        insurance_ids: selectedInsurances.map(i => i.id)
      };
      
      await api.post('/doctor-profile/', profileData);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      if (error.response?.data?.detail) {
        setErrors({ submit: error.response.data.detail });
      } else {
        setErrors({ submit: 'Error al crear el perfil. Intente nuevamente.' });
      }
    } finally {
      setLoading(false);
    }
  };
  
  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    (service.description && service.description.toLowerCase().includes(serviceSearch.toLowerCase()))
  );
  
  const filteredInsurances = insurances.filter(insurance =>
    insurance.name.toLowerCase().includes(insuranceSearch.toLowerCase())
  );
  
  return (
    <FormContainer>
      <Card>
        <FormTitle>Completa tu Perfil Profesional</FormTitle>
        <FormSubtitle>
          Para comenzar a usar la plataforma, necesitamos algunos datos sobre tu práctica médica.
          Los campos marcados con * son obligatorios.
        </FormSubtitle>
        
        <form onSubmit={handleSubmit}>
          {/* Información Básica */}
          <FormSection>
            <SectionTitle>Información Básica</SectionTitle>
            <FormGrid>
              <div>
                <RequiredLabel>Cédula Profesional</RequiredLabel>
                <Input
                  type="text"
                  value={formData.professional_license}
                  onChange={(e) => handleInputChange('professional_license', e.target.value)}
                  placeholder="Ej: 12345678"
                />
                {errors.professional_license && (
                  <ErrorMessage>{errors.professional_license}</ErrorMessage>
                )}
              </div>
              
              <div>
                <RequiredLabel>Teléfono</RequiredLabel>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Ej: +52 55 1234 5678"
                />
                {errors.phone && (
                  <ErrorMessage>{errors.phone}</ErrorMessage>
                )}
              </div>
              
              <div>
                <OptionalLabel>Cédula de Especialidad</OptionalLabel>
                <Input
                  type="text"
                  value={formData.specialty_license}
                  onChange={(e) => handleInputChange('specialty_license', e.target.value)}
                  placeholder="Ej: 87654321"
                />
              </div>
              
              <div>
                <OptionalLabel>Email</OptionalLabel>
                <Input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  style={{ backgroundColor: '#f5f5f5' }}
                />
              </div>
            </FormGrid>
          </FormSection>
          
          {/* Especialidad */}
          <FormSection>
            <SectionTitle>Especialidad Médica</SectionTitle>
            <FormRow>
              <div style={{ flex: 1 }}>
                <OptionalLabel>Especialidad</OptionalLabel>
                <Select
                  value={formData.specialty_id}
                  onChange={(e) => handleInputChange('specialty_id', e.target.value)}
                >
                  <option value="">Seleccionar especialidad</option>
                  {specialties.map(specialty => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div style={{ flex: 1 }}>
                <OptionalLabel>Sub-especialidad</OptionalLabel>
                <Select
                  value={formData.sub_specialty_id}
                  onChange={(e) => handleInputChange('sub_specialty_id', e.target.value)}
                  disabled={!formData.specialty_id}
                >
                  <option value="">Seleccionar sub-especialidad</option>
                  {subSpecialties.map(subSpecialty => (
                    <option key={subSpecialty.id} value={subSpecialty.id}>
                      {subSpecialty.name}
                    </option>
                  ))}
                </Select>
              </div>
            </FormRow>
          </FormSection>
          
          {/* Ubicación */}
          <FormSection>
            <SectionTitle>Ubicación y Contacto</SectionTitle>
            <FormGrid>
              <div>
                <OptionalLabel>Clínica/Hospital</OptionalLabel>
                <Select
                  value={formData.clinic_id}
                  onChange={(e) => handleInputChange('clinic_id', e.target.value)}
                >
                  <option value="">Seleccionar clínica</option>
                  {clinics.map(clinic => (
                    <option key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              <div>
                <OptionalLabel>Consultorio</OptionalLabel>
                <Input
                  type="text"
                  value={formData.office}
                  onChange={(e) => handleInputChange('office', e.target.value)}
                  placeholder="Ej: Consultorio 205"
                />
              </div>
              
              <div>
                <OptionalLabel>Teléfono de Urgencias</OptionalLabel>
                <Input
                  type="tel"
                  value={formData.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  placeholder="Ej: +52 55 9876 5432"
                />
              </div>
              
              <div>
                <OptionalLabel>Página Web</OptionalLabel>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="Ej: https://mi-consultorio.com"
                />
              </div>
            </FormGrid>
          </FormSection>
          
          {/* Seguros */}
          <FormSection>
            <SectionTitle>Seguros Médicos Aceptados</SectionTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowInsuranceModal(true)}
            >
              Seleccionar Seguros ({selectedInsurances.length})
            </Button>
            
            {selectedInsurances.length > 0 && (
              <SelectedServicesContainer>
                {selectedInsurances.map(insurance => (
                  <Tag
                    key={insurance.id}
                    onRemove={() => removeInsurance(insurance.id)}
                  >
                    {insurance.name}
                  </Tag>
                ))}
              </SelectedServicesContainer>
            )}
          </FormSection>
          
          {/* Servicios */}
          <FormSection>
            <SectionTitle>Servicios Ofrecidos</SectionTitle>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowServiceModal(true)}
            >
              Seleccionar Servicios ({selectedServices.length})
            </Button>
            
            {selectedServices.length > 0 && (
              <SelectedServicesContainer>
                {selectedServices.map(service => (
                  <Tag
                    key={service.id}
                    onRemove={() => removeService(service.id)}
                  >
                    {service.name}
                  </Tag>
                ))}
              </SelectedServicesContainer>
            )}
          </FormSection>
          
          {errors.submit && (
            <ErrorMessage style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {errors.submit}
            </ErrorMessage>
          )}
          
          <div style={{ textAlign: 'center' }}>
            <Button
              type="submit"
              disabled={loading}
              style={{ minWidth: '200px' }}
            >
              {loading ? <LoadingSpinner /> : 'Completar Perfil'}
            </Button>
          </div>
        </form>
      </Card>
      
      {/* Modal de Servicios */}
      <Modal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Seleccionar Servicios"
      >
        <SearchInput
          type="text"
          placeholder="Buscar servicios..."
          value={serviceSearch}
          onChange={(e) => setServiceSearch(e.target.value)}
        />
        
        <ServicesGrid>
          {filteredServices.map(service => (
            <ServiceItem
              key={service.id}
              selected={selectedServices.find(s => s.id === service.id)}
              onClick={() => handleServiceToggle(service)}
            >
              <input
                type="checkbox"
                checked={!!selectedServices.find(s => s.id === service.id)}
                onChange={() => handleServiceToggle(service)}
              />
              <div>
                <div style={{ fontWeight: '500' }}>{service.name}</div>
                {service.description && (
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    {service.description}
                  </div>
                )}
              </div>
            </ServiceItem>
          ))}
        </ServicesGrid>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button onClick={() => setShowServiceModal(false)}>
            Confirmar Selección
          </Button>
        </div>
      </Modal>
      
      {/* Modal de Seguros */}
      <Modal
        isOpen={showInsuranceModal}
        onClose={() => setShowInsuranceModal(false)}
        title="Seleccionar Seguros"
      >
        <SearchInput
          type="text"
          placeholder="Buscar seguros..."
          value={insuranceSearch}
          onChange={(e) => setInsuranceSearch(e.target.value)}
        />
        
        <ServicesGrid>
          {filteredInsurances.map(insurance => (
            <ServiceItem
              key={insurance.id}
              selected={selectedInsurances.find(i => i.id === insurance.id)}
              onClick={() => handleInsuranceToggle(insurance)}
            >
              <input
                type="checkbox"
                checked={!!selectedInsurances.find(i => i.id === insurance.id)}
                onChange={() => handleInsuranceToggle(insurance)}
              />
              <div>
                <div style={{ fontWeight: '500' }}>{insurance.name}</div>
                {insurance.description && (
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                    {insurance.description}
                  </div>
                )}
              </div>
            </ServiceItem>
          ))}
        </ServicesGrid>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Button onClick={() => setShowInsuranceModal(false)}>
            Confirmar Selección
          </Button>
        </div>
      </Modal>
    </FormContainer>
  );
};

export default DoctorProfileForm;