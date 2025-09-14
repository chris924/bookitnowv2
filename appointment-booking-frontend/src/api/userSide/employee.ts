import { SpecialistDTO, CompanyDTO, PlaceDTO, SpecialistPageDTO, BaseItemInterface } from '@/lib/specialist-types';
import api from '../axios';


export interface TopRatedEmp extends BaseItemInterface {

  image: string;
  company: string;
  rating: number;
  about: string;
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

export const getSpecificEmployeeContent = async (employeeSlug: string): Promise<SpecialistPageDTO> => {
  
  const response = await api.get(`/employees/employee/${employeeSlug}`);
  return response.data;
 }

