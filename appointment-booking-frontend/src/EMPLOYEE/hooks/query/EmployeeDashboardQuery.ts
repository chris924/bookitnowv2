import { EmployeeSectionCardsResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
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