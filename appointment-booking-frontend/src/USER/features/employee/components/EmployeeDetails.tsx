import { EmployeeGetResponseDTO } from "@/API"

type EmployeeDetails = {

    employeeData: EmployeeGetResponseDTO
}


export default function EmployeeDetails({employeeData}: EmployeeDetails)
{

   return (
    <div  className="">
        <div className="w-full flex lg:flex-row justify-start pt-12 pb-6">
            
            {/* Profile Section */}
            <div className="flex justify-center w-auto items-center text-center gap-4">
            <img
                src={employeeData.image}
                alt={employeeData.name}
                className="w-36 h-36 md:w-28 md:h-28 rounded-full object-cover shadow-md"
            />
            <div>
                <p className="lg:text-4xl text-2xl font-bold">{employeeData.name}</p>
                <p className="lg:text-2xl text-xl text-gray-600">{employeeData.company}</p>
                <p className="mt-1 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full lg:text-md font-medium">
                ⭐ {employeeData.rating}
                </p>
            </div>

            
            </div>
    </div>
    {/* About Section */}
        <div className=" flex flex-col leading-relaxed">
            <p className="lg:text-3xl text-2xl p-2">Bemutatkozás</p>
            <p className="lg:text-lg text-lg">{employeeData.about}</p>
            </div>
  </div>
)

}