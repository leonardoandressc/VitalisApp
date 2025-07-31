/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { 
  MdCalendarToday, 
  MdPeople, 
  MdSettings, 
  MdChevronLeft, 
  MdChevronRight,
  MdDashboard,
  MdLocalHospital,
  MdAssignment,
  MdPayment
} from "react-icons/md";
import { useTheme } from "@emotion/react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useEffect } from "react";

const SidebarContainer = styled.aside`
  height: 100vh;
  width: ${({ isOpen }) => (isOpen ? "240px" : "0")};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  padding: ${({ isOpen }) => (isOpen ? "1.2rem 0" : "1.2rem 0")};
  transition: all 0.3s ease;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  z-index: 100;
  
  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100%")});
    width: 240px;
  }
`;

const Overlay = styled.div`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 90;
  transition: opacity 0.3s ease;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 1rem 2rem;
`;

const Logo = styled.img`
  width: 140px;
  height: auto;
  transition: all 0.3s ease;
`;

const NavSection = styled.nav`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0 1rem;
  overflow-y: auto;
  
  /* Ocultar scrollbar pero mantener funcionalidad */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const NavSectionTitle = styled.h3`
  font-size: 0.75rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 1.5rem 0 0.5rem;
  padding: 0 0.5rem;
  letter-spacing: 0.5px;
`;

const ConfigSection = styled.nav`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem 1rem;
  text-decoration: none;
  color: ${({ theme, active }) => active === "true" ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ active }) => active === "true" ? "600" : "500"};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme, active }) => active === "true" ? `${theme.colors.lightHover}` : 'transparent'};

  &:hover {
    background-color: ${({ theme, active }) => active === "true" ? theme.colors.lightHover : theme.colors.backgroundHover};
  }

  svg {
    font-size: 1.3rem;
    margin-right: 1rem;
    color: ${({ theme, active }) => active === "true" ? theme.colors.primary : theme.colors.textSecondary};
  }

  span {
    transition: opacity 0.2s ease;
  }
`;

export default function Sidebar({ isOpen, toggleSidebar }) {
  const theme = useTheme();
  const location = useLocation();

  // Cerrar sidebar al hacer clic en un enlace en dispositivos móviles
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  // Prevenir scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <Overlay isOpen={isOpen && window.innerWidth < 768} onClick={toggleSidebar} />
      <SidebarContainer isOpen={isOpen}>
        <LogoContainer>
          <Logo src={logo} alt="Vitalis Logo" />
        </LogoContainer>

        <NavSection>
          <NavSectionTitle>Principal</NavSectionTitle>
          <NavItem 
            to="/dashboard" 
            active={isActive('/dashboard') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdDashboard />
            <span>Dashboard</span>
          </NavItem>
          <NavItem 
            to="/calendar" 
            active={isActive('/calendar') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdCalendarToday />
            <span>Calendario</span>
          </NavItem>
          <NavItem 
            to="/patients" 
            active={isActive('/patients') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdPeople />
            <span>Pacientes</span>
          </NavItem>
          
          <NavSectionTitle>Clínica</NavSectionTitle>
          <NavItem 
            to="/medical-records" 
            active={isActive('/medical-records') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdAssignment />
            <span>Historias Clínicas</span>
          </NavItem>
          <NavItem 
            to="/treatments" 
            active={isActive('/treatments') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdLocalHospital />
            <span>Tratamientos</span>
          </NavItem>
          <NavItem 
            to="/billing" 
            active={isActive('/billing') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdPayment />
            <span>Facturación</span>
          </NavItem>
        </NavSection>

        <ConfigSection>
          <NavItem 
            to="/settings" 
            active={isActive('/settings') ? "true" : undefined} 
            onClick={handleNavClick}
          >
            <MdSettings />
            <span>Configuración</span>
          </NavItem>
        </ConfigSection>
      </SidebarContainer>
    </>
  );
}
