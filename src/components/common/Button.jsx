import styled from 'styled-components';
import { motion } from 'framer-motion';

const StyledButton = styled(motion.button)`
  background-color: ${(props) => props.theme.colors.primary};
  color: #ffffff;
  padding: 12px 24px;
  font-size: 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: scale(0.97);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background-color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export default StyledButton;
