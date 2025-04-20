import axios from '../api/axiosInstance';

export const login = async (email, password) => {
  try {
    const response = await axios.post('/users/login', {
      email,
      password
    });

    if (response.data && response.data.token && response.data.user) {
      return {
        token: response.data.token,
        user: response.data.user
      };
    }
    throw new Error('Resposta inválida do servidor');
  } catch (error) {
    console.error('Erro no login:', error);
    throw new Error(error.response?.data?.message || 'Falha no login');
  }
};




export default {login};