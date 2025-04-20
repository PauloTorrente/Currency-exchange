import { useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const { authData, loginUser, logoutUser } = useAuthContext();
  
  return {
    isAuthenticated: authData.isAuthenticated,
    role: authData.role,
    user: authData.user,
    isLoading: authData.isLoading,
    loginUser,
    logoutUser
  };
};

export default useAuth;