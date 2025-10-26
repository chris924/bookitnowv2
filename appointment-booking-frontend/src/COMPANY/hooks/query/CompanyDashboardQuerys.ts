import { getCompanySectionCardStatistics, getTotalAppointmentsData } from "@/api/companySide/company";
import {CompanyPastAppointsmentsResponseDTO, CompanySectionCardsResponseDTO } from "@/lib/company-types";
import { useQuery } from "@tanstack/react-query";



//Query for getting the companies past booked appointments. Better than a simple fetch, since it is cacheable.
export function CompanyPastAppointmentsQuery()
{
    return useQuery<CompanyPastAppointsmentsResponseDTO[]>({
        queryKey: ["pastAppointments"],
        queryFn: async () =>{
            const data = await getTotalAppointmentsData();
            return data;
        },
        staleTime: 1000 * 60
    });
}

export function CompanyTotalRevenue()
{
    return useQuery<CompanySectionCardsResponseDTO>({
        queryKey: ["sectionCardStatistics"],
        queryFn: async () => {
            const data = await getCompanySectionCardStatistics();
            return data;
        },
        staleTime: 1000 * 60
    })
}