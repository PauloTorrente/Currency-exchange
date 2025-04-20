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
      setError(err);
      setExchangeRates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateRates = useCallback(async (currencyCode, buyRate, sellRate, spread) => {
    try {
      setIsLoading(true);
      
      const buy = parseFloat(buyRate);
      const sell = parseFloat(sellRate);
      const spreadValue = parseFloat(spread);

      // Validações reforçadas
      if (buy >= sell) {
        throw new Error('A taxa de venda deve ser maior que a taxa de compra');
      }

      const calculatedSpread = ((sell - buy) / buy * 100).toFixed(2);
      if (Math.abs(spreadValue - calculatedSpread) > 0.01) {
        throw new Error('Spread inconsistente com as taxas informadas');
      }

      const updated = await exchangeService.updateRate(currencyCode, {
        buy_rate: buy.toFixed(6),
        sell_rate: sell.toFixed(6)
      });

      setExchangeRates(prev => 
        prev.map(rate => 
          rate.currency_code === currencyCode ? {
            ...updated,
            spread: spreadValue,
            last_updated: new Date().toISOString()
          } : rate
        )
      );
      
      return true;
    } catch (err) {
      setError(err);
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
