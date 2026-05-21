import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FiMapPin, FiCalendar, FiDollarSign, FiHeart, FiX,
  FiShield, FiActivity, FiUser, FiMail, FiArrowLeft
} from 'react-icons/fi';

const PetDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/pets/${id}`);
      return data.pet;
    },
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const adoptMutation = useMutation({
    mutationFn: (formData) => axiosInstance.post('/requests', formData),
    onSuccess: () => {
      toast.success('🎉 Adoption request submitted successfully!');
      setShowForm(false);
      reset();
      queryClient.invalidateQueries(['my-requests']);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit request.');
    },
  });

  const onSubmit = (formData) => {
    adoptMutation.mutate({
      petId: data._id,
      petName: data.petName,
      pickupDate: formData.pickupDate,
      message: formData.message,
    });
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 text-lg mb-4">Pet not found.</p>
        <button onClick={() => navigate('/pets')} className="btn-primary">Back to Pets</button>
      </div>
    </div>
  );

  const isOwner = user?.email === data.ownerEmail;
  const isAdopted = data.status === 'adopted';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors"
        >
          <FiArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Image & Basic Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="card overflow-hidden">
              <div className="relative">
                <img
                  src={data.image}
                  alt={data.petName}
                  className="w-full h-80 lg:h-96 object-cover"
                  onError={(e) => { e.target.src = 'https://placehold.co/800x500?text=Pet+Photo'; }}
                />
                {isAdopted && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-green-500 text-white text-xl font-bold px-6 py-2 rounded-full">
                      ✓ Already Adopted
                    </span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge bg-white/90 text-gray-800 backdrop-blur-sm font-medium shadow">{data.species}</span>
                  <span className="badge bg-primary-600 text-white shadow">${data.adoptionFee} fee</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">{data.petName}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{data.breed} · {data.gender} · {data.age} year{data.age !== 1 ? 's' : ''} old</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: <FiMapPin size={15} />, label: 'Location', value: data.location },
                    { icon: <FiShield size={15} />, label: 'Vaccination', value: data.vaccinationStatus },
                    { icon: <FiActivity size={15} />, label: 'Health', value: data.healthStatus },
                    { icon: <FiDollarSign size={15} />, label: 'Adoption Fee', value: `$${data.adoptionFee}` },
                  ].map(item => (
                    <div key={item.label} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-primary-500 mb-1">
                        {item.icon}
                        <span className="text-xs text-gray-400 dark:text-gray-500">{item.label}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">About {data.petName}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{data.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Owner Info + Adoption Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Owner Card */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FiUser size={16} className="text-primary-500" /> Owner / Shelter
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.ownerName)}&background=c026d3&color=fff`}
                  className="w-10 h-10 rounded-full"
                  alt={data.ownerName}
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">{data.ownerName}</p>
                  <p className="text-xs text-gray-400">{data.ownerEmail}</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Listed on {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            {/* Adoption Section */}
            {isOwner ? (
              <div className="card p-5 border-2 border-orange-100 dark:border-orange-900/30">
                <p className="text-orange-600 dark:text-orange-400 text-sm font-medium text-center">
                  ⚠ You are the owner of this listing and cannot submit an adoption request.
                </p>
              </div>
            ) : isAdopted ? (
              <div className="card p-5 border-2 border-green-100 dark:border-green-900/30">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium text-center">
                  ✓ This pet has already found a loving home!
                </p>
              </div>
            ) : (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Interested in {data.petName}?</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Submit an adoption request below.</p>

                {!showForm ? (
                  <button
                    onClick={() => setShowForm(true)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FiHeart size={16} /> Submit Adoption Request
                  </button>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Pet Name</label>
                      <input value={data.petName} disabled className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Your Name</label>
                      <input value={user?.displayName || ''} disabled className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Your Email</label>
                      <input value={user?.email || ''} disabled className="input-field bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Pickup Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('pickupDate', { required: 'Pickup date is required' })}
                        className="input-field text-sm"
                      />
                      {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Tell the owner why you'd be a great match..."
                        {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'At least 20 characters' } })}
                        className="input-field text-sm resize-none"
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="flex-1 btn-secondary text-sm py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={adoptMutation.isPending}
                        className="flex-1 btn-primary text-sm py-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {adoptMutation.isPending ? 'Submitting...' : 'Adopt 🐾'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetDetails;
/ /   P e t   D e t a i l s  
 