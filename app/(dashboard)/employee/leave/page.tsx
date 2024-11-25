"use client";
import { useState } from "react";
import LeaveApplicationForm from "@/components/leave-application-form";
import EmployeeLeaveTable from "./_components/employee-leave-table";

export default function LeavePage() {
    const [showForm, setShowForm] = useState(false);

    return (
      <div className="container mx-auto py-10">
        <EmployeeLeaveTable/>
        
        {!showForm ? (
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-6"
          >
            Apply for Leave
          </button>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Apply for Leave</h1>
              <button 
                onClick={() => setShowForm(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to List
              </button>
            </div>
            <LeaveApplicationForm />
          </div>
        )}
      </div>
    );
}