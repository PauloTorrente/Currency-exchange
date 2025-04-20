import React from 'react';
import Button from '../common/Button';

const AdminHeader = ({ onAddCurrency }) => {
  return (
    <div className="admin-header">
      <h1>Painel Administrativo - Taxas de Câmbio</h1>
      <Button onClick={onAddCurrency}>
        Adicionar Nova Moeda
      </Button>
    </div>
  );
};

export default AdminHeader;