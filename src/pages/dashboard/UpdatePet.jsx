import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Other'];
const VACCINATION = ['Vaccinated', 'Not Vaccinated', 'Partially Vaccinated'];

const UpdatePet = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/pets/${id}`);
      return data.pet;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Pre-fill form when pet data loads
  useEffect(() => {
    if (pet) {
      reset({
        petName: pet.petName,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        gender: pet.gender,
        image: pet.image,
        healthStatus: pet.healthStatus,
        vaccinationStatus: pet.vaccinationStatus,
        location: pet.location,
        adoptionFee: pet.adoptionFee,
        description: pet.description,
      });
    }
  }, [pet, reset]);

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.put(`/pets/${id}`, data),
    onSuccess: () => {
      toast.success('Pet updated successfully! 🐾');
      queryClient.invalidateQueries(['my-listings']);
      queryClient.invalidateQueries(['pet', id]);
      navigate('/dashboard/my-listings');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update pet.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, age: Number(data.age), adoptionFee: Number(data.adoptionFee) });
  };

  if (isLoading) return <LoadingSpinner fullScreen={false} />;
  if (!pet) return <div className="text-center py-10 text-gray-400">Pet not found.</div>;

  // Verify ownership
  if (pet.ownerEmail !== user?.email) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">You are not authorized to edit this listing.</p>
        <button onClick={() => navigate('/dashboard/my-listings')} className="btn-primary">
          Back to My Listings
        </button>
      </div>
    );
  }

  const inputClass = 'input-field text-sm';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/dashboard/my-listings')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
        >
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Update Pet Listing</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Edit the details for <strong>{pet.petName}</strong></p>
        </div>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Pet Name *</label>
              <input {...register('petName', { required: 'Required' })} className={inputClass} />
              {errors.petName && <p className={errorClass}>{errors.petName.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Species *</label>
              <select {...register('species', { required: 'Required' })} className={inputClass}>
                {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.species && <p className={errorClass}>{errors.species.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Breed *</label>
              <input {...register('breed', { required: 'Required' })} className={inputClass} />
              {errors.breed && <p className={errorClass}>{errors.breed.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Age (years) *</label>
              <input type="number" step="0.5" min="0" {...register('age', { required: 'Required' })} className={inputClass} />
              {errors.age && <p className={errorClass}>{errors.age.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Gender *</label>
              <select {...register('gender', { required: 'Required' })} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Health Status *</label>
              <input {...register('healthStatus', { required: 'Required' })} className={inputClass} />
              {errors.healthStatus && <p className={errorClass}>{errors.healthStatus.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Vaccination Status *</label>
              <select {...register('vaccinationStatus', { required: 'Required' })} className={inputClass}>
                {VACCINATION.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.vaccinationStatus && <p className={errorClass}>{errors.vaccinationStatus.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Location *</label>
              <input {...register('location', { required: 'Required' })} className={inputClass} />
              {errors.location && <p className={errorClass}>{errors.location.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Adoption Fee ($) *</label>
              <input type="number" min="0" {...register('adoptionFee', { required: 'Required' })} className={inputClass} />
              {errors.adoptionFee && <p className={errorClass}>{errors.adoptionFee.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Owner Email</label>
              <input value={user?.email || ''} disabled className={`${inputClass} bg-gray-50 dark:bg-gray-800 cursor-not-allowed`} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Image URL *</label>
            <input
              {...register('image', { required: 'Required', pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' } })}
              className={inputClass}
            />
            {errors.image && <p className={errorClass}>{errors.image.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              rows={4}
              {...register('description', { required: 'Required', minLength: { value: 30, message: 'At least 30 characters' } })}
              className={`${inputClass} resize-none`}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FiSave size={18} />
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePet;
/ /   U p d a t e   P e t  
 