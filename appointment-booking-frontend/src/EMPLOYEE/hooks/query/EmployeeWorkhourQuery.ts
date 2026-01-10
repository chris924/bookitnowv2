import { EmployeeWorkingHoursResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";


export function EmployeeWorkhoursTableQuery()
{
    const api = useApi();

    return useQuery<EmployeeWorkingHoursResponseDTO[]>({
        queryKey: ["EmployeeAppointments"],
        queryFn: async () =>{
            const data = await api.employee.getEmployeeWorkhourData(); 
            return data;
        },
        staleTime: 1000 * 60
    });
}