import { CompanyAppointmentsByDateResponseDTO, CompanySectionCardsResponseDTO, EmployeeDataTableResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";



//Query for getting the companies past booked appointments. Better than a simple fetch, since it is cacheable.
export function CompanyPastAppointmentsQuery()
{
    const api = useApi();

    return useQuery<CompanyAppointmentsByDateResponseDTO[]>({
        queryKey: ["pastAppointments"],
        queryFn: async () =>{
            const data = await api.appointment.getCompanyPastAppointmentsByMonth(); 
            return data;
        },
        staleTime: 1000 * 60
    });
}

export function CompanyTotalRevenue()
{
   
    const api = useApi();
    return useQuery<CompanySectionCardsResponseDTO>({
        queryKey: ["sectionCardStatistics"],
        queryFn: async () => {
            const data = await  api.company.getCompanySectionCardsStatistics(); 
            return data;
        },
        staleTime: 1000 * 60
    })
}

export function EmployeeTable()
{
    const api = useApi();
    return useQuery<EmployeeDataTableResponseDTO[]>({
        queryKey: ["employeeTable"],
        queryFn: async () => {
            const data = await  api.employee.getCompanyEmployeeTable(); 
            console.log("DATA:", data);
            return data;
        },
        staleTime: 1000 * 60
    })
}