import { AppointmentControllerApi, AuthInfoControllerApi, CompanyAuthenticationControllerApi, CompanyControllerApi, Configuration, EmployeeAuthenticationControllerApi, EmployeeControllerApi, UserAuthenticationControllerApi, UserControllerApi } from "@/API"; 

// Create a shared configuration for all controllers
export const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080", // backend URL
  credentials: "include", // HttpOnly JWT cookies
});

//This needs in AuthStore.tsx, since it is not a function, it can be used in the auth infos
export const api = {
  user: new UserControllerApi(apiConfig),
  employee: new EmployeeControllerApi(apiConfig),
  company: new CompanyControllerApi(apiConfig),
  appointment: new AppointmentControllerApi(apiConfig),
  companyAuth: new CompanyAuthenticationControllerApi(apiConfig),
  employeeAuth: new EmployeeAuthenticationControllerApi(apiConfig),
  userAuth: new UserAuthenticationControllerApi(apiConfig),
  authInfo: new AuthInfoControllerApi(apiConfig),
};