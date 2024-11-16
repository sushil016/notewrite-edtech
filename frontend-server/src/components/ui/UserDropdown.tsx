"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  FaUser, 
  FaBook, 
  FaCog, 
  FaSignOutAlt,
  FaChevronDown 
} from 'react-icons/fa';

interface UserDropdownProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    accountType: string;
  };
}

export const UserDropdown = ({ user }: UserDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { clearAuth } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuth();
    router.push('/');
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'TEACHER':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-200"
      >
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user.firstName[0].toUpperCase()}
        </div>
        <span className="text-sm font-medium dark:text-white">
          {user.firstName} {user.lastName}
        </span>
        <FaChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
            <span className={`inline-block px-2 py-1 mt-2 text-xs font-medium rounded-full ${getAccountTypeColor(user.accountType)}`}>
              {user.accountType}
            </span>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                router.push('/profile');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <FaUser className="text-gray-400" />
              <span>Profile</span>
            </button>

            {(user.accountType === 'STUDENT' || user.accountType === 'TEACHER') && (
              <button
                onClick={() => {
                  router.push('/my-courses');
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <FaBook className="text-gray-400" />
                <span>{user.accountType === 'STUDENT' ? 'My Courses' : 'My Teaching'}</span>
              </button>
            )}

            <button
              onClick={() => {
                router.push('/settings');
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
            >
              <FaCog className="text-gray-400" />
              <span>Settings</span>
            </button>

            <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

            <button
              onClick={handleSignOut}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
            >
              <FaSignOutAlt className="text-red-500" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 