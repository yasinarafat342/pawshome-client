import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🐾</span>
              <span className="font-display font-bold text-2xl text-white">PawsHome</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Connecting loving families with pets who need a home. Every pet deserves love.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-700 rounded-lg transition-colors">
                <FiFacebook size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-700 rounded-lg transition-colors">
                <FiTwitter size={16} />
              </a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-primary-700 rounded-lg transition-colors">
                <FiInstagram size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'All Pets', 'Login', 'Register'].map(item => (
                <li key={item}>
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pet Types */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Browse Pets</h4>
            <ul className="space-y-2">
              {['Dogs', 'Cats', 'Birds', 'Rabbits', 'Fish', 'Others'].map(type => (
                <li key={type}>
                  <Link to={`/pets?species=${type.slice(0,-1)}`} className="text-sm text-gray-400 hover:text-primary-400 transition-colors">
                    {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail size={15} className="text-primary-400 flex-shrink-0" />
                hello@pawshome.com
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone size={15} className="text-primary-400 flex-shrink-0" />
                +1 (800) PAWS-HOME
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMapPin size={15} className="text-primary-400 flex-shrink-0" />
                123 Pet Lane, Animal City
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">© {new Date().getFullYear()} PawsHome. All rights reserved.</p>
          <p className="text-xs text-gray-500">Made with ❤️ for pets everywhere</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
