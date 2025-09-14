import { EmployeeSearchOptionsResponseDTO, EmployeeSearchPayload, getSearchEmployeeCritera } from "@/api/userSide/employee";
import { useQuery } from "@tanstack/react-query";



//Query for gettin the user appointments. Better than a simple fetch, since it is cacheable.
export function UserSearchResultsQuery(searchCrit: EmployeeSearchPayload)
{
    return useQuery<EmployeeSearchOptionsResponseDTO>({
        queryKey: ["searchResult", searchCrit],
        queryFn: () => getSearchEmployeeCritera(searchCrit).then(res => res),
        enabled: !!searchCrit,
        staleTime: 1000 * 60,
        placeholderData: () => ({ specialists: [], companies: [], places: [] })
    });
}


