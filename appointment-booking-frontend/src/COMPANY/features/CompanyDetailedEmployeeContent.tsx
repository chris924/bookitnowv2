import { ServiceGetResponseDTO, EmployeeWorkingHoursResponseDTO } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO"


interface CompanyDetailedEmployeeContentProps
{
    details: EmployeeGetResponseDTO;
    services: ServiceGetResponseDTO[];
    workingHours: EmployeeWorkingHoursResponseDTO[];
}

export default function CompanyDetailedEmployeeContent({details, services, workingHours}: CompanyDetailedEmployeeContentProps)
{
    console.log(details)
    console.log(services)
    console.log(workingHours)

    return (
    <div> in progress</div>
)
}