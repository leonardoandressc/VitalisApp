/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const StyledViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  background: ${({ active, theme }) => active ? theme.colors.primary : "transparent"};
  color: ${({ active, theme }) => active ? "#fff" : theme.colors.textMuted};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.lightHover};
  }

  &:first-of-type {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }

  &:last-of-type {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const ViewButton = ({ children, active, ...props }) => (
  <StyledViewButton active={active} {...props}>
    {children}
  </StyledViewButton>
);
