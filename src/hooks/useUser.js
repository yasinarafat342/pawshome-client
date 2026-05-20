import { useAuth } from '../context/AuthContext';

const useUser = () => {
  const { user, loading } = useAuth();

  return {
    user,
    loading,
    isLoggedIn: !!user,
    userEmail: user?.email || null,
    userName: user?.displayName || null,
    userPhoto: user?.photoURL || null,
  };
};

export default useUser;
