import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import { FiPlusCircle } from 'react-icons/fi';

const SPECIES = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Fish', 'Hamster', 'Other'];
const VACCINATION = ['Vaccinated', 'Not Vaccinated', 'Partially Vaccinated'];

const AddPet = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => axiosInstance.post('/pets', data),
    onSuccess: () => {
      toast.success('Pet listed successfully! 🐾');
      reset();
      navigate('/dashboard/my-listings');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add pet.');
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({ ...data, age: Number(data.age), adoptionFee: Number(data.adoptionFee) });
  };

  const inputClass = 'input-field text-sm';
  const labelClass = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5';
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">Add a Pet for Adoption</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in the details to list your pet.</p>
      </div>

      <div className="card p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Pet Name */}
            <div>
              <label className={labelClass}>Pet Name *</label>
              <input {...register('petName', { required: 'Required' })} placeholder="e.g. Buddy" className={inputClass} />
              {errors.petName && <p className={errorClass}>{errors.petName.message}</p>}
            </div>

            {/* Species */}
            <div>
              <label className={labelClass}>Species *</label>
              <select {...register('species', { required: 'Required' })} className={inputClass}>
                <option value="">Select species</option>
                {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.species && <p className={errorClass}>{errors.species.message}</p>}
            </div>

            {/* Breed */}
            <div>
              <label className={labelClass}>Breed *</label>
              <input {...register('breed', { required: 'Required' })} placeholder="e.g. Labrador" className={inputClass} />
              {errors.breed && <p className={errorClass}>{errors.breed.message}</p>}
            </div>

            {/* Age */}
            <div>
              <label className={labelClass}>Age (years) *</label>
              <input type="number" step="0.5" min="0" {...register('age', { required: 'Required', min: { value: 0, message: 'Invalid age' } })} placeholder="e.g. 2" className={inputClass} />
              {errors.age && <p className={errorClass}>{errors.age.message}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className={labelClass}>Gender *</label>
              <select {...register('gender', { required: 'Required' })} className={inputClass}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
            </div>

            {/* Health Status */}
            <div>
              <label className={labelClass}>Health Status *</label>
              <input {...register('healthStatus', { required: 'Required' })} placeholder="e.g. Excellent, Needs care" className={inputClass} />
              {errors.healthStatus && <p className={errorClass}>{errors.healthStatus.message}</p>}
            </div>

            {/* Vaccination */}
            <div>
              <label className={labelClass}>Vaccination Status *</label>
              <select {...register('vaccinationStatus', { required: 'Required' })} className={inputClass}>
                <option value="">Select status</option>
                {VACCINATION.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              {errors.vaccinationStatus && <p className={errorClass}>{errors.vaccinationStatus.message}</p>}
            </div>

            {/* Location */}
            <div>
              <label className={labelClass}>Location *</label>
              <input {...register('location', { required: 'Required' })} placeholder="e.g. New York, NY" className={inputClass} />
              {errors.location && <p className={errorClass}>{errors.location.message}</p>}
            </div>

            {/* Adoption Fee */}
            <div>
              <label className={labelClass}>Adoption Fee ($) *</label>
              <input type="number" min="0" {...register('adoptionFee', { required: 'Required', min: 0 })} placeholder="e.g. 50" className={inputClass} />
              {errors.adoptionFee && <p className={errorClass}>{errors.adoptionFee.message}</p>}
            </div>

            {/* Owner Email */}
            <div>
              <label className={labelClass}>Owner Email</label>
              <input value={user?.email || ''} disabled className={`${inputClass} bg-gray-50 dark:bg-gray-800 cursor-not-allowed`} />
            </div>
          </div>

          {/* Image URL - full width */}
          <div>
            <label className={labelClass}>Image URL *</label>
            <input
              {...register('image', { required: 'Image URL is required', pattern: { value: /^https?:\/\/.+/, message: 'Must be a valid URL' } })}
              placeholder="https://i.ibb.co/your-image.jpg"
              className={inputClass}
            />
            {errors.image && <p className={errorClass}>{errors.image.message}</p>}
            <p className="text-xs text-gray-400 mt-1">Upload image to <a href="https://imgbb.com" target="_blank" rel="noreferrer" className="text-primary-500 hover:underline">imgbb.com</a> and paste the link here.</p>
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description *</label>
            <textarea
              rows={4}
              {...register('description', { required: 'Required', minLength: { value: 30, message: 'At least 30 characters' } })}
              placeholder="Tell potential adopters about this pet's personality, habits, and what kind of home they need..."
              className={`${inputClass} resize-none`}
            />
            {errors.description && <p className={errorClass}>{errors.description.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <FiPlusCircle size={18} />
            {mutation.isPending ? 'Listing Pet...' : 'List This Pet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPet;
