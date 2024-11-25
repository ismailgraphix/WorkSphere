'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { AiFillEye, AiOutlineLogout } from 'react-icons/ai';
import { useToast } from '../hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  employeeId: string;
  profileImage: string | null;
}

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  useToast();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserDetails(parsedUser);
    }
  }, []);

  if (!userDetails) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
        <Avatar className="h-10 w-10 rounded-full">
          {userDetails.profileImage ? (
            <AvatarImage src={userDetails.profileImage} alt={userDetails.name} className="h-10 w-10 object-cover" />
          ) : (
            <AvatarFallback className="bg-gray-200">
              {userDetails.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{userDetails.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{userDetails.position}</p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dark:bg-gray-800 z-10">
          <ul>
            <li className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <AiFillEye className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <a href="/settings" className="text-sm text-gray-700 dark:text-gray-300">
                View Profile
              </a>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>
              <AiOutlineLogout className="h-5 w-5 mr-2 text-red-500" />
              <span className="text-sm text-red-500">Logout</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;