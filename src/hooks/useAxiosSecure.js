import { useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { useAuth } from '../context/AuthContext';

const useAxiosSecure = () => {
  const { logout } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, [logout]);

  return axiosInstance;
};

export default useAxiosSecure;
