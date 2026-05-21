import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../utils/axiosInstance';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiEye, FiTrash2, FiCalendar, FiClock, FiHeart } from 'react-icons/fi';

// Cancel Confirm Modal
const CancelModal = ({ request, onClose, onConfirm, isLoading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-slide-up">
      <div className="text-center mb-5">
        <span className="text-5xl block mb-3">❌</span>
        <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2">Cancel Request</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cancel your adoption request for <strong>{request.petName}</strong>? This cannot be undone.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 btn-secondary">Keep</button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-60"
        >
          {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
        </button>
      </div>
    </div>
  </div>
);

const MyRequests = () => {
  const queryClient = useQueryClient();
  const [cancelModal, setCancelModal] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['my-requests'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/requests/my-requests');
      return data.requests;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (requestId) => axiosInstance.delete(`/requests/${requestId}`),
    onSuccess: () => {
      toast.success('Request cancelled.');
      queryClient.invalidateQueries(['my-requests']);
      setCancelModal(null);
    },
    onError: () => toast.error('Failed to cancel request.'),
  });

  if (isLoading) return <LoadingSpinner fullScreen={false} />;

  const statusConfig = {
    pending: { label: 'Pending', class: 'status-pending' },
    approved: { label: 'Approved ✓', class: 'status-approved' },
    rejected: { label: 'Rejected', class: 'status-rejected' },
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-1">My Adoption Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Track the status of your adoption requests.</p>
      </div>

      {/* Summary */}
      {data && data.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total', value: data.length, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' },
            { label: 'Pending', value: data.filter(r => r.status === 'pending').length, color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400' },
            { label: 'Approved', value: data.filter(r => r.status === 'approved').length, color: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${s.color}`}>
              <p className="text-2xl font-display font-bold">{s.value}</p>
              <p className="text-xs font-medium mt-1 opacity-75">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Requests List */}
      {data?.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
          <FiHeart size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-500 dark:text-gray-400 mb-2">No requests yet</h3>
          <p className="text-sm text-gray-400 mb-4">Browse pets and submit adoption requests.</p>
          <Link to="/pets" className="btn-primary inline-block">
            Browse Pets
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((req) => (
            <div
              key={req._id}
              className="card p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Pet Image */}
              {req.petId?.image && (
                <img
                  src={req.petId.image}
                  alt={req.petName}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Pet'; }}
                />
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{req.petName}</h3>
                  <span className={`badge text-xs ${statusConfig[req.status]?.class}`}>
                    {statusConfig[req.status]?.label}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <FiClock size={11} />
                    Requested: {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar size={11} />
                    Pickup: {new Date(req.pickupDate).toLocaleDateString()}
                  </span>
                </div>
                {req.status === 'approved' && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1.5 font-medium">
                    🎉 Congratulations! Your request has been approved. Get ready to welcome your new pet!
                  </p>
                )}
                {req.status === 'rejected' && (
                  <p className="text-xs text-red-500 dark:text-red-400 mt-1.5">
                    This request was not approved. Try applying for other pets.
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  to={`/pets/${req.petId?._id || req.petId}`}
                  className="flex items-center gap-1.5 py-2 px-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl text-xs font-medium transition-colors"
                >
                  <FiEye size={13} /> View
                </Link>
                {req.status === 'pending' && (
                  <button
                    onClick={() => setCancelModal(req)}
                    className="flex items-center gap-1.5 py-2 px-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl text-xs font-medium transition-colors"
                  >
                    <FiTrash2 size={13} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelModal && (
        <CancelModal
          request={cancelModal}
          onClose={() => setCancelModal(null)}
          onConfirm={() => cancelMutation.mutate(cancelModal._id)}
          isLoading={cancelMutation.isPending}
        />
      )}
    </div>
  );
};

export default MyRequests;
