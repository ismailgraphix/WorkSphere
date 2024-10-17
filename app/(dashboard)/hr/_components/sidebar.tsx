'use client';
import { Users, Building2, CalendarCheck, HandCoins, Clock, ChartBar, Settings } from 'lucide-react'; // Icons you might use
import logo from '../../../../assets/employee.png';
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const HrSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <div className="flex items-center space-x-2 mb-8">
        {/* Company Logo */}
        <Link href="/hr">
          <Image src={logo} alt="Company Logo" className="h-8 w-8 cursor-pointer justify-center" />
          <h2 className="text-xl font-semibold">EnterpriseHR</h2>
        </Link>
      </div>

      <nav className="space-y-4">
        <Link href="/hr" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Users />
          <span>Dashboard</span>
        </Link>

        <Link href="/employees" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Users />
          <span>Employees</span>
        </Link>

        <Link href="/hr/departments" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Building2 />
          <span>Departments</span>
        </Link>

        <Link href="/payroll" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <HandCoins />
          <span>Payroll</span>
        </Link>

        <Link href="/attendance" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Clock />
          <span>Attendance</span>
        </Link>

        <Link href="/reports" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <ChartBar />
          <span>Reports</span>
        </Link>

        <Link href="/leave" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <CalendarCheck />
          <span>Leave Management</span>
        </Link>
         <Separator/>
        <Link href="/settings" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
          <Settings />
          <span>Settings</span>
        </Link>
      </nav>
    </aside>
  );
};

export default HrSidebar;
