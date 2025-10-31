
import { EmployeeGetResponseDTO, EmployeePageResponseDTO, EmployeeSearchOptionsResponseDTO } from '@/API/models';
import api from '../axios';


export interface EmployeeSearchPayload {
  name: string;
  company: string;
  place: string;
}


export const getMostRatedEmployees = async (): Promise<EmployeeGetResponseDTO[]> => {
  const response = await api.get('/employees/most-rated');
  return response.data;
};

export const getSearchEmployeeCritera = async (employeeSearchPayload: EmployeeSearchPayload): Promise<EmployeeSearchOptionsResponseDTO> => {
  const response = await api.post('/employees/search-employee', employeeSearchPayload)
  return response.data
}

export const getSpecificEmployeeContent = async (employeeSlug: string): Promise<EmployeePageResponseDTO> => {
  
  const response = await api.get(`/employees/employee/${employeeSlug}`);
  return response.data;
 }

