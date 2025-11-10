import { EmployeeAppointmentsByDateResponseDTO, EmployeePageForCompanyResponseDTO } from "@/API";
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

export function CompanyDedicatedEmployeeData(employeeSlug: string)
{
    const api = useApi();

    return useQuery<EmployeePageForCompanyResponseDTO>({
        queryKey: ["employeeDataForCompany", employeeSlug],
        queryFn: async () => {
            const data = await api.employee.getEmployeePageDataForCompany({employeeSlug})
            return data;
        },
        staleTime: 1000 * 60
    })
}