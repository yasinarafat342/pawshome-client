import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';

const usePets = (filters = {}) => {
  const { search = '', species = [], sort = 'newest' } = filters;

  return useQuery({
    queryKey: ['pets', search, species, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (species.length) params.set('species', species.join(','));
      if (sort) params.set('sort', sort);
      const { data } = await axiosInstance.get(`/pets?${params.toString()}`);
      return data;
    },
  });
};

export default usePets;
