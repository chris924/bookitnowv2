import { GetSearchEmployeeRequest } from "@/API";
import { EmployeeSearchOptionsResponseDTO } from "@/API/models/EmployeeSearchOptionsResponseDTO";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";



//Query for gettin the user appointments. Better than a simple fetch, since it is cacheable.
export function UserSearchResultsQuery(searchCrit: GetSearchEmployeeRequest)
{
    const employeeApi = useApi();

    return useQuery<EmployeeSearchOptionsResponseDTO>({
        queryKey: ["searchResult", searchCrit],
        queryFn: () => employeeApi.employee.getSearchEmployee(searchCrit).then(res => res),
        enabled: !!searchCrit,
        staleTime: 1000 * 60,
        placeholderData: () => ({ specialists: [], companies: [], places: [] })
    });
}


