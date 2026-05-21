import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import {
  FiEdit2, FiTrash2, FiEye, FiUsers, FiX,
  FiCheckCircle, FiXCircle, FiPackage, FiCheck
} from 'react-icons/fi';

// ---- Requests Modal ----
const RequestsModal = ({ petId, petName, onClose }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['pet-requests', petId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/requests/pet/${petId}`);
      return data.requests;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (requestId) => axiosInstance.patch(`/requests/${requestId}/approve`),
    onSuccess: () => {
      toast.success('Request approved! Pet is now adopted 🎉');
      queryClient.invalidateQueries(['pet-requests', petId]);
      queryClient.invalidateQueries(['my-listings']);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve.'),
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId) => axiosInstance.patch(`/requests/${requestId}/reject`),
    onSuccess: () => {
      toast.success('Request rejected.');
      queryClient.invalidateQueries(['pet-requests', petId]);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reject.'),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
              Adoption Requests
            </h2>
            <p className="text-sm text-gray-400">{petName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <FiX size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {isLoading ? (
            <LoadingSpinner fullScreen={false} />
          ) : data?.length === 0 ? (
            <div className="text-center py-12">
              <FiUsers size={36} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No requests yet for this pet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.map((req) => (
                <div
                  key={req._id}
                  className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(req.requesterName)}&background=c026d3&color=fff&size=32`}
                          className="w-8 h-8 rounded-full"
                          alt={req.requesterName}
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{req.requesterName}</p>
                          <p className="text-xs text-gray-400">{req.requesterEmail}</p>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div>
                          <span className="font-medium">Requested:</span>{' '}
                          {new Date(req.createdAt).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Pickup:</span>{' '}
                          {new Date(req.pickupDate).toLocaleDateString()}
                        </div>
                      </div>
                      {req.message && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic bg-gray-50 dark:bg-gray-800 rounded-lg p-2">
                          "{req.message}"
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {/* Status Badge */}
                      <span className={`badge text-xs ${
                        req.status === 'pending' ? 'status-pending' :
                        req.status === 'approved' ? 'status-approved' : 'status-rejected'
                      }`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </span>

                      {/* Action Buttons - only for pending */}
                      {req.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveMutation.mutate(req._id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                          >
                            <FiCheck size={13} /> Approve
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(req._id)}
                            disabled={approveMutation.isPending || rejectMutation.isPending}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg text-xs font-medium transition-colors disabled:opacity-60"
                          >
                            <FiX size={13} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ---- Delete Confirm Modal ----
const DeleteModal = ({ pet, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
      <div className="text-center mb-5">
        <span className="text-5xl block mb-3">🗑️</span>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">Delete Pet Listing</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to delete <strong>{pet.petName}</strong>? This action cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60"
        >
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ---- Main Component ----
const MyListings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [requestsModal, setRequestsModal] = useState(null); // { petId, petName }
  const [deleteModal, setDeleteModal] = useState(null); // pet object

  const { data, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/pets/my-listings');
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (petId) => axiosInstance.delete(`/pets/${petId}`),
    onSuccess: () => {
      toast.success('Pet listing deleted.');
      queryClient.invalidateQueries(['my-listings']);
      setDeleteModal(null);
    },
    onError: () => toast.error('Failed to delete.'),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const stats = data?.stats || { totalListings: 0, available: 0, adopted: 0 };
  const pets = data?.pets || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">My Pet Listings</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your listed pets and handle adoption requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Listings', value: stats.totalListings, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
          { label: 'Available', value: stats.available, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
          { label: 'Adopted', value: stats.adopted, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-display font-bold">{s.value}</p>
            <p className="text-xs font-medium mt-1 opacity-75">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <FiPackage size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">No listings yet</h3>
          <p className="text-sm text-gray-400 mb-4">Start listing pets for adoption.</p>
          <Link to="/dashboard/add-pet" className="btn-primary inline-block">
            Add Your First Pet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {pets.map((pet) => (
            <div key={pet._id} className="card group">
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={pet.image}
                  alt={pet.petName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Pet'; }}
                />
                <div className="absolute top-3 left-3">
                  <span className={`badge text-xs font-medium shadow ${
                    pet.status === 'available'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-white'
                  }`}>
                    {pet.status === 'available' ? '● Available' : '✓ Adopted'}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="badge bg-primary-600 text-white text-xs shadow">${pet.adoptionFee}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-display font-bold text-gray-900 dark:text-white mb-1">{pet.petName}</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">{pet.species} · {pet.breed} · {pet.gender}</p>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRequestsModal({ petId: pet._id, petName: pet.petName })}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    <FiUsers size={13} /> Requests
                  </button>
                  <Link
                    to={`/pets/${pet._id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    <FiEye size={13} /> View
                  </Link>
                  <Link
                    to={`/dashboard/update-pet/${pet._id}`}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    <FiEdit2 size={13} /> Edit
                  </Link>
                  <button
                    onClick={() => setDeleteModal(pet)}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    <FiTrash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {requestsModal && (
        <RequestsModal
          petId={requestsModal.petId}
          petName={requestsModal.petName}
          onClose={() => setRequestsModal(null)}
        />
      )}

      {deleteModal && (
        <DeleteModal
          pet={deleteModal}
          onClose={() => setDeleteModal(null)}
          onConfirm={() => deleteMutation.mutate(deleteModal._id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default MyListings;
/ /   M y   L i s t i n g s  
 