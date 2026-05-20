const LoadingSpinner = ({ fullScreen = true }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-600 animate-spin"></div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center py-12">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-3 border-primary-100"></div>
        <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-primary-600 animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
