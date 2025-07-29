/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const getButtonStyles = (variant, theme) => {
  switch (variant) {
    case "outline":
      return `
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};

        &:hover {
          background-color: ${theme.colors.lightHover};
        }
      `;
    case "primary":
    default:
      return `
        background-color: ${theme.colors.primary};
        color: white;
        border: none;

        &:hover {
          background-color: ${theme.colors.secondary};
        }
      `;
  }
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  ${({ variant = "primary", theme }) => getButtonStyles(variant, theme)}

  &:active {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Button = ({ children, icon, variant = "primary", ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {icon}
      {children}
    </StyledButton>
  );
};
