import Loader from "@/components/ui/own/Loader";
import EmployeeServicesContent from "../features/EmployeeServicesContent";
import { EmployeeServicesQuery } from "../hooks/query/EmployeeServicesQuery";



export default function EmployeeServicesPage()
{

    const {data, isLoading} = EmployeeServicesQuery();
        
    if(isLoading || !data) return <Loader/>


    return(
        <EmployeeServicesContent services={data}/>
    )
}