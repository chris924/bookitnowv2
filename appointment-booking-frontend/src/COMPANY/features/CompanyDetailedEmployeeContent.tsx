import { ServiceGetResponseDTO, EmployeeWorkingHoursResponseDTO } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO"
import { EmployeeDetailsCard } from "../components/employee-components/employee-details-card";


interface CompanyDetailedEmployeeContentProps
{
    details: EmployeeGetResponseDTO;
    services: ServiceGetResponseDTO[];
    workingHours: EmployeeWorkingHoursResponseDTO[];
}

export default function CompanyDetailedEmployeeContent({details, services, workingHours}: CompanyDetailedEmployeeContentProps)
{
    return (
    <EmployeeDetailsCard details={details}/> 
)
}