import React from 'react';
import { Table, Th, Td, ActionButton } from '../common/Table';
import Badge from '../common/Badge';
import DateFormatter from '../common/DateFormatter';

const ExchangeTable = ({ exchangeRates, isLoading, onEdit }) => {
  if (isLoading) return <div>Carregando...</div>;
  if (!exchangeRates.length) return <div>Nenhuma taxa de câmbio encontrada</div>;

  return (
    <Table>
      <thead>
        <tr>
          <Th>Código</Th>
          <Th>Nome</Th>
          <Th>Tipo</Th>
          <Th>Compra</Th>
          <Th>Venda</Th>
          <Th>Spread</Th>
          <Th>Última Atualização</Th>
          <Th>Ações</Th>
        </tr>
      </thead>
      <tbody>
        {exchangeRates.map((rate) => (
          <tr key={rate.currency_code}>
            <Td><strong>{rate.currency_code}</strong></Td>
            <Td>{rate.currency_name}</Td>
            <Td>
              <Badge 
                variant={rate.rate_type.toLowerCase()} 
                showLabel={true}
              >
                {rate.rate_type}
              </Badge>
            </Td>
            <Td>{rate.buy_rate.toFixed(4)}</Td>
            <Td>{rate.sell_rate.toFixed(4)}</Td>
            <Td>{rate.spread.toFixed(2)}%</Td>
            <Td><DateFormatter date={rate.last_updated} /></Td>
            <Td>
              <ActionButton onClick={() => onEdit(rate)}>
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