import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import {
  FiGrid, FiPlusCircle, FiList, FiHeart,
  FiLogOut, FiMenu, FiX, FiSun, FiMoon, FiHome
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const sidebarLinks = [
  { to: '/dashboard/my-requests', icon: <FiHeart size={18} />, label: 'My Requests' },
  { to: '/dashboard/add-pet', icon: <FiPlusCircle size={18} />, label: 'Add Pet' },
  { to: '/dashboard/my-listings', icon: <FiList size={18} />, label: 'My Listings' },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out!');
      navigate('/');
    } catch {
      toast.error('Logout failed.');
    }
  };

  const Sidebar = () => (
    <aside className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800">
      {/* Logo */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🐾</span>
          <span className="font-display font-bold text-lg text-primary-700 dark:text-primary-400">PawsHome</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=c026d3&color=fff`}
            alt={user?.displayName}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary-200"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.displayName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-1 border-t border-gray-100 dark:border-gray-800">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <FiHome size={18} /> Back to Home
        </Link>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <FiLogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 fixed inset-y-0 left-0 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
            <FiMenu size={20} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <span>🐾</span>
            <span className="font-display font-bold text-primary-700 dark:text-primary-400">PawsHome</span>
          </Link>
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=c026d3&color=fff`}
            className="w-8 h-8 rounded-full"
            alt={user?.displayName}
          />
        </div>

        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
