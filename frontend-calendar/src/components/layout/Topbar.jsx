/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { 
  MdDarkMode, 
  MdLightMode, 
  MdMenu, 
  MdNotifications, 
  MdSearch,
  MdAccountCircle,
  MdHelp,
  MdSettings
} from "react-icons/md";
import { useState } from 'react';
import { IconButton } from '../ui/IconButton';

const TopbarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 1.5rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: ${({ theme }) => theme.shadows.small};
  font-family: ${({ theme }) => theme.fonts.body};
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  z-index: 50;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.5rem 0.5rem 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent};
    width: 300px;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.25rem;
  display: flex;
  align-items: center;
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: 500;
  font-size: 1rem;
`;

const UserInfo = styled.div`
  margin-left: 0.75rem;
  display: none;
  
  @media (min-width: 768px) {
    display: block;
  }
`;

const UserName = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const UserRole = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.medium};
  overflow: hidden;
  z-index: 100;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const DropdownItem = styled.div`
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
  
  svg {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0.25rem 0;
`;

const ThemeToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
  
  svg {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default function Topbar({ toggleTheme, mode, toggleSidebar, sidebarOpen }) {
  const theme = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleUserMenu = () => {
    setUserMenuOpen(prev => !prev);
  };

  // Cerrar menú al hacer clic fuera
  const handleClickOutside = (e) => {
    if (userMenuOpen && !e.target.closest('.user-menu')) {
      setUserMenuOpen(false);
    }
  };

  // Agregar event listener para cerrar menú al hacer clic fuera
  useState(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userMenuOpen]);

  return (
    <TopbarWrapper>
      <LeftSection>
        <IconButton 
          icon={<MdMenu size={24} />} 
          onClick={toggleSidebar} 
          aria-label="Toggle Sidebar"
        />
        
        <SearchContainer>
          <SearchIcon>
            <MdSearch />
          </SearchIcon>
          <SearchInput placeholder="Buscar..." />
        </SearchContainer>
      </LeftSection>
      
      <RightSection>
        <IconButton 
          icon={<MdNotifications size={20} />} 
          aria-label="Notificaciones"
        />
        
        <UserMenu className="user-menu" onClick={toggleUserMenu}>
          <UserAvatar>DR</UserAvatar>
          <UserInfo>
            <UserName>Dr. Rodriguez</UserName>
            <UserRole>Administrador</UserRole>
          </UserInfo>
          
          <DropdownMenu isOpen={userMenuOpen}>
            <DropdownItem>
              <MdAccountCircle />
              <span>Mi Perfil</span>
            </DropdownItem>
            <DropdownItem>
              <MdSettings />
              <span>Configuración</span>
            </DropdownItem>
            <ThemeToggleContainer onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}>
              {mode === "light" ? <MdDarkMode /> : <MdLightMode />}
              <span>{mode === "light" ? "Modo Oscuro" : "Modo Claro"}</span>
            </ThemeToggleContainer>
            <Divider />
            <DropdownItem>
              <MdHelp />
              <span>Ayuda</span>
            </DropdownItem>
            <DropdownItem>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Cerrar Sesión</span>
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>
    </TopbarWrapper>
  );
}
