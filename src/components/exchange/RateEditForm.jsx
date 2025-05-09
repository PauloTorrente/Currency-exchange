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
    buy_rate: rate.buy_rate?.toString() || '',
    sell_rate: rate.sell_rate?.toString() || '',
    bank_fee: (rate.bank_fee * 100)?.toString() || '1', // Convert to percentage
    spread: (rate.spread * 100)?.toString() || '5' // Convert to percentage
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const buy = parseFloat(formData.buy_rate) || 0;
    const sell = parseFloat(formData.sell_rate) || 0;
    const spread = parseFloat(formData.spread) || 0;
    const bankFee = parseFloat(formData.bank_fee) || 0;

    // Validate buy > sell
    if (buy <= sell) {
      setValidationError('Buy rate must be GREATER than sell rate');
      return;
    }

    // Validate spread ≤ 10%
    if (spread > 10) {
      setValidationError('Maximum spread is 10%');
      return;
    }

    // Validate bank fee ≤ 100%
    if (bankFee > 100) {
      setValidationError('Maximum bank fee is 100%');
      return;
    }

    // Validate calculated spread matches input
    const calculatedSpread = ((buy - sell) / buy * 100).toFixed(2);
    if (Math.abs(spread - calculatedSpread) > 0.1) {
      setValidationError(`Spread should be ~${calculatedSpread}% based on rates`);
      return;
    }

    setValidationError('');
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validationError) {
      onSave(rate.currency_code, {
        buy_rate: parseFloat(formData.buy_rate),
        sell_rate: parseFloat(formData.sell_rate),
        bank_fee: parseFloat(formData.bank_fee) / 100, // Convert back to decimal
        spread: parseFloat(formData.spread) / 100 // Convert back to decimal
      });
    }
  };

  return (
    <FormContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FormTitle>Edit Rate: {rate.currency_code}</FormTitle>
      <Form onSubmit={handleSubmit}>
        <InputField
          label="Buy Rate (1 USDT = X)"
          name="buy_rate"
          type="text"
          value={formData.buy_rate}
          onChange={handleChange}
          required
          inputMode="decimal"
        />

        <InputField
          label="Sell Rate (1 USDT = X)"
          name="sell_rate"
          type="text"
          value={formData.sell_rate}
          onChange={handleChange}
          required
          inputMode="decimal"
        />

        <InputField
          label="Bank Fee (%)"
          name="bank_fee"
          type="text"
          value={formData.bank_fee}
          onChange={handleChange}
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
            Cancel
          </Button>
          <Button type="submit" disabled={!!validationError}>
            Save Changes
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
};

export default RateEditForm;
