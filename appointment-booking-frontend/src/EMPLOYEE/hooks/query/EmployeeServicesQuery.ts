import { ServiceGetResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";



export function EmployeeServicesQuery()
{
    const api = useApi();

    return useQuery<ServiceGetResponseDTO[]>({
        queryKey: ["EmployeeServices"],
        queryFn: async () =>{
            const data = await api.serviceEntity.getEmployeeServices(); 
            return data;
        },
        staleTime: 1000 * 60
    });
}