import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { InputField } from '../common/Form';
import SpreadBadge from './SpreadBadge';

const FormContainer = styled(motion.div)`
  background-color: ${(props) => props.theme.colors.background};
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: 20px auto;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const FormTitle = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 24px;
  font-size: 24px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const RateEditForm = ({ rate, onCancel, onSave }) => {
  console.log('[DEBUG] Rate recebido:', rate); // Debug 1

  const [formData, setFormData] = useState({
    buyRate: rate.buy_rate?.toString() || '0',
    sellRate: rate.sell_rate?.toString() || '0'
  });

  console.log('[DEBUG] Estado inicial formData:', formData); // Debug 2

  const [spread, setSpread] = useState(rate.spread || 0);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    console.log('[DEBUG] useEffect - Valores atuais:', formData); // Debug 3
    
    const buy = parseFloat(formData.buyRate) || 0;
    const sell = parseFloat(formData.sellRate) || 0;
    
    console.log('[DEBUG] Valores convertidos:', { buy, sell }); // Debug 4

    const calculatedSpread = ((sell - buy) / buy * 100).toFixed(2);
    console.log('[DEBUG] Spread calculado:', calculatedSpread); // Debug 5
    setSpread(calculatedSpread);

    if (sell <= buy) {
      console.warn('[VALIDAÇÃO] Venda <= Compra'); // Debug 6
      setValidationError('Taxa de venda deve ser maior que taxa de compra');
    } else if (calculatedSpread > 10) {
      console.warn('[VALIDAÇÃO] Spread > 10%'); // Debug 7
      setValidationError(`Spread máximo de 10% excedido: ${calculatedSpread}%`);
    } else {
      console.log('[VALIDAÇÃO] Valores válidos'); // Debug 8
      setValidationError('');
    }
  }, [formData.buyRate, formData.sellRate]);

  const handleChange = (e) => {
    console.log('[DEBUG] handleChange - Antes:', { 
      name: e.target.name, 
      value: e.target.value 
    }); // Debug 9
    
    const { name, value } = e.target;
    
    // Filtro mais permissivo temporariamente para testes
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    console.log('[DEBUG] handleChange - Depois:', numericValue); // Debug 10
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('[DEBUG] handleSubmit - Dados:', {
      currency: rate.currency_code,
      buyRate: formData.buyRate,
      sellRate: formData.sellRate
    }); // Debug 11
    
    if (!validationError) {
      console.log('[DEBUG] Chamando onSave...'); // Debug 12
      onSave(
        rate.currency_code,
        formData.buyRate,
        formData.sellRate
      );
    } else {
      console.error('[DEBUG] Erro de validação impedindo submit:', validationError); // Debug 13
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      data-testid="rate-edit-form"
    >
      <FormTitle>Editar Taxa: {rate.currency_code}</FormTitle>
      <Form onSubmit={handleSubmit}>
        <div style={{ border: '1px solid red', padding: '10px' }}>
          <InputField
            label="Taxa de Compra"
            name="buyRate"
            type="text"
            value={formData.buyRate}
            onChange={handleChange}
            required
            inputMode="decimal"
            data-testid="buy-rate-input"
          />
        </div>
        
        <div style={{ border: '1px solid red', padding: '10px' }}>
          <InputField
            label="Taxa de Venda"
            name="sellRate"
            type="text"
            value={formData.sellRate}
            onChange={handleChange}
            required
            inputMode="decimal"
            data-testid="sell-rate-input"
          />
        </div>
        
        <SpreadBadge spread={spread} />
        
        {validationError && (
          <div style={{ color: '#ff4444', marginTop: '10px' }}>
            {validationError}
          </div>
        )}
        
        <ButtonGroup>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            data-testid="cancel-button"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={!!validationError}
            data-testid="submit-button"
          >
            Salvar Alterações
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default RateEditForm;