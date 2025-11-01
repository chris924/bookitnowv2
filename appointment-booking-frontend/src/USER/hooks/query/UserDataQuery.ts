import { UserDataResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";



//Query for gettin the user data. Better than a simple fetch, since it is cacheable.
export function UserDataQuery()
{
    const api = useApi();
    return useQuery<UserDataResponseDTO>({
        queryKey: ["userData"],
        queryFn: () => api.user.getUserData(),
        staleTime: 1000 * 60,
    });
}
