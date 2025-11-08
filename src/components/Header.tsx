import { Menu, Globe, User, LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export default function Header({ language, setLanguage }: HeaderProps) {
  const [showLanguages, setShowLanguages] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, signOut, loading } = useAuth();

  const languages = ['English', 'हिंदी', 'বাংলা', 'తెলুগు', 'മലയാളം', 'ਪੰਜਾਬੀ', 'ଓଡ଼ିଆ', 'ગુજરાતી', 'ಕನ್ನಡ', 'मराठी', 'தமிழ்'];

  const getUserDisplayName = (user: any) => {
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SF</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">SchemeFinder</h1>
                <p className="text-xs text-gray-500">Govt. of India</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`transition-colors ${isActive('/') ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              Home
            </Link>
            <Link
              to="/schemes"
              className={`transition-colors ${isActive('/schemes') ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              All Schemes
            </Link>
            <Link
              to="/check-eligibility"
              className={`transition-colors ${isActive('/check-eligibility') ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              Check Eligibility
            </Link>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Globe size={18} />
                <span>{language}</span>
              </button>
              {showLanguages && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 max-h-64 overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLanguages(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600"
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Authentication */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <User size={18} />
                  <span className="hidden sm:block">{getUserDisplayName(user)}</span>
                  <ChevronDown size={16} />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName(user)}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <User size={18} />
                <span>Sign In</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              <Link to="/schemes" className="text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                All Schemes
              </Link>
              <Link to="/check-eligibility" className="text-gray-700 hover:text-green-600" onClick={() => setMobileMenuOpen(false)}>
                Check Eligibility
              </Link>
              <button className="flex items-center gap-2 text-gray-700 hover:text-green-600">
                <Globe size={18} />
                <span>{language}</span>
              </button>
              
              {/* Mobile Authentication */}
              {user ? (
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <User size={18} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {getUserDisplayName(user)}
                    </span>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 w-fit"
                >
                  <User size={18} />
                  <span>Sign In</span>
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
    
    {/* Auth Modal */}
    <AuthModal 
      isOpen={showAuthModal} 
      onClose={() => setShowAuthModal(false)} 
    />
  </>
  );
}
