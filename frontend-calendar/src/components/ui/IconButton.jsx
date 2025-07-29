/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const StyledIconButton = styled.button`
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.lightHover};
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const IconButton = ({ icon, ...props }) => {
  return <StyledIconButton {...props}>{icon}</StyledIconButton>;
};
