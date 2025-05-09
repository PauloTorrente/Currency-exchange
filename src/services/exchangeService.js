import axios from '../api/axiosInstance';

const ExchangeService = {
  // Busca todas as taxas
  getAllRates: async () => {
    try {
      const response = await axios.get('/rates');
      return response.data.data.map(rate => ({
        ...rate,
        buy_rate: parseFloat(rate.buy_rate),
        sell_rate: parseFloat(rate.sell_rate),
        bank_fee: parseFloat(rate.bank_fee || 0.01), // Default 1%
        spread: parseFloat(rate.spread || 0.05),     // Default 5%
        mid_rate: parseFloat(rate.mid_rate || (parseFloat(rate.buy_rate) + parseFloat(rate.sell_rate)) / 2)
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Falha ao carregar taxas');
    }
  },

  // Busca taxa específica
  getRate: async (currencyCode) => {
    try {
      const response = await axios.get(`/rates/${currencyCode}`);
      const rate = response.data.data;
      return {
        ...rate,
        buy_rate: parseFloat(rate.buy_rate),
        sell_rate: parseFloat(rate.sell_rate),
        bank_fee: parseFloat(rate.bank_fee),
        spread: parseFloat(rate.spread),
        mid_rate: parseFloat(rate.mid_rate)
      };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Moeda não encontrada');
    }
  },

  // Conversão de moedas (BRL↔BOB via USDT)
  convert: async (from, to, amount, customRates = {}) => {
    try {
      const response = await axios.post('/rates/convert', {
        from: from.toUpperCase(),
        to: to.toUpperCase(),
        amount: parseFloat(amount),
        customRates: {
          bankFeeRate: customRates.bankFeeRate,
          platformFeeRate: customRates.platformFeeRate,
          spreadRate: customRates.spreadRate,
          exchangeRate: customRates.exchangeRate,
          targetExchangeRate: customRates.targetExchangeRate
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Falha na conversão');
    }
  },

  // Atualiza taxa (valida buy_rate > sell_rate)
  updateRate: async (currencyCode, { buy_rate, sell_rate, bank_fee, spread }) => {
    try {
      const response = await axios.put(`/rates/${currencyCode}`, {
        buy_rate: buy_rate.toString(),
        sell_rate: sell_rate.toString(),
        bank_fee: bank_fee?.toString(),
        spread: spread?.toString()
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erro ao atualizar. Verifique se sell_rate < buy_rate e spread ≤ 10%'
      );
    }
  },

  // Adiciona nova moeda
  addCurrency: async (currencyData) => {
    try {
      const response = await axios.post('/rates', {
        currency_code: currencyData.currency_code.toUpperCase(),
        currency_name: currencyData.currency_name,
        buy_rate: currencyData.buy_rate.toString(),
        sell_rate: currencyData.sell_rate.toString(),
        bank_fee: currencyData.bank_fee?.toString() || '0.0100',
        spread: currencyData.spread?.toString() || '0.0500',
        rate_type: currencyData.rate_type || 'fiat'
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Falha ao criar moeda');
    }
  },

  // Remove moeda (exceto USDT)
  deleteCurrency: async (currencyCode) => {
    try {
      await axios.delete(`/rates/${currencyCode}`);
      return { success: true, message: `Moeda ${currencyCode} removida` };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Não foi possível remover');
    }
  }
};

export default ExchangeService;
