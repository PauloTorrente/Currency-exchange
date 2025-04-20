import React, { useState } from 'react';
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
    handleUpdateRates
  } = useExchangeOperations();

  const [selectedRate, setSelectedRate] = useState(null);
  const [currentSpread, setCurrentSpread] = useState(0);

  if (authLoading) return <div className="loading">Verificando autenticação...</div>;
  if (!authLoading && user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleSave = async (currencyCode, buyRate, sellRate) => {
    const success = await handleUpdateRates(currencyCode, buyRate, sellRate);
    if (success) {
      toast.success(`Taxa ${currencyCode} atualizada com sucesso!`);
      setSelectedRate(null);
    } else {
      toast.error(error?.details || 'Falha ao atualizar. Verifique os valores.');
    }
  };

  const handleEdit = (rate) => {
    setSelectedRate(rate);
    setCurrentSpread(rate.spread);
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
      </AdminHeader>
      
      {error && (
        <div className="error-message">
          <Badge variant="error" showLabel={true}>Erro</Badge>
          {error.details || error.message}
        </div>
      )}

      {selectedRate ? (
        <div className="edit-section">
          <RateEditForm
          rate={selectedRate}
          onCancel={() => setSelectedRate(null)}
          onSave={async (currencyCode, buyRate, sellRate) => {
            const success = await handleUpdateRates(currencyCode, buyRate, sellRate);
            if (success) {
              toast.success(`Taxa ${currencyCode} atualizada com sucesso!`);
              setSelectedRate(null);
            }
          }}
        />
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            Spread atual: 
            <Badge 
              variant={currentSpread > 5 ? 'warning' : 'success'} 
              showLabel={true}
              style={{ marginLeft: '0.5rem' }}
            >
              {currentSpread}%
            </Badge>
          </div>
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
