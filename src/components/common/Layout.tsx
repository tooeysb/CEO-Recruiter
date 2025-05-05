import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  Briefcase, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../lib/AuthProvider';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  // Main navigation items
  const mainNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, description: 'Overview of your recruiting pipeline and metrics' },
    { name: 'Candidates', href: '/candidates', icon: Users, description: 'Browse and manage all candidates in your pipeline' },
    { name: 'Engagement', href: '/engagement', icon: Briefcase, description: 'View engagement details and team information' },
  ];
  
  const toggleSettingsMenu = () => {
    setIsSettingsMenuOpen(!isSettingsMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Simple Fixed Header */}
      <header className="bg-white shadow fixed top-0 left-0 right-0 z-10 h-16">
        <div className="max-w-full mx-auto px-4 h-full">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl text-blue-600 whitespace-nowrap mr-16">TalentHub</Link>
            
            {/* Main Navigation Items */}
            <div className="flex items-center space-x-8 ml-12">
              {mainNavigation.map((item) => {
                const isActive = location.pathname === item.href || 
                  (item.href !== '/' && location.pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon
                        size={18}
                        className={`mr-2 ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      />
                      <span className="align-middle">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {/* Flex spacer */}
            <div className="flex-1"></div>
            
            {/* Settings Icon */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={toggleSettingsMenu}
                aria-expanded={isSettingsMenuOpen}
                aria-haspopup="true"
              >
                <Settings size={20} />
              </button>
              
              {/* Settings Dropdown */}
              {isSettingsMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSettingsMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <Settings size={16} className="mr-2 text-gray-400" />
                      <span className="align-middle">Admin</span>
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2 text-gray-400" />
                      <span className="align-middle">Sign out</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Page Content - with padding for fixed header */}
      <main className="flex-1 overflow-y-auto pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;