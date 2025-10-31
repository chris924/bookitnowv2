import { EmployeeDataTableResponseDTO } from "@/lib/specialist-types";
import api from "../axios";
import { CompanyPastAppointsmentsResponseDTO, CompanySectionCardsResponseDTO } from '@/lib/company-types';

interface loginCompanyInterface
{
    email: string;
    password: string;
}

export const loginCompany = async ({ email, password }: loginCompanyInterface) => {
  const { data } = await api.post('/auth/company/login', { email, password });
  return data;
};

export const getTotalAppointmentsData = async (): Promise<CompanyPastAppointsmentsResponseDTO[]> => {
  const {data } = await api.get('company/appointments-month-data');
  console.log(data);
  return data;
}

export const getCompanySectionCardStatistics = async (): Promise<CompanySectionCardsResponseDTO> => {
  const {data} = await api.get('company/section-cards-statistics');
  return data;
}

export const getCompanyEmployeeDataTable = async (): Promise<EmployeeDataTableResponseDTO[]> => {
  const {data} = await api.get('employees/employee-table')
  return data;
}