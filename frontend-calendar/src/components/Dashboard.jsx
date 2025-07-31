/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useAuth } from '../auth/AuthContext';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const QuickActions = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
`;

const ActionCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

const ActionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 5px;
`;

const ActionDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { number: '12', label: 'Citas Hoy' },
    { number: '45', label: 'Pacientes Activos' },
    { number: '8', label: 'Pendientes' },
    { number: '98%', label: 'Satisfacción' }
  ];

  const quickActions = [
    {
      icon: '📅',
      title: 'Nueva Cita',
      description: 'Agendar una nueva cita',
      action: () => console.log('Nueva cita')
    },
    {
      icon: '👤',
      title: 'Nuevo Paciente',
      description: 'Registrar paciente',
      action: () => console.log('Nuevo paciente')
    },
    {
      icon: '📋',
      title: 'Historial',
      description: 'Ver historiales médicos',
      action: () => console.log('Historial')
    },
    {
      icon: '💊',
      title: 'Tratamientos',
      description: 'Gestionar tratamientos',
      action: () => console.log('Tratamientos')
    }
  ];

  return (
    <Container>
      <Header>
        <Title>¡Bienvenido, Dr. {user?.first_name || 'Doctor'}!</Title>
        <Subtitle>Aquí tienes un resumen de tu práctica médica</Subtitle>
      </Header>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <StatNumber>{stat.number}</StatNumber>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </StatsGrid>

      <QuickActions>
        <SectionTitle>Acciones Rápidas</SectionTitle>
        <ActionsGrid>
          {quickActions.map((action, index) => (
            <ActionCard key={index} onClick={action.action}>
              <ActionIcon>{action.icon}</ActionIcon>
              <ActionTitle>{action.title}</ActionTitle>
              <ActionDescription>{action.description}</ActionDescription>
            </ActionCard>
          ))}
        </ActionsGrid>
      </QuickActions>
    </Container>
  );
}
