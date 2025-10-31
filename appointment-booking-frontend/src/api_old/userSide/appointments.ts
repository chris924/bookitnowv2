import api from "../axios";



 export const getMonthlyAppointments = async (serviceId: number): Promise<any> =>
  {
  const response = await api.get(`/appointments/employee/${serviceId}`);
  return response.data;
}

export const addUserToAppointment = async (appointmentId: number) => {
  const response = await api.get(`/appointments/employee/book-event/${appointmentId}`);
  return response.data;
}

export const getUserBookedAppointments = async (userSlug: string) => {
  const result = await api.get(`/appointments/user/${userSlug}/booked-appointments`);
  console.log(result.data)
  return result;
}

export const cancelBookedAppointment = async (userSlug: string, appointmentId: number) => {
  return await api.post(`appointments/user/${userSlug}/cancel-appointment/${appointmentId}`);
}