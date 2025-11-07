import { EmployeeAppointmentsByDateResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";


export function CompanyDedicatedEmployeePastBookings(employeeSlug: string)
{
    const api = useApi();

    return useQuery<EmployeeAppointmentsByDateResponseDTO[]>({
        queryKey: ["pastEmployeeAppointments", employeeSlug],
        queryFn: async () =>{
            const data = await api.employee.getEmployeePreviousBookingStat({employeeSlug});
            return data;
        },
        staleTime: 1000 * 60
    });
}