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
      
      const formattedRates = rates.map(rate => ({
        ...rate,
        mid_rate: ((parseFloat(rate.buy_rate)) + parseFloat(rate.sell_rate)) / 2
      }));
      
      setExchangeRates(formattedRates);
      setError(null);
    } catch (err) {
      setError({
        message: 'Failed to fetch exchange rates',
        details: err.response?.data?.message || err.message
      });
      setExchangeRates([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdateRates = useCallback(async (currencyCode, rateData) => {
    try {
      setIsLoading(true);
      const { buy_rate, sell_rate, bank_fee, platform_fee, spread } = rateData;

      const buyRate = parseFloat(buy_rate);
      const sellRate = parseFloat(sell_rate);
      const bankFee = parseFloat(bank_fee || 0.01);
      const platformFee = parseFloat(platform_fee || 0.01);
      const newSpread = parseFloat(spread || 0.05);

      if (buyRate <= sellRate) {
        throw new Error('Buy rate must be greater than sell rate');
      }

      if (bankFee < 0 || bankFee > 0.1) { // Max 10% bank fee
        throw new Error('Bank fee must be between 0% and 10%');
      }

      if (newSpread > 0.1) { // Max 10% spread
        throw new Error('Spread cannot exceed 10%');
      }

      const calculatedSpread = ((buyRate - sellRate) / sellRate);
      if (Math.abs(calculatedSpread - newSpread) > 0.001) {
        throw new Error('Spread does not match rate difference');
      }

      const updatePayload = {
        buy_rate: buyRate.toFixed(6),
        sell_rate: sellRate.toFixed(6),
        bank_fee: bankFee.toFixed(4),
        platform_fee: platformFee.toFixed(4),
        spread: newSpread.toFixed(4)
      };

      setExchangeRates(prev => 
        prev.map(rate => 
          rate.currency_code === currencyCode ? {
            ...rate,
            ...updatePayload,
            mid_rate: (buyRate + sellRate) / 2,
            last_updated: new Date().toISOString()
          } : rate
        )
      );

      // API call
      const updatedRate = await exchangeService.updateRate(currencyCode, updatePayload);
      
      // Final update with server data
      setExchangeRates(prev => 
        prev.map(rate => 
          rate.currency_code === currencyCode ? {
            ...updatedRate,
            mid_rate: (parseFloat(updatedRate.buy_rate) + parseFloat(updatedRate.sell_rate)) / 2
          } : rate
        )
      );

      return true;
    } catch (err) {
      // Revert optimistic update on error
      fetchExchangeRates();
      setError({
        message: 'Failed to update rates',
        details: err.response?.data?.message || err.message
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchExchangeRates]);

  const convertCurrency = useCallback(async (from, to, amount) => {
    try {
      setIsLoading(true);
      const result = await exchangeService.convert(from, to, amount);

      console.log(`Conversion: ${amount} ${from} → ${result.finalAmount} ${to}`);
      
      return {
        success: true,
        data: result
      };
    } catch (err) {
      setError({
        message: 'Conversion failed',
        details: err.response?.data?.message || err.message
      });
      return {
        success: false,
        error: err
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  return {
    exchangeRates,
    isLoading,
    error,
    fetchExchangeRates,
    handleUpdateRates,
    convertCurrency,
    resetError: () => setError(null)
  };
};

export default useExchangeOperations;
