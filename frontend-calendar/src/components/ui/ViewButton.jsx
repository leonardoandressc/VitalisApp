/** @jsxImportSource @emotion/react */
import styled from "@emotion/styled";

const StyledViewButton = styled.button`
  padding: 0.5rem 1rem;
  border: #F1F1F1 3px solid;
  background-color: ${({ active, theme }) =>
    active === "true" ? "#FFFFFF" : theme.colors.backgroundAlt || "#F1F1F1"};
  color: ${({ active, theme }) =>
    active === "true" ? theme.colors.secondary : theme.colors.textMuted};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: ${({ active }) => (active === "true" ? "0 1px 4px rgba(0, 0, 0, 0.1)" : "none")};

  &:hover {
    background-color: ${({ active, theme }) =>
      active === "true" ? "#FFFFFF" : theme.colors.backgroundHover || "#EDEDED"};
  }

  &:first-of-type {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }

  &:last-of-type {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

export const ViewButton = ({ children, active, ...props }) => (
  <StyledViewButton active={active ? "true" : undefined} {...props}>
    {children}
  </StyledViewButton>
);
