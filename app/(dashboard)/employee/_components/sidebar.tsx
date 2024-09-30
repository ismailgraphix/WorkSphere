'use client';
import logo from '../../../../assets/employee.png'
import Image from 'next/image';
import Link from 'next/link';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        {/* Company Logo */}
        <Link href="/admin">
        <Image src={logo} alt="Company Logo" className="h-8 w-8 cursor-pointer justify-center" />
        <h2 className="text-xl font-semibold">EnterpriseAdmin</h2>
        </Link>
        
      </div>
      
      <nav className="space-y-4">
        <h3 className="text-gray-400 uppercase text-xs mb-2">Main Menu</h3>
        
        <Link href="/admin" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>📊</span>
          <span>Dashboard emp</span>
        </Link>

        <Link href="/employees" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>👥</span>
          <span>Employees</span>
        </Link>

        <Link href="/departments" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>🏢</span>
          <span>Departments</span>
        </Link>

        <Link href="/payroll" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>💼</span>
          <span>Payroll</span>
        </Link>

        <Link href="/attendance" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>📅</span>
          <span>Attendance</span>
        </Link>

        <Link href="/reports" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>📈</span>
          <span>Reports</span>
        </Link>

        <h3 className="text-gray-400 uppercase text-xs mt-4 mb-2">Settings</h3>
        <Link href="/settings" className=" p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <span>⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
