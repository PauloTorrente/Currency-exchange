import styled from 'styled-components';
import { motion } from 'framer-motion';

const typeConfig = {
  crypto: {
    label: 'CRYPTO',
    color: 'cryptoBadge',
    icon: '₿'
  },
  fiat: {
    label: 'FIAT',
    color: 'fiatBadge',
    icon: '$'
  },
  base: {
    label: 'BASE',
    color: 'baseBadge',
    icon: '★'
  },
  error: {
    label: 'ERRO',
    color: '#ff4444',
    icon: '⚠️'
  },
  warning: {
    label: 'ALERTA',
    color: '#ffbb33',
    icon: '⚠️'
  },
  success: {
    label: 'SUCESSO',
    color: '#00C851',
    icon: '✓'
  }
};

const StyledBadge = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1.2;
  white-space: nowrap;

  background-color: ${props => 
    props.$variant ? 
    (typeConfig[props.$variant]?.color || props.theme.colors.secondary) 
    : props.theme.colors.secondary};
  
  color: white;
  
  &::before {
    content: "${props => typeConfig[props.$variant]?.icon || ''}";
    display: ${props => props.$showIcon ? 'inline-block' : 'none'};
    font-size: 1.1em;
  }
`;

const Badge = ({ 
  variant = 'default',
  showIcon = true,
  showLabel = false,
  children,
  ...props 
}) => {
  const typeLabel = typeConfig[variant]?.label;
  
  return (
    <StyledBadge
      $variant={variant}
      $showIcon={showIcon}
      aria-label={`${typeLabel || variant}: ${children}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {showLabel && typeLabel ? `${typeLabel}: ` : ''}
      {children}
    </StyledBadge>
  );
};

export default Badge;
