import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useExchangeOperations from '../hooks/useExchangeOperations';
import AdminHeader from '../components/exchange/AdminHeader';
import ExchangeTable from '../components/exchange/ExchangeTable';
import RateEditForm from '../components/exchange/RateEditForm';
import Badge from '../components/common/Badge';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminExchangePage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const {
    exchangeRates,
    isLoading,
    error,
    handleUpdateRates,
    handleAddCurrency,
    handleDeleteCurrency
  } = useExchangeOperations();

  const [selectedRate, setSelectedRate] = useState(null);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [isAddingCurrency, setIsAddingCurrency] = useState(false);
  const [newCurrency, setNewCurrency] = useState({
    currency_code: '',
    currency_name: '',
    buy_rate: 0,
    sell_rate: 0,
    bank_fee: 0.01,
    platform_fee: 0.01,
    spread: 0.05
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Ocorreu um erro');
    }
  }, [error]);

  if (authLoading) return <div className="loading">Verificando autenticação...</div>;
  if (!authLoading && user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSave = async (currencyData) => {
    const { currency_code, ...updateData } = currencyData;
    const success = await handleUpdateRates(currency_code, updateData);
    
    if (success) {
      toast.success(`Taxa ${currency_code} atualizada com sucesso!`);
      setSelectedRate(null);
    }
  };

  const handleAddNewCurrency = async () => {
    const success = await handleAddCurrency(newCurrency);
    if (success) {
      toast.success(`${newCurrency.currency_code} adicionada com sucesso!`);
      setIsAddingCurrency(false);
      setNewCurrency({
        currency_code: '',
        currency_name: '',
        buy_rate: 0,
        sell_rate: 0,
        bank_fee: 0.01,
        platform_fee: 0.01,
        spread: 0.05
      });
    }
  };

  const handleDelete = async (currencyCode) => {
    const success = await handleDeleteCurrency(currencyCode);
    if (success) {
      toast.success(`Moeda ${currencyCode} removida!`);
    }
  };

  const handleEdit = (rate) => {
    setSelectedRate(rate);
    setCurrentSpread(rate.spread * 100); // Convert to percentage
  };

  return (
    <div className="admin-exchange-container">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <AdminHeader>
        <Badge variant="base" showLabel={true}>Modo Admin</Badge>
        <button 
          className="add-currency-btn"
          onClick={() => setIsAddingCurrency(true)}
        >
          + Adicionar Moeda
        </button>
      </AdminHeader>
      
      {error && (
        <div className="error-message">
          <Badge variant="error" showLabel={true}>Erro</Badge>
          {error.details || error.message}
        </div>
      )}

      {isAddingCurrency ? (
        <div className="edit-section">
          <h3>Adicionar Nova Moeda</h3>
          <div className="form-group">
            <label>Código (3 letras):</label>
            <input
              type="text"
              value={newCurrency.currency_code}
              onChange={(e) => setNewCurrency({
                ...newCurrency,
                currency_code: e.target.value.toUpperCase()
              })}
              maxLength="3"
            />
          </div>
          <div className="form-group">
            <label>Nome Completo:</label>
            <input
              type="text"
              value={newCurrency.currency_name}
              onChange={(e) => setNewCurrency({
                ...newCurrency,
                currency_name: e.target.value
              })}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Taxa de Compra (USDT):</label>
              <input
                type="number"
                step="0.0001"
                value={newCurrency.buy_rate}
                onChange={(e) => setNewCurrency({
                  ...newCurrency,
                  buy_rate: parseFloat(e.target.value)
                })}
              />
            </div>
            <div className="form-group">
              <label>Taxa de Venda (USDT):</label>
              <input
                type="number"
                step="0.0001"
                value={newCurrency.sell_rate}
                onChange={(e) => setNewCurrency({
                  ...newCurrency,
                  sell_rate: parseFloat(e.target.value)
                })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Comissão Bancária (%):</label>
              <input
                type="number"
                step="0.0001"
                value={newCurrency.bank_fee * 100}
                onChange={(e) => setNewCurrency({
                  ...newCurrency,
                  bank_fee: parseFloat(e.target.value) / 100
                })}
              />
            </div>
            <div className="form-group">
              <label>Spread (%):</label>
              <input
                type="number"
                step="0.0001"
                value={newCurrency.spread * 100}
                onChange={(e) => setNewCurrency({
                  ...newCurrency,
                  spread: parseFloat(e.target.value) / 100
                })}
              />
            </div>
          </div>
          <div className="form-actions">
            <button 
              className="cancel-btn"
              onClick={() => setIsAddingCurrency(false)}
            >
              Cancelar
            </button>
            <button 
              className="save-btn"
              onClick={handleAddNewCurrency}
              disabled={!newCurrency.currency_code || !newCurrency.currency_name}
            >
              Salvar Moeda
            </button>
          </div>
        </div>
      ) : selectedRate ? (
        <div className="edit-section">
          <RateEditForm
            rate={selectedRate}
            onCancel={() => setSelectedRate(null)}
            onSave={handleSave}
          />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            Spread atual: 
            <Badge 
              variant={currentSpread > 5 ? 'warning' : 'success'} 
              showLabel={true}
              style={{ marginLeft: '0.5rem' }}
            >
              {currentSpread.toFixed(2)}%
            </Badge>
          </div>
          <button 
            className="delete-btn"
            onClick={() => handleDelete(selectedRate.currency_code)}
          >
            Excluir Moeda
          </button>
        </div>
      ) : (
        <ExchangeTable
          exchangeRates={exchangeRates}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default AdminExchangePage;
