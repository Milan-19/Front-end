import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-white text-xl font-bold">Todo App</h1>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-200">
                  Welcome, {user?.name || 'User'}
                </span>
                <div className="mr-2">
                  <NotificationBell />
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded text-white hover:bg-blue-700 focus:outline-none"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 rounded text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            {isAuthenticated && (
              <div className="mr-2">
                <NotificationBell />
              </div>
            )}
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-gray-200">
                  Welcome, {user?.name || 'User'}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded text-white hover:bg-blue-700 focus:outline-none"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 