import api from './axios';


 export const getMonthlyAppointments = async (serviceId: number): Promise<any> =>
  {
  const response = await api.get(`/appointments/employee/${serviceId}`);
  return response.data;
}