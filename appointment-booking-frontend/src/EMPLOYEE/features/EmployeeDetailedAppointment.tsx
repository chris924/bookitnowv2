import { AppointmentGetResponseDTO } from "@/API/models/AppointmentGetResponseDTO"
import EmployeeAppointmentDetailsCard from "../components/appointment/employee-appointment-details-card"

type EmployeeManageAppointmentProps = {
    appointment: AppointmentGetResponseDTO
}


export default function EmployeeDetailedAppointment({appointment} : EmployeeManageAppointmentProps)
{



    return (
        <EmployeeAppointmentDetailsCard appointment={appointment}/>
    )
}