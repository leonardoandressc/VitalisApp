/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { MdCalendarToday, MdPeople, MdSettings, MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { useState, useEffect } from "react";


const SidebarContainer = styled.aside`
  height: 100vh; /* Cambiado de min-height */  width: ${({ collapsed }) => (collapsed ? "80px" : "240px")};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  flex-direction: column;
  padding: 1.2rem 0;
  transition: width 0.3s ease;
  border-right: 1px solid ${({ theme }) => theme.colors.accent};
  min-height: 100vh;
  position: relative;
  box-sizing: border-box;
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: ${({ collapsed }) => (collapsed ? "-1.2rem" : "-1.2rem")};
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
  z-index: 10;
`;

const Logo = styled.img`
  width: ${({ collapsed }) => (collapsed ? "40px" : "140px")};
  margin: 0 auto 2rem auto;
  transition: width 0.3s ease;
`;

const NavSection = styled.nav`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 0 1rem;
`;

const ConfigSection = styled.nav`
  padding: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.accent};
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 0.8rem ${({ collapsed }) => (collapsed ? "1.2rem" : "2rem")};
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  svg {
    font-size: 1.5rem;
    margin-right: ${({ collapsed }) => (collapsed ? "0" : "1rem")};
    transition: margin 0.3s ease;
  }

  span {
    display: ${({ collapsed }) => (collapsed ? "none" : "inline")};
    transition: opacity 0.2s ease;
  }
`;

export default function Sidebar() {
  const theme = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  // Cerrar sidebar si pantalla es pequeña (ej: < 768px)
  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContainer collapsed={collapsed}>
      <ToggleButton
        onClick={() => setCollapsed((prev) => !prev)}
        collapsed={collapsed}
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
      </ToggleButton>

      <Logo src={logo} alt="Vitalis Logo" collapsed={collapsed} />

      <NavSection>
        <NavItem to="/calendar" collapsed={collapsed}>
          <MdCalendarToday />
          <span>Calendario</span>
        </NavItem>
        <NavItem to="/crm" collapsed={collapsed}>
          <MdPeople />
          <span>CRM</span>
        </NavItem>
      </NavSection>

      <ConfigSection>
        <NavItem to="/settings" collapsed={collapsed}>
          <MdSettings />
          <span>Configuración</span>
        </NavItem>
      </ConfigSection>
    </SidebarContainer>
  );
}
