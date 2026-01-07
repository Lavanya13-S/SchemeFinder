import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">SchemeFinder</span>
              </Link>
            </div>

            {/* Center - Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              <Link
                to="/schemes"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/schemes') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Browse Schemes
              </Link>
              <Link
                to="/states"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/states') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                States
              </Link>
              <Link
                to="/ministries"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/ministries') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Ministries
              </Link>
              <Link
                to="/eligibility"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/eligibility') 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                Check Eligibility
              </Link>
            </div>

            {/* Right side - Auth button */}
            <div className="flex items-center space-x-4">
              {user && (
                <Link
                  to="/saved-schemes"
                  className={`p-2 rounded-lg transition-colors ${
                    isActive('/saved-schemes') 
                      ? 'text-red-600 bg-red-50' 
                      : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title="Saved Schemes"
                >
                  <Heart size={20} fill={isActive('/saved-schemes') ? 'currentColor' : 'none'} />
                </Link>
              )}
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50">
                    <User size={20} />
                    <span>{user.user_metadata?.full_name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-500"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/schemes"
                  className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse Schemes
                </Link>
                <Link
                  to="/states"
                  className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  States
                </Link>
                <Link
                  to="/ministries"
                  className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ministries
                </Link>
                <Link
                  to="/eligibility"
                  className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Check Eligibility
                </Link>
                {user && (
                  <Link
                    to="/saved-schemes"
                    className="block px-3 py-2 rounded-md textbase font-medium text-gray-700 hover:text-red-600 hover:bg-red-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Saved Schemes
                  </Link>
                )}
                {!user && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md textbase font-medium text-green-600 hover:bg-gray-50"
                  >
                    Sign In
                  </button>
                )}
                {user && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md textbase font-medium text-red-600 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}