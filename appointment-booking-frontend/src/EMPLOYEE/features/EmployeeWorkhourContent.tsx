import { EmployeeWorkingHoursResponseDTO } from "@/API"
import EmployeeWorkingHoursCard from "@/COMPANY/features/employee/components/employee-workhours-card"
import { showToast } from "@/components/ui/own/ShowToast"
import { createSlug } from "@/lib/utils"
import { useEmployeeStore } from "@/stores/AuthStore"


type EmployeeWorkhourContentProps = {
    workhours: EmployeeWorkingHoursResponseDTO[]
}


export default function EmployeeWorkhourContent({workhours} : EmployeeWorkhourContentProps)
{

     const {employee} = useEmployeeStore();


    if(!employee?.name || !employee.id)
    {
        showToast.error("No employee found.");
        return; 
    }

    const employeeSlug = createSlug(employee?.name, employee?.id)

    return(
        <EmployeeWorkingHoursCard workingHours={workhours} employeeSlug={employeeSlug}/>
    )
}