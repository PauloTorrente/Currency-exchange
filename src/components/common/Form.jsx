import styled from 'styled-components';
import React from 'react';

// Componente InputField corrigido
export const InputField = React.forwardRef(({ label, ...props }, ref) => {
  return (
    <InputFieldContainer>
      {label && <label>{label}</label>}
      <input {...props} ref={ref} />
    </InputFieldContainer>
  );
});

const InputFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  input {
    padding: 10px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;
    background-color: ${props => props.theme.colors.inputBackground};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }

    &:invalid {
      border-color: ${props => props.theme.colors.danger};
    }
  }
`;

// SelectField permanece o mesmo
export const SelectField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }

  select {
    padding: 10px 12px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;
    background-color: ${props => props.theme.colors.inputBackground};

    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
    }
  }
`;