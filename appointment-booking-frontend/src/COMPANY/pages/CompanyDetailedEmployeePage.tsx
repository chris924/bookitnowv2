import { useParams } from "react-router-dom";
import CompanyDetailedEmployeeContent from "../features/CompanyDetailedEmployeeContent";
import { CompanyDedicatedEmployeeData } from "../hooks/query/CompanyDedicatedEmployeeQuery";
import { showToast } from "@/components/ui/own/ShowToast";
import Loader from "@/components/ui/own/Loader";


export default function CompanyDetailedEmployeePage()
{
    const { employeeSlug } = useParams();

    if(!employeeSlug){
        showToast.error("Rossz URL cím.")
        return;
    }
        

    const {data, isLoading} = CompanyDedicatedEmployeeData(employeeSlug);

    if(isLoading) return <Loader/>

 return(
    data && <CompanyDetailedEmployeeContent details={data?.employeeGetResponseDTO} services={data?.employeeServices} workingHours={data?.employeeWorkingHours}/>
 )   
}