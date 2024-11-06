'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../../assets/employee.png';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  Wallet,
  Building2,
  CalendarDays
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/employee" className="flex items-center space-x-2">
          <Image src={logo} alt="Company Logo" className="h-8 w-8" />
          <h2 className="text-xl font-semibold">Employee Portal</h2>
        </Link>
      </div>
      
      <nav className="space-y-4">
        <h3 className="text-gray-400 uppercase text-xs mb-2">Main Menu</h3>
        
        <Link href="/employee/dashboard" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>

        <Link href="/employee/leave" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Calendar size={20} />
          <span>Leave Management</span>
        </Link>

        <Link href="/employee/holidays" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <CalendarDays size={20} />
          <span>Holidays</span>
        </Link>

        <Link href="/employee/attendance" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Clock size={20} />
          <span>Attendance</span>
        </Link>

        <Link href="/employee/payslips" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Wallet size={20} />
          <span>Payslips</span>
        </Link>

        <Link href="/employee/documents" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <FileText size={20} />
          <span>Documents</span>
        </Link>

        <Link href="/employee/department" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Building2 size={20} />
          <span>My Department</span>
        </Link>

        <h3 className="text-gray-400 uppercase text-xs mt-4 mb-2">Account</h3>
        
        <Link href="/employee/profile" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <User size={20} />
          <span>My Profile</span>
        </Link>

        <Link href="/employee/settings" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
