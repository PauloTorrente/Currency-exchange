import React from 'react';
import { Table, Th, Td, ActionButton } from '../common/Table';
import Badge from '../common/Badge';
import DateFormatter from '../common/DateFormatter';
import styled from 'styled-components';

// Componentes estilizados
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

const ExchangeTable = ({ exchangeRates, isLoading, onEdit }) => {
  if (isLoading) return <div>Carregando taxas de câmbio...</div>;
  if (!exchangeRates || exchangeRates.length === 0) return <div>Nenhuma taxa de câmbio encontrada</div>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>Código</Th>
          <Th>Nome</Th>
          <Th>Tipo</Th>
          <Th>Compra</Th>
          <Th>Venda</Th>
          <Th>Taxa Bancária</Th>
          <Th>Spread</Th>
          <Th>Taxa Média</Th>
          <Th>Última Atualização</Th>
          <Th>Ações</Th>
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
              <RateValue>{parseFloat(rate.buy_rate).toFixed(6)}</RateValue>
            </Td>
            <Td>
              <RateValue>{parseFloat(rate.sell_rate).toFixed(6)}</RateValue>
            </Td>
            <Td>{(parseFloat(rate.bank_fee) * 100).toFixed(2)}%</Td>
            <PercentageCell value={rate.spread}>
              {parseFloat(rate.spread).toFixed(2)}%
            </PercentageCell>
            <Td>
              <RateValue>
                {rate.mid_rate ? parseFloat(rate.mid_rate).toFixed(6) : '-'}
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
                Editar
              </ActionButton>
            </Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ExchangeTable;
