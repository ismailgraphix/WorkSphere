'use client';
import Sidebar from './_components/sidebar'; // Assuming Sidebar is in the same folder
import DashboardHeader from '@/components/header';
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>  
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
       <DashboardHeader/>

            {/* Profile Section */}
            
          </div>
       
</div>
        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      
        </>
  );
};

export default DashboardLayout;
