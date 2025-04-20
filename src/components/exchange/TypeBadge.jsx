import styled from 'styled-components';

const Badge = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  background-color: ${props => {
    if (props.type === 'base') return '#2a9d8f';
    if (props.type === 'crypto') return '#6a0dad';
    return '#0077b6';
  }};
  color: white;
`;

const TypeBadge = ({ children, type }) => {
  return <Badge type={type}>{children}</Badge>;
};

export default TypeBadge;