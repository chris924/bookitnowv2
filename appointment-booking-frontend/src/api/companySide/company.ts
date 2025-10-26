import api from "../axios";
import { CompanyPastAppointsmentsResponseDTO } from '@/lib/company-types';

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

export const getCompanyTotalRevenue = async () => {
  const {data} = await api.get('company/total-revenue');
  console.log("TOTAL REVENUE:", data)
  return data;
}