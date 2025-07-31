/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';

const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full || '9999px'};
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary}40;
        `;
      case 'success':
        return `
          background: #10b98120;
          color: #059669;
          border: 1px solid #10b98140;
        `;
      case 'warning':
        return `
          background: #f59e0b20;
          color: #d97706;
          border: 1px solid #f59e0b40;
        `;
      case 'error':
        return `
          background: #ef444420;
          color: #dc2626;
          border: 1px solid #ef444440;
        `;
      case 'info':
        return `
          background: #3b82f620;
          color: #2563eb;
          border: 1px solid #3b82f640;
        `;
      default:
        return `
          background: ${theme.colors.backgroundAlt};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
  
  ${({ removable }) => removable && `
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  `}
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

export const Tag = ({ 
  children, 
  variant = 'default', 
  removable = false, 
  onRemove,
  className,
  ...props 
}) => {
  return (
    <StyledTag 
      variant={variant} 
      removable={removable}
      className={className}
      {...props}
    >
      {children}
      {removable && (
        <RemoveButton onClick={onRemove}>
          ×
        </RemoveButton>
      )}
    </StyledTag>
  );
};