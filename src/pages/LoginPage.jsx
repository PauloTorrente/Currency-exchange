import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../components/common/Button';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom'; 

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0f172a;
`;

const FormContainer = styled(motion.div)`
  background-color: #1e293b;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Title = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
`;

const InputField = styled.input`
  width: 100%;
  padding: 14px;
  margin-bottom: 16px;
  border-radius: 10px;
  border: 1px solid #94a3b8;
  font-size: 16px;
  transition: border 0.3s ease;

  &:focus {
    border-color: #ffffff;
    outline: none;
  }
`;

const SubText = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
`;

const LoginPage = () => {
  const { loginUser } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(email, password);
      navigate('/dashboard');
    } catch (error) {
      let errorMessage = 'Erro ao fazer login!';
      
      if (error.response?.status === 401) {
        errorMessage = 'Credenciais inválidas. Tente novamente.';
      } else if (error.message.includes('network') || error.message.includes('Network')) {
        errorMessage = 'Problema de conexão. Verifique sua internet.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormWrapper>
      <FormContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Title>Bem-vindo de volta!</Title>
        {error && <div style={{ color: '#ff4444', marginBottom: '16px' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />
          <InputField
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </Button>
        </form>
      </FormContainer>
    </FormWrapper>
  );
};

export default LoginPage;
