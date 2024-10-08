import { data } from "autoprefixer";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";

const DepartmentPage = () => {
    return (  
        <div className="container mx-auto py-10">
            <DataTable  columns={columns} data={data}/>
        </div>
    );
}
 
export default DepartmentPage;