import api from './axios';


export interface TopRatedEmp {
  label: string;
  value: string;
  image: string;
  company: string;
  rating: number;
}

export const getMostRatedEmployees = async (): Promise<TopRatedEmp[]> => {
  const response = await api.get('/employees/most-rated');
  return response.data;
};