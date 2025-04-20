import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';  
import { useNavigate } from 'react-router-dom';

const Container = styled(motion.div)`
  min-height: 100vh;
  background-color: #0f172a;  /* Fundo escuro */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  flex-direction: column;
`;

const Card = styled(motion.div)`
  background: #1e293b;  /* Card com fundo mais claro */
  border-radius: 16px;
  padding: 3rem 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.3);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0px 0px 35px rgba(0, 0, 0, 0.4);
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  margin-bottom: 2rem;
`;

export default function LandingPage() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate('/login');  // Navegar para a página de login
  };

  return (
    <Container
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Title>CurrencyXchange</Title>
        <Subtitle>
          Sistema de câmbio inteligente e fácil de usar. Acesse e atualize suas taxas sem complicação.
        </Subtitle>
        <Button onClick={handleEnter}>Entrar no sistema</Button>
      </Card>
    </Container>
  );
}
