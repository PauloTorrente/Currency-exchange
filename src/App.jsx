import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminExchangePage from './pages/AdminExchangePage';
import { AuthProvider } from './context/AuthContext';
import styled from 'styled-components';

const ThemeWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ThemeWrapper>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<AdminExchangePage />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeWrapper>
    </ThemeProvider>
  );
}

export default App;