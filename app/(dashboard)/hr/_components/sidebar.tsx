'use client';


import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <nav className="space-y-4">
        <Link href="/dashboard" className="block p-2 hover:bg-gray-700 rounded-md">Human resource</Link>
        <Link href="/employees" className="block p-2 hover:bg-gray-700 rounded-md">Employees</Link>
        <Link href="/departments" className="block p-2 hover:bg-gray-700 rounded-md">Departments</Link>
        <Link href="/settings" className="block p-2 hover:bg-gray-700 rounded-md">Settings</Link>
      </nav>
      
    </aside>
  );
};

export default Sidebar;
