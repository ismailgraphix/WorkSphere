'use client';

import { useEffect, useState } from "react";
import { ModeToggle } from "./toggle-btn"; // Assuming a dark/light mode toggle button component
import Profile from "./profile"; // Profile component for avatar, user name, and role

 

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const DashboardHeader = () => {
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [greeting, setGreeting] = useState<string>("Good Morning");

  useEffect(() => {
    // Fetch user details from localStorage (or API)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserDetails(JSON.parse(storedUser));
    }

    // Set greeting based on the current time
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  if (!userDetails) {
    return <p>Loading...</p>;
  }

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md dark:bg-gray-800">
      {/* Search and Greeting */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type to search..."
            className="p-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
        
        </div>

        {/* Greeting Message */}
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
          {greeting}, {userDetails.name}
        </h1>
      </div>

      {/* Right Section: Toggle, Notifications, Messages, Profile */}
      <div className="flex items-center space-x-6">
        {/* Mode Toggle */}
        <ModeToggle />
    
        {/* User Profile */}
        <Profile />
      </div>
    </header>
  );
};

export default DashboardHeader;
