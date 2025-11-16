import { ServiceGetResponseDTO, EmployeeWorkingHoursResponseDTO } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO"
import { EmployeeDetailsCard } from "../components/employee-components/employee-details-card";
import EmployeeServicesCard from "../components/employee-components/employee-services-card";
import EmployeeWorkingHoursCard from "../components/employee-components/employee-workhours-card";


interface CompanyDetailedEmployeeContentProps
{
    details: EmployeeGetResponseDTO;
    services: ServiceGetResponseDTO[];
    workingHours: EmployeeWorkingHoursResponseDTO[];
}

export default function CompanyDetailedEmployeeContent({details, services, workingHours}: CompanyDetailedEmployeeContentProps)
{
    return (
        <>
    <EmployeeDetailsCard details={details}/> 
    <EmployeeServicesCard services={services} />
    <EmployeeWorkingHoursCard workingHours={workingHours}/>
    </>
)
}