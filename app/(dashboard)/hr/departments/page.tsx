"use client"
import { useEffect, useState } from "react";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const DepartmentPage = () => {
    const [data, setData] = useState([]); // Use state to hold department data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch departments from the API
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch("/api/departments"); // Your API route for departments
                if (!response.ok) {
                    throw new Error("Failed to fetch departments");
                }
                const departments = await response.json();
                setData(departments); // Set the fetched data
            } catch (error) {
                setError("Could not load departments");
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false); // End loading state
            }
        };

        fetchDepartments();
    }, []);

    if (loading) {
        return <p>Loading...</p>; // Display loading state
    }

    if (error) {
        return <p>{error}</p>; // Display error message if something goes wrong
    }

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data} /> {/* Pass the fetched data */}
        </div>
    );
};

export default DepartmentPage;
