import { SpecialistDTO, CompanyDTO, PlaceDTO } from '@/lib/specialist-types';
import api from './axios';


export interface TopRatedEmp {
  label: string;
  value: string;
  image: string;
  company: string;
  rating: number;
}



export interface EmployeeSearchOptionsResponseDTO {
  specialists: SpecialistDTO[];
  companies: CompanyDTO[];
  places: PlaceDTO[];
}

export interface EmployeeSearchPayload {
  name: string;
  company: string;
  place: string;
}


export const getMostRatedEmployees = async (): Promise<TopRatedEmp[]> => {
  const response = await api.get('/employees/most-rated');
  return response.data;
};

export const getSearchEmployeeCritera = async (employeeSearchPayload: EmployeeSearchPayload): Promise<EmployeeSearchOptionsResponseDTO> => {
  const response = await api.post('/employees/search-employee', employeeSearchPayload)
  return response.data
}
