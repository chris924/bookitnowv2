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

   return (
  <div className="w-full flex flex-col justify-center lg:justify-start pt-12">
    
    {/* Profile Section */}
    <div className="flex justify-center w-auto items-center text-center gap-4">
      <img
        src={employeeData.image}
        alt={employeeData.label}
        className="w-36 h-36 md:w-28 md:h-28 rounded-full object-cover shadow-md"
      />
      <div>
        <p className="text-3xl font-bold">{employeeData.value}</p>
        <p className="text-xl text-gray-600">{employeeData.company}</p>
        <p className="mt-1 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
          ⭐ {employeeData.rating}
        </p>
      </div>
    </div>

    {/* About Section */}
   <div className=" lg:w-2/3 p-12 max-w-3xl text-gray-800 leading-relaxed">
      <p>{employeeData.about}</p>
    </div>
  </div>
)

}