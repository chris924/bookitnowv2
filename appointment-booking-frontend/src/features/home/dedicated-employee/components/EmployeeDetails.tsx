import { SpecialistDTO } from "@/lib/specialist-types"
import { useEffect } from "react"

type EmployeeDetails = {

    employeeData: SpecialistDTO
}


export default function EmployeeDetails({employeeData}: EmployeeDetails)
{

    useEffect(() => {

        console.log("DETAILS: ", employeeData)
    }, [employeeData])

    return(
        
         <div className="flex flex-col lg:flex-row lg:justify-between lg:pr-12 px-4">

            

            <div className="flex flex-col items-center text-center gap-2 lg:w-1/2">
            <img
                src={employeeData.image}
                alt={employeeData.label}
                className="w-36 h-36 md:w-24 md:h-24 rounded-full object-cover"
            />

            <p className="text-5xl">{employeeData.value}</p>
            <p className="text-4xl">{employeeData.company}</p>
            <p className="text-3xl">{employeeData.rating}</p>
            </div>

            <div className="lg:w-1/2 w-full mb-6 lg:mb-0 text-left lg:pt-40">
            <p>{employeeData.about}</p>
            </div>
        </div>
        
    )
}