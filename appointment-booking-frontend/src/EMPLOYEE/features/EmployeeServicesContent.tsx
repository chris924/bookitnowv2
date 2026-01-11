import { ServiceGetResponseDTO } from "@/API"
import EmployeeServicesCard from "@/COMPANY/components/employee-components/employee-services-card"

type EmployeeServicesContentProps = {

    services: ServiceGetResponseDTO[]
}


export default function EmployeeServicesContent({services} : EmployeeServicesContentProps)
{


    return(
       <EmployeeServicesCard services={services} />
    )
}