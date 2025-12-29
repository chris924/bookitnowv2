import { useMemo } from "react";
import {
  EmployeeControllerApi,
  CompanyControllerApi,
  AppointmentControllerApi,
  UserControllerApi,
  CompanyAuthenticationControllerApi,
  UserAuthenticationControllerApi,
  AuthInfoControllerApi,
  ServiceEntityControllerApi,
  EmployeeAuthenticationControllerApi,
} from "@/API";
import { apiConfig } from "@/lib/apiClient";

export function useApi() {
  // useMemo ensures the API instances are not recreated on every render
  const apis = useMemo(() => {
    return {
      user: new UserControllerApi(apiConfig),
      employee: new EmployeeControllerApi(apiConfig),
      company: new CompanyControllerApi(apiConfig),
      appointment: new AppointmentControllerApi(apiConfig),
      serviceEntity: new ServiceEntityControllerApi(apiConfig),
      companyAuth: new CompanyAuthenticationControllerApi(apiConfig),
      employeeAuth: new EmployeeAuthenticationControllerApi(apiConfig),
      userAuth: new UserAuthenticationControllerApi(apiConfig),
      authInfo: new AuthInfoControllerApi(apiConfig)
    };
  }, []);

  return apis;
}
