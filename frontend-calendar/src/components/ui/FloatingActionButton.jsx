/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const FloatingActionButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 100;
  font-size: 24px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

export default FloatingActionButton;