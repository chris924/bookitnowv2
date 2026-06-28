import { AppointmentsByDateResponseDTO, EmployeeAppointmentTableDataResponseDTO, EmployeeSectionCardsResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";

export function EmployeeSectionCardsQuery()
{
   
    const api = useApi();
    return useQuery<EmployeeSectionCardsResponseDTO>({
        queryKey: ["employeeSectionCards"],
        queryFn: async () => {
            const data = await api.employee.getEmployeeSectionCardsData(); 

            return data;
        },

        staleTime: 1000 * 60,
    })
}


//Query for getting the employee past booked appointments. Better than a simple fetch, since it is cacheable.
export function EmployeePastAppointmentsQuery()
{
    const api = useApi();

    return useQuery<AppointmentsByDateResponseDTO[]>({
        queryKey: ["pastEmployeeAppointments"],
        queryFn: async () =>{
            const data = await api.employee.getEmployeePastAppointmentsByMonth(); 
            return data;
        },
        staleTime: 1000 * 60
    });
}


export function EmployeeAppointmentsTableQuery()
{
    const api = useApi();

    return useQuery<EmployeeAppointmentTableDataResponseDTO[]>({
        queryKey: ["EmployeeAppointments"],
        queryFn: async () =>{
            const data = await api.appointment.getEmployeeAppointmentsTable(); 
            return data;
        },
        staleTime: 1000 * 60
    });
}