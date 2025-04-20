import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Badge = styled(motion.div)`
  background-color: ${props => {
    if (props.spread > 10) return '#ff4444'; // Vermelho para spread alto
    if (props.spread > 5) return '#ffab00';  // Amarelo para spread médio
    return '#00C851';                        // Verde para spread bom
  }};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  display: inline-block;
  margin: 10px auto;
  width: fit-content;
  transition: all 0.3s ease;
`;

const SpreadBadge = ({ spread }) => {
  return (
    <Badge
      spread={spread}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {spread > 0 ? `Margem: ${spread}%` : 'Sem margem calculada'}
    </Badge>
  );
};

export default SpreadBadge;
