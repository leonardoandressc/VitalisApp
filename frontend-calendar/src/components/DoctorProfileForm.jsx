import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Modal } from './ui/Modal';
import { Tag } from './ui/Tag';
import { useAuth } from '../auth/AuthContext';
import { api } from '../api/axios';

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

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const DropdownItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const CreateButton = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
  border-top: 1px solid #ddd;
  
  &:hover {
    background-color: #bbdefb;
  }
`;

const DoctorProfileForm = ({ onComplete }) => {
  const { user, updateProfileStatus } = useAuth();
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
  const [specialtySearch, setSpecialtySearch] = useState('');
  const [showSpecialtyDropdown, setShowSpecialtyDropdown] = useState(false);
  const [subSpecialtySearch, setSubSpecialtySearch] = useState('');
  const [showSubSpecialtyDropdown, setShowSubSpecialtyDropdown] = useState(false);
  const [clinicSearch, setClinicSearch] = useState('');
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  
  // Modal states
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  
  useEffect(() => {
    loadInitialData();
  }, []); // Remover dependencia de user para evitar bucle infinito
  
  useEffect(() => {
    if (formData.specialty_id) {
      loadSubSpecialties(formData.specialty_id);
      // Actualizar el texto de búsqueda con la especialidad seleccionada
      const selectedSpecialty = specialties.find(s => s.id === parseInt(formData.specialty_id));
      if (selectedSpecialty && specialtySearch !== selectedSpecialty.name) {
        setSpecialtySearch(selectedSpecialty.name);
      }
    } else {
      setSubSpecialties([]);
      setFormData(prev => ({ ...prev, sub_specialty_id: '' }));
      setSubSpecialtySearch('');
    }
  }, [formData.specialty_id, specialties]);

  useEffect(() => {
    // Actualizar el texto de búsqueda con la sub-especialidad seleccionada
    const selectedSubSpecialty = subSpecialties.find(s => s.id === parseInt(formData.sub_specialty_id));
    if (selectedSubSpecialty && subSpecialtySearch !== selectedSubSpecialty.name) {
      setSubSpecialtySearch(selectedSubSpecialty.name);
    } else if (!formData.sub_specialty_id) {
      setSubSpecialtySearch('');
    }
  }, [formData.sub_specialty_id, subSpecialties]);

  useEffect(() => {
    // Actualizar el texto de búsqueda con la clínica seleccionada
    const selectedClinic = clinics.find(c => c.id === parseInt(formData.clinic_id));
    if (selectedClinic && clinicSearch !== selectedClinic.name) {
      setClinicSearch(selectedClinic.name);
    } else if (!formData.clinic_id) {
      setClinicSearch('');
    }
  }, [formData.clinic_id, clinics]);
  
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
  
  const searchSpecialties = async (searchTerm) => {
    try {
      const response = await api.get(`/doctor-profile/specialties?search=${encodeURIComponent(searchTerm)}&limit=10`);
      setSpecialties(response.data.specialties || []);
    } catch (error) {
      console.error('Error searching specialties:', error);
    }
  };

  const createNewSpecialty = async (name) => {
    try {
      const response = await api.post('/doctor-profile/specialties', {
        name: name.trim(),
        description: `Especialidad creada por el usuario: ${name.trim()}`
      });
      
      // Agregar la nueva especialidad a la lista
      setSpecialties(prev => [response.data, ...prev]);
      
      // Seleccionar la nueva especialidad
      setFormData(prev => ({ ...prev, specialty_id: response.data.id }));
      setSpecialtySearch(response.data.name);
      setShowSpecialtyDropdown(false);
      
      return response.data;
    } catch (error) {
      console.error('Error creating specialty:', error);
      throw error;
    }
  };

  const handleSpecialtySearch = (value) => {
    setSpecialtySearch(value);
    setShowSpecialtyDropdown(true);
    
    if (value.trim().length > 0) {
      searchSpecialties(value.trim());
    } else {
      loadInitialData(); // Cargar todas las especialidades
    }
  };

  const handleSpecialtySelect = (specialty) => {
    setFormData(prev => ({ ...prev, specialty_id: specialty.id }));
    setSpecialtySearch(specialty.name);
    setShowSpecialtyDropdown(false);
  };

  const handleCreateSpecialty = async () => {
    if (specialtySearch.trim().length === 0) return;
    
    try {
      await createNewSpecialty(specialtySearch);
    } catch (error) {
      alert('Error al crear la especialidad. Por favor, inténtalo de nuevo.');
    }
  };

  // Funciones para sub-especialidades
  const searchSubSpecialties = async (searchTerm, specialtyId) => {
    try {
      const response = await api.get(`/doctor-profile/sub-specialties?specialty_id=${specialtyId}&search=${encodeURIComponent(searchTerm)}&limit=10`);
      setSubSpecialties(response.data.sub_specialties || []);
    } catch (error) {
      console.error('Error searching sub-specialties:', error);
    }
  };

  const createNewSubSpecialty = async (name, specialtyId) => {
    try {
      const response = await api.post('/doctor-profile/sub-specialties', {
        name: name.trim(),
        specialty_id: specialtyId,
        description: `Sub-especialidad creada por el usuario: ${name.trim()}`
      });
      
      setSubSpecialties(prev => [response.data, ...prev]);
      setFormData(prev => ({ ...prev, sub_specialty_id: response.data.id }));
      setSubSpecialtySearch(response.data.name);
      setShowSubSpecialtyDropdown(false);
      
      return response.data;
    } catch (error) {
      console.error('Error creating sub-specialty:', error);
      throw error;
    }
  };

  const handleSubSpecialtySearch = (value) => {
    setSubSpecialtySearch(value);
    setShowSubSpecialtyDropdown(true);
    
    if (value.trim().length > 0 && formData.specialty_id) {
      searchSubSpecialties(value.trim(), formData.specialty_id);
    } else if (formData.specialty_id) {
      loadSubSpecialties(formData.specialty_id);
    }
  };

  const handleSubSpecialtySelect = (subSpecialty) => {
    setFormData(prev => ({ ...prev, sub_specialty_id: subSpecialty.id }));
    setSubSpecialtySearch(subSpecialty.name);
    setShowSubSpecialtyDropdown(false);
  };

  const handleCreateSubSpecialty = async () => {
    if (subSpecialtySearch.trim().length === 0 || !formData.specialty_id) return;
    
    try {
      await createNewSubSpecialty(subSpecialtySearch, formData.specialty_id);
    } catch (error) {
      alert('Error al crear la sub-especialidad. Por favor, inténtalo de nuevo.');
    }
  };

  // Funciones para clínicas
  const searchClinics = async (searchTerm) => {
    try {
      const response = await api.get(`/doctor-profile/clinics?search=${encodeURIComponent(searchTerm)}&limit=10`);
      setClinics(response.data.clinics || []);
    } catch (error) {
      console.error('Error searching clinics:', error);
    }
  };

  const createNewClinic = async (name) => {
    try {
      const response = await api.post('/doctor-profile/clinics', {
        name: name.trim(),
        address: '',
        phone: '',
        email: ''
      });
      
      setClinics(prev => [response.data, ...prev]);
      setFormData(prev => ({ ...prev, clinic_id: response.data.id }));
      setClinicSearch(response.data.name);
      setShowClinicDropdown(false);
      
      return response.data;
    } catch (error) {
      console.error('Error creating clinic:', error);
      throw error;
    }
  };

  const handleClinicSearch = (value) => {
    setClinicSearch(value);
    setShowClinicDropdown(true);
    
    if (value.trim().length > 0) {
      searchClinics(value.trim());
    } else {
      loadInitialData();
    }
  };

  const handleClinicSelect = (clinic) => {
    setFormData(prev => ({ ...prev, clinic_id: clinic.id }));
    setClinicSearch(clinic.name);
    setShowClinicDropdown(false);
  };

  const handleCreateClinic = async () => {
    if (clinicSearch.trim().length === 0) return;
    
    try {
      await createNewClinic(clinicSearch);
    } catch (error) {
      alert('Error al crear la clínica. Por favor, inténtalo de nuevo.');
    }
  };

  // Validación de teléfono
  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      return cleaned;
    }
    return cleaned.slice(0, 10);
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
    let processedValue = value;
    
    // Formatear teléfono
    if (field === 'phone') {
      processedValue = formatPhone(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
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
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'El teléfono debe tener exactamente 10 dígitos';
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
      
      // Actualizar el estado del perfil en el contexto
      updateProfileStatus({
        has_profile: true,
        profile_completed: true,
        is_verified: false
      });
      
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
                  style={{ backgroundColor: '#f5f5f5', color: '#333' }}
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
                <DropdownContainer>
                  <Input
                    type="text"
                    value={specialtySearch}
                    onChange={(e) => handleSpecialtySearch(e.target.value)}
                    onFocus={() => setShowSpecialtyDropdown(true)}
                    onBlur={() => {
                      // Delay para permitir clicks en el dropdown
                      setTimeout(() => setShowSpecialtyDropdown(false), 200);
                    }}
                    placeholder="Buscar o escribir nueva especialidad..."
                  />
                  {showSpecialtyDropdown && (
                    <DropdownList>
                      {specialties.length > 0 ? (
                        specialties.map(specialty => (
                          <DropdownItem
                            key={specialty.id}
                            onClick={() => handleSpecialtySelect(specialty)}
                          >
                            {specialty.name}
                          </DropdownItem>
                        ))
                      ) : (
                        <DropdownItem style={{ color: '#666', fontStyle: 'italic' }}>
                          No se encontraron especialidades
                        </DropdownItem>
                      )}
                      {specialtySearch.trim() && !specialties.find(s => s.name.toLowerCase() === specialtySearch.toLowerCase()) && (
                        <CreateButton onClick={handleCreateSpecialty}>
                          + Crear "{specialtySearch}"
                        </CreateButton>
                      )}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </div>
              
              <div style={{ flex: 1 }}>
                <OptionalLabel>Sub-especialidad</OptionalLabel>
                <DropdownContainer>
                  <Input
                    type="text"
                    value={subSpecialtySearch}
                    onChange={(e) => handleSubSpecialtySearch(e.target.value)}
                    onFocus={() => setShowSubSpecialtyDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowSubSpecialtyDropdown(false), 200);
                    }}
                    placeholder="Buscar o escribir nueva sub-especialidad..."
                    disabled={!formData.specialty_id}
                  />
                  {showSubSpecialtyDropdown && formData.specialty_id && (
                    <DropdownList>
                      {subSpecialties.length > 0 ? (
                        subSpecialties.map(subSpecialty => (
                          <DropdownItem
                            key={subSpecialty.id}
                            onClick={() => handleSubSpecialtySelect(subSpecialty)}
                          >
                            {subSpecialty.name}
                          </DropdownItem>
                        ))
                      ) : (
                        <DropdownItem style={{ color: '#666', fontStyle: 'italic' }}>
                          No se encontraron sub-especialidades
                        </DropdownItem>
                      )}
                      {subSpecialtySearch.trim() && !subSpecialties.find(s => s.name.toLowerCase() === subSpecialtySearch.toLowerCase()) && (
                        <CreateButton onClick={handleCreateSubSpecialty}>
                          + Crear "{subSpecialtySearch}"
                        </CreateButton>
                      )}
                    </DropdownList>
                  )}
                </DropdownContainer>
              </div>
            </FormRow>
          </FormSection>
          
          {/* Ubicación */}
          <FormSection>
            <SectionTitle>Ubicación y Contacto</SectionTitle>
            <FormGrid>
              <div>
                <OptionalLabel>Clínica/Hospital</OptionalLabel>
                <DropdownContainer>
                  <Input
                    type="text"
                    value={clinicSearch}
                    onChange={(e) => handleClinicSearch(e.target.value)}
                    onFocus={() => setShowClinicDropdown(true)}
                    onBlur={() => {
                      setTimeout(() => setShowClinicDropdown(false), 200);
                    }}
                    placeholder="Buscar o escribir nueva clínica..."
                  />
                  {showClinicDropdown && (
                    <DropdownList>
                      {clinics.length > 0 ? (
                        clinics.map(clinic => (
                          <DropdownItem
                            key={clinic.id}
                            onClick={() => handleClinicSelect(clinic)}
                          >
                            {clinic.name}
                          </DropdownItem>
                        ))
                      ) : (
                        <DropdownItem style={{ color: '#666', fontStyle: 'italic' }}>
                          No se encontraron clínicas
                        </DropdownItem>
                      )}
                      {clinicSearch.trim() && !clinics.find(c => c.name.toLowerCase() === clinicSearch.toLowerCase()) && (
                        <CreateButton onClick={handleCreateClinic}>
                          + Crear "{clinicSearch}"
                        </CreateButton>
                      )}
                    </DropdownList>
                  )}
                </DropdownContainer>
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