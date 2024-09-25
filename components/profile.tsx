'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react'; // Using Feather Icons for Chevron
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar'; // Adjust import based on your actual setup
import { AiFillEye, AiOutlineEdit, AiOutlineLogout } from 'react-icons/ai'; // Ant Design icons for edit and logout

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePicture: string; // URL to the user's profile picture
}

const Profile = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Logout function (clear token and redirect to login)
  const handleLogout = () => {
    localStorage.removeItem('token'); // Assuming you're storing the token here
    window.location.href = '/'; // Redirect to login
  };

  // Fetch user details from localStorage or API
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }
  }, []);

  if (!userDetails) {
    return null; 
  }

  return (
    <div className="relative">
      {/* Profile Display with Avatar and Name */}
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleDropdown}
      >
        <Avatar className="h-10 w-10 rounded-full">
          {userDetails.profilePicture ? (
            <AvatarImage
              src={userDetails.profilePicture}
              alt={userDetails.name}
              className="h-10 w-10 object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gray-200">
              {userDetails.name.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {userDetails.name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {userDetails.role}
          </p>
        </div>
        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg dark:bg-gray-800 z-10">
          <ul>
            <li className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <AiFillEye className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <a href="/profile" className="text-sm text-gray-700 dark:text-gray-300">
                View Profile
              </a>
            </li>
            <li className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              <AiOutlineEdit className="h-5 w-5 mr-2 text-gray-700 dark:text-gray-300" />
              <a href="/profile/edit" className="text-sm text-gray-700 dark:text-gray-300">
                Edit Profile
              </a>
            </li>
            <li
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              onClick={handleLogout}
            >
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
