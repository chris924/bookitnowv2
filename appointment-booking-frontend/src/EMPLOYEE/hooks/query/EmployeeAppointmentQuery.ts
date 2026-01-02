import { AppointmentGetResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";



export function EmployeeAppointmentQuery(appointmentId: number)
{
    const api = useApi();

    return useQuery<AppointmentGetResponseDTO>({
        queryKey: ["employeeDedicatedAppointment"],
        queryFn: async () =>{
            const data = await api.appointment.getEmployeeAppointmentDetails({appointmentId}); 
            return data;
        },
        staleTime: 1000 * 60
    });
}