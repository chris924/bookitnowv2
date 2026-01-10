import Loader from "@/components/ui/own/Loader";
import EmployeeWorkhourContent from "../features/EmployeeWorkhourContent";
import { EmployeeWorkhoursTableQuery } from "../hooks/query/EmployeeWorkhourQuery";


export default function EmployeeWorkhourPage()
{

    const {data, isLoading} = EmployeeWorkhoursTableQuery();
    
    if(isLoading) return <Loader/>


    return(
       data && <EmployeeWorkhourContent workhours={data}/> 
    )
}