import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { InputField } from '../common/Form';

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
  const [formData, setFormData] = useState({
    buyRate: rate.buy_rate?.toString() || '',
    sellRate: rate.sell_rate?.toString() || '',
    spread: rate.spread?.toString() || '0'
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const buy = parseFloat(formData.buyRate) || 0;
    const sell = parseFloat(formData.sellRate) || 0;
    const spread = parseFloat(formData.spread) || 0;

    // Validação principal modificada
    if (buy <= sell) {
      setValidationError('Taxa de compra deve ser MAIOR que taxa de venda');
      return;
    }

    // Cálculo do spread ajustado
    const calculatedSpread = ((buy - sell) / sell * 100).toFixed(2);
    
    if (spread > 10) {
      setValidationError(`Spread máximo de 10% excedido: ${spread}%`);
    } else if (Math.abs(spread - calculatedSpread) > 0.01) {
      setValidationError('Spread não corresponde às taxas informadas');
    } else {
      setValidationError('');
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    setFormData(prev => {
      const newData = {...prev, [name]: numericValue};
      
      // Cálculo ajustado para buy > sell
      if (name === 'spread') {
        const buy = parseFloat(newData.buyRate) || 0;
        const newSell = buy / (1 + parseFloat(numericValue)/100); // Fórmula invertida
        newData.sellRate = newSell.toFixed(6);
      }
      
      return newData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validationError) {
      onSave(
        rate.currency_code,
        formData.buyRate,
        formData.sellRate,
        formData.spread
      );
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>Editar Taxa: {rate.currency_code}</FormTitle>
      <Form onSubmit={handleSubmit}>
        <InputField
          label="Taxa de Compra"
          name="buyRate"
          type="text"
          value={formData.buyRate}
          onChange={handleChange}
          required
          inputMode="decimal"
        />

        <InputField
          label="Taxa de Venda"
          name="sellRate"
          type="text"
          value={formData.sellRate}
          onChange={handleChange}
          required
          inputMode="decimal"
        />

        <InputField
          label="Spread (%)"
          name="spread"
          type="text"
          value={formData.spread}
          onChange={handleChange}
          inputMode="decimal"
        />

        {validationError && (
          <div style={{ color: '#ff4444', marginTop: '10px' }}>
            {validationError}
          </div>
        )}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!!validationError}>
            Salvar Alterações
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default RateEditForm;
