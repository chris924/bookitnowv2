import { getSpecificEmployeeContent } from "@/api_old/userSide/employee"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom";
import EmployeeServicesTable from "./components/EmployeeServices";
import EmployeeDetails from "./components/EmployeeDetails";
import EmployeeBookingTable from "./components/EmployeeBookingTable";
import { EmployeePageResponseDTO } from "@/API/models/EmployeePageResponseDTO";
import { AppointmentSlotResponseDTO } from "@/API/models/AppointmentSlotResponseDTO";


export default function EmployeeContent()
{
     const { slug } = useParams();

     const [employeeData, setEmployeeData] = useState<EmployeePageResponseDTO>();
     const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlotResponseDTO>();


    useEffect( () => {


        const fetchEmployeeConntent = async () => {

            try{
                if (!slug) {
                    console.error("No slug provided in URL parameters.");
                    return;
                }

                const employeeContent = await getSpecificEmployeeContent(slug);
                console.log("Employee Content:", employeeContent);
                setEmployeeData(employeeContent);
                
            }catch (error) {
                console.error("Error fetching employee content:", error);
            }

            console.log("Employee data:", employeeData);
        }
       
        fetchEmployeeConntent();

    }, [])


    return(
        <>
        {employeeData && <EmployeeDetails employeeData={employeeData.employeeGetResponseDTO} />}
        <div className="flex flex-col lg:flex-row lg:w-full">
         {employeeData &&  <EmployeeServicesTable employeeServices={employeeData.employeeServices} setSlots={setAppointmentSlots}/>}
         {appointmentSlots &&  (
            <div className="lg:flex-1">
            <EmployeeBookingTable appointmentSlots={appointmentSlots} />
            </div>
        )}
        </div>
       
        </>
    )
}