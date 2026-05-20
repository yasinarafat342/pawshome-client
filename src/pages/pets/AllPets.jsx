import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import PetCard from '../../components/pets/PetCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { FiSearch, FiFilter, FiChevronDown } from 'react-icons/fi';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Other'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'fee_asc', label: 'Fee: Low to High' },
  { value: 'fee_desc', label: 'Fee: High to Low' },
  { value: 'age_asc', label: 'Age: Young First' },
];

const AllPets = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSpecies, setSelectedSpecies] = useState(
    searchParams.get('species') ? [searchParams.get('species')] : []
  );
  const [sort, setSort] = useState('newest');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['all-pets', debouncedSearch, selectedSpecies, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedSpecies.length) params.set('species', selectedSpecies.join(','));
      if (sort) params.set('sort', sort);
      const { data } = await axiosInstance.get(`/pets?${params.toString()}`);
      return data;
    },
  });

  const toggleSpecies = (sp) => {
    setSelectedSpecies(prev =>
      prev.includes(sp) ? prev.filter(s => s !== sp) : [...prev, sp]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="section-title mb-2">All Pets for Adoption</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {data?.total ?? '...'} pets available · Find your perfect match
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by pet name..."
                className="input-field pl-9"
              />
            </div>

            {/* Sort */}
            <div className="relative w-full md:w-52">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field appearance-none pr-8 cursor-pointer"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Species Filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1 mr-1">
              <FiFilter size={12} /> Species:
            </span>
            {SPECIES.map(sp => (
              <button
                key={sp}
                onClick={() => toggleSpecies(sp)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedSpecies.includes(sp)
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400'
                }`}
              >
                {sp}
              </button>
            ))}
            {selectedSpecies.length > 0 && (
              <button
                onClick={() => setSelectedSpecies([])}
                className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Clear filters ×
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner fullScreen={false} />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">Failed to load pets. Please try again.</p>
          </div>
        ) : data?.pets?.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🐾</span>
            <h3 className="font-display font-semibold text-xl text-gray-700 dark:text-gray-300 mb-2">No pets found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.pets?.map(pet => <PetCard key={pet._id} pet={pet} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPets;
