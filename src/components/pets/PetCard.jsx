import { Link } from 'react-router-dom';
import { FiMapPin, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const speciesEmoji = {
  Dog: '🐕', Cat: '🐈', Bird: '🦜', Rabbit: '🐇',
  Fish: '🐟', Hamster: '🐹', Other: '🐾'
};

const PetCard = ({ pet }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAdoptClick = () => {
    if (!user) {
      toast.error('Please login to adopt a pet!');
      navigate('/login');
      return;
    }
    navigate(`/pets/${pet._id}`);
  };

  return (
    <div className="card group animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={pet.image}
          alt={pet.petName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300?text=Pet+Photo'; }}
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-gray-700 backdrop-blur-sm font-medium shadow-sm">
            {speciesEmoji[pet.species] || '🐾'} {pet.species}
          </span>
        </div>
        {pet.status === 'adopted' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-green-500 text-white px-4 py-1.5 rounded-full font-semibold text-sm">
              ✓ Adopted
            </span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="badge bg-primary-600 text-white shadow-md">
            ${pet.adoptionFee}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white">{pet.petName}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{pet.age} yr{pet.age !== 1 ? 's' : ''}</span>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{pet.breed} · {pet.gender}</p>

        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-4">
          <FiMapPin size={11} />
          <span>{pet.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`badge text-xs ${pet.vaccinationStatus === 'Vaccinated' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'}`}>
            {pet.vaccinationStatus === 'Vaccinated' ? '✓' : '⚠'} {pet.vaccinationStatus}
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Link
            to={`/pets/${pet._id}`}
            className="flex-1 text-center btn-secondary text-sm py-2"
          >
            View Details
          </Link>
          {pet.status === 'available' && (
            <button
              onClick={handleAdoptClick}
              className="flex-1 btn-primary text-sm py-2 flex items-center justify-center gap-1.5"
            >
              Adopt Now <FiArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetCard;
