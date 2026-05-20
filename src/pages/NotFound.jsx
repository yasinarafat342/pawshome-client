import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="text-center max-w-lg animate-slide-up">
        {/* Big 404 */}
        <div className="relative mb-6">
          <p className="font-display text-[150px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl animate-bounce-slow">🐾</span>
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Oops! Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Looks like this page ran away like a playful puppy! The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <FiArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
            <FiHome size={16} /> Back to Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-gray-400 dark:text-gray-600">
          Need help finding a pet?{' '}
          <Link to="/pets" className="text-primary-500 hover:underline">Browse all pets →</Link>
        </p>
      </div>
    </div>
  );
};

export default NotFound;
