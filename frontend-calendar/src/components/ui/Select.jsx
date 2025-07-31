/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { forwardRef } from 'react';

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  
  &.required::after {
    content: ' *';
    color: ${({ theme }) => theme.colors.error || '#ef4444'};
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.backgroundAlt};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &.error {
    border-color: ${({ theme }) => theme.colors.error || '#ef4444'};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error || '#ef4444'};
`;

export const Select = forwardRef(({ 
  label, 
  error, 
  required, 
  children,
  options,
  placeholder,
  className, 
  ...props 
}, ref) => {
  return (
    <SelectWrapper className={className}>
      {label && (
        <Label className={required ? 'required' : ''}>
          {label}
        </Label>
      )}
      <StyledSelect 
        ref={ref}
        className={error ? 'error' : ''}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </StyledSelect>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectWrapper>
  );
});

Select.displayName = 'Select';