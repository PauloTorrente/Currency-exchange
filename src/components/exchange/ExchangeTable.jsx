import React from 'react';
import { Table, Th, Td, ActionButton } from '../common/Table';
import Badge from '../common/Badge';
import DateFormatter from '../common/DateFormatter';
import styled from 'styled-components';

// Styled components for additional customization
const RateValue = styled.span`
  font-family: 'Roboto Mono', monospace;
  color: ${props => props.theme.colors.text};
`;

const PercentageCell = styled(Td)`
  color: ${props => {
    const value = parseFloat(props.value);
    if (value > 5) return props.theme.colors.error;
    if (value > 2) return props.theme.colors.warning;
    return props.theme.colors.success;
  }};
  font-weight: 500;
`;

interface ExchangeRate {
  currency_code: string;
  currency_name: string;
  rate_type: 'base' | 'fiat' | 'crypto';
  buy_rate: number;
  sell_rate: number;
  bank_fee: number;
  spread: number;
  mid_rate?: number;
  last_updated: string;
}

interface ExchangeTableProps {
  exchangeRates: ExchangeRate[];
  isLoading: boolean;
  onEdit: (rate: ExchangeRate) => void;
}

const ExchangeTable: React.FC<ExchangeTableProps> = ({ 
  exchangeRates, 
  isLoading, 
  onEdit 
}) => {
  if (isLoading) return <div>Loading exchange rates...</div>;
  if (!exchangeRates.length) return <div>No exchange rates found</div>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>Currency</Th>
          <Th>Type</Th>
          <Th>Buy Rate</Th>
          <Th>Sell Rate</Th>
          <Th>Bank Fee</Th>
          <Th>Spread</Th>
          <Th>Mid Rate</Th>
          <Th>Last Updated</Th>
          <Th>Actions</Th>
        </tr>
      </thead>
      <tbody>
        {exchangeRates.map((rate) => (
          <tr key={rate.currency_code}>
            <Td>
              <strong>{rate.currency_code}</strong>
              <div style={{ fontSize: '0.8em', color: '#666' }}>
                {rate.currency_name}
              </div>
            </Td>
            <Td>
              <Badge 
                variant={rate.rate_type.toLowerCase()} 
                showLabel={true}
              >
                {rate.rate_type.toUpperCase()}
              </Badge>
            </Td>
            <Td>
              <RateValue>{rate.buy_rate.toFixed(6)}</RateValue>
            </Td>
            <Td>
              <RateValue>{rate.sell_rate.toFixed(6)}</RateValue>
            </Td>
            <Td>{(rate.bank_fee * 100).toFixed(2)}%</Td>
            <PercentageCell value={rate.spread}>
              {rate.spread.toFixed(2)}%
            </PercentageCell>
            <Td>
              <RateValue>
                {rate.mid_rate ? rate.mid_rate.toFixed(6) : '-'}
              </RateValue>
            </Td>
            <Td>
              <DateFormatter date={rate.last_updated} />
            </Td>
            <Td>
              <ActionButton 
                onClick={() => onEdit(rate)}
                disabled={rate.currency_code === 'USDT'}
              >
                Edit
              </ActionButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ExchangeTable;
