import { useState, useEffect, useCallback } from 'react';
import exchangeService from '../services/exchangeService';

const useExchangeOperations = () => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExchangeRates = useCallback(async () => {
    try {
      setIsLoading(true);
      const rates = await exchangeService.getAllRates();
      setExchangeRates(rates);
      setError(null);
    } catch (err) {
      setError({
        message: 'Falha ao carregar taxas de câmbio',
        details: err.response?.data?.message || err.message
      });
      setExchangeRates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateRates = useCallback(async (currencyCode, buyRate, sellRate) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Validações e formatação
      const buy = parseFloat(buyRate);
      const sell = parseFloat(sellRate);
      
      if (isNaN(buy) || isNaN(sell)) {
        throw new Error('Valores devem ser números válidos');
      }

      if (sell <= buy) {
        throw new Error('Taxa de venda deve ser maior que taxa de compra');
      }

      const spread = ((sell - buy) / buy * 100).toFixed(2);
      if (spread > 10) {
        throw new Error(`Spread máximo de 10% excedido: ${spread}%`);
      }

      // Formata para 6 casas decimais antes de enviar
      const formattedBuy = buy.toFixed(6);
      const formattedSell = sell.toFixed(6);

      const updatedRate = await exchangeService.updateRate(currencyCode, { 
        buy_rate: formattedBuy,
        sell_rate: formattedSell 
      });

      // Atualiza o estado local com os dados formatados
      setExchangeRates(prev => 
        prev.map(rate => 
          rate.currency_code === currencyCode 
            ? { 
                ...updatedRate,
                buy_rate: parseFloat(formattedBuy),
                sell_rate: parseFloat(formattedSell),
                spread: parseFloat(spread),
                last_updated: new Date().toISOString()
              } 
            : rate
        )
      );
      
      return true;
    } catch (err) {
      setError({
        message: 'Falha ao atualizar taxas',
        details: err.response?.data?.message || err.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  return {
    exchangeRates,
    isLoading,
    error,
    fetchExchangeRates,
    handleUpdateRates
  };
};

export default useExchangeOperations;