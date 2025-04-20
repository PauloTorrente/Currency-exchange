import axios from '../api/axiosInstance';

const getAllRates = async () => {
  try {
    const response = await axios.get('/exchange');
    return response.data.map(rate => ({
      ...rate,
      spread: parseFloat(rate.spread || ((rate.sell_rate - rate.buy_rate) / rate.buy_rate * 100).toFixed(2)),
      mid_rate: parseFloat(rate.mid_rate || ((parseFloat(rate.buy_rate) + parseFloat(rate.sell_rate)) / 2)),
      buy_rate: parseFloat(rate.buy_rate),
      sell_rate: parseFloat(rate.sell_rate)
    }));
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao carregar taxas de câmbio');
  }
};

const getRate = async (currencyCode) => {
  try {
    const response = await axios.get(`/exchange/${currencyCode}`);
    const rate = response.data;
    return {
      ...rate,
      spread: parseFloat(rate.spread || ((rate.sell_rate - rate.buy_rate) / rate.buy_rate * 100).toFixed(2)),
      mid_rate: parseFloat(rate.mid_rate || ((parseFloat(rate.buy_rate) + parseFloat(rate.sell_rate)) / 2)),
      buy_rate: parseFloat(rate.buy_rate),
      sell_rate: parseFloat(rate.sell_rate)
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao carregar taxa específica');
  }
};

const updateRate = async (currencyCode, { buy_rate, sell_rate }) => {
  try {
    const response = await axios.put(`/exchange/${currencyCode}`, {
      buy_rate: buy_rate.toString(), // Garante envio como string
      sell_rate: sell_rate.toString()
    });
    
    // Calcula os valores derivados
    const buyNum = parseFloat(buy_rate);
    const sellNum = parseFloat(sell_rate);
    const spread = ((sellNum - buyNum) / buyNum * 100).toFixed(2);
    const mid_rate = ((buyNum + sellNum) / 2).toFixed(6);
    
    return {
      ...response.data,
      buy_rate: buyNum,
      sell_rate: sellNum,
      spread: parseFloat(spread),
      mid_rate: parseFloat(mid_rate),
      last_updated: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar taxa');
  }
};

const addCurrency = async (currencyData) => {
  try {
    const response = await axios.post('/exchange', {
      ...currencyData,
      buy_rate: parseFloat(currencyData.buy_rate),
      sell_rate: parseFloat(currencyData.sell_rate)
    });
    return {
      ...response.data,
      spread: parseFloat(((currencyData.sell_rate - currencyData.buy_rate) / currencyData.buy_rate * 100).toFixed(2)),
      mid_rate: parseFloat((parseFloat(currencyData.buy_rate) + parseFloat(currencyData.sell_rate)) / 2)
    };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao adicionar moeda');
  }
};

const deleteCurrency = async (currencyCode) => {
  try {
    await axios.delete(`/exchange/${currencyCode}`);
    return { success: true, message: `Moeda ${currencyCode} removida com sucesso` };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao remover moeda');
  }
};

export default {
  getAllRates,
  getRate,
  updateRate,
  addCurrency,
  deleteCurrency
};
