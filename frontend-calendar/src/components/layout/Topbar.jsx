/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const TopbarWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 60px;
  padding: 0 2rem;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  font-family: ${({ theme }) => theme.fonts.body};
  flex-shrink: 0;
   box-sizing: border-box;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export default function Topbar({ toggleTheme, mode }) {
  const theme = useTheme();

  return (
    <TopbarWrapper>
      <ToggleButton onClick={toggleTheme} title="Cambiar modo">
        {mode === "light" ? <MdDarkMode /> : <MdLightMode />}
      </ToggleButton>
    </TopbarWrapper>
  );
}
