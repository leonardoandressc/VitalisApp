// components/ui/Button.jsx
/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.3s ease;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

export const Button = ({ children, ...props }) => (
  <StyledButton {...props}>{children}</StyledButton>
);
