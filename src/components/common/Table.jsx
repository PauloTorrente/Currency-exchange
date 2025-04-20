import styled from 'styled-components';

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

export const Th = styled.th`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
`;

export const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background-color: ${props => props.theme.colors.background};
`;

export const ActionButton = styled.button`
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${props => 
    props.danger ? props.theme.colors.danger : props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};

  &:hover {
    opacity: 0.8;
  }
`;