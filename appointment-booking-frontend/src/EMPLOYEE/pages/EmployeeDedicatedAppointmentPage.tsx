import Loader from "@/components/ui/own/Loader";
import { showToast } from "@/components/ui/own/ShowToast";
import { useParams } from "react-router-dom";
import { EmployeeAppointmentQuery } from "../hooks/query/EmployeeAppointmentQuery";
import ManageAppointment from "../components/appointment-manage/ManageAppointment";


export default function EmployeeDedicatedAppointmentPage()
{

    const { appointmentId } = useParams();

    if(!appointmentId){
        showToast.error("Rossz URL cím.")
        return;
    }

    const {data, isLoading} = EmployeeAppointmentQuery(parseInt(appointmentId));
    
    if(isLoading || !data) return <Loader/>



    return(
        <ManageAppointment appointment={data} />
    )
}