import api from "../axios";
import {CompanyAppointmentsByDateResponseDTO } from '@/lib/company-types';

interface loginCompanyInterface
{
    email: string;
    password: string;
}

export const loginCompany = async ({ email, password }: loginCompanyInterface) => {
  const { data } = await api.post('/auth/company/login', { email, password });
  return data;
};

export const getTotalAppointmentsData = async (): Promise<CompanyAppointmentsByDateResponseDTO> => {
  const {data } = await api.get('company/appointments-month-data');
  console.log(data);
  return data;
} 