import { ServiceGetResponseDTO, EmployeeWorkingHoursResponseDTO } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO"
import { EmployeeDetailsCard } from "./components/employee-details-card";
import EmployeeServicesCard from "./components/employee-services-card";
import EmployeeWorkingHoursCard from "./components/employee-workhours-card";
import { createSlug } from "@/lib/utils";


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
    <EmployeeWorkingHoursCard workingHours={workingHours} employeeSlug={createSlug(details.name!, details.id!)}/>
    </>
)
}