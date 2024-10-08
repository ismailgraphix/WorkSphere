'use client';
import { BriefcaseBusiness, Building2,  CalendarCheck, ChartNoAxesCombined, Clock, HandCoins, LayoutGrid,  Settings,  TreePalm, UserPlus, Users } from 'lucide-react';
import logo from '../../../../assets/employee.png'
import Image from 'next/image';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const AdminSidebar = () => {
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
        

        <Link href="/admin" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <LayoutGrid />
          <span>Dashboard</span>
        </Link>

        <Link href="/employees" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <Users />
          <span>Employees</span>
        </Link>

        <Link href="admin/departments" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
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
        <ChartNoAxesCombined />
          <span>Reports</span>
        </Link>

        {/* New sections for Leave, Holidays, and Jobs */}
        <Link href="/leave" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <TreePalm />
          <span>Leave</span>
        </Link>

        <Link href="/holidays" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <CalendarCheck />
          <span>Holidays</span>
        </Link>

        <Link href="/jobs" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <BriefcaseBusiness />
          <span>Jobs</span>
        </Link>
<Separator/>
        <h3 className="text-gray-400 uppercase text-xs mt-4 mb-2">Settings</h3>
        <Link href="/settings" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <Settings />
          <span>Settings</span>
        </Link>
        <Link href="/settings" className="p-2 hover:bg-gray-700 rounded-md flex items-center space-x-2">
        <UserPlus />
          <span>Users</span>
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
