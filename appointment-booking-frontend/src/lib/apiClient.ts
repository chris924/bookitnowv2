import { AppointmentControllerApi, AuthInfoControllerApi, CompanyAuthenticationControllerApi, CompanyControllerApi, Configuration, EmployeeControllerApi, UserAuthenticationControllerApi, UserControllerApi } from "@/API"; 

// Create a shared configuration for all controllers
export const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080", // backend URL
  credentials: "include", // HttpOnly JWT cookies
});

export const api = {
  user: new UserControllerApi(apiConfig),
  employee: new EmployeeControllerApi(apiConfig),
  company: new CompanyControllerApi(apiConfig),
  appointment: new AppointmentControllerApi(apiConfig),
  companyAuth: new CompanyAuthenticationControllerApi(apiConfig),
  userAuth: new UserAuthenticationControllerApi(apiConfig),
  authInfo: new AuthInfoControllerApi(apiConfig),
};