import DashboardHeader from "@/components/header";
import Sidebar from "./_components/sidebar";

const EmployeePage = () => {
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
          
          
            </>
     );
}
 
export default EmployeePage;