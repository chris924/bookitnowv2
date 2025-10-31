import { useMemo } from "react";
import {
  EmployeeControllerApi,
  CompanyControllerApi,
  AppointmentControllerApi,
} from "@/API";
import { apiConfig } from "@/lib/apiClient";

export function useApi() {
  // useMemo ensures the API instances are not recreated on every render
  const apis = useMemo(() => {
    return {
      employee: new EmployeeControllerApi(apiConfig),
      company: new CompanyControllerApi(apiConfig),
      appointment: new AppointmentControllerApi(apiConfig),
    };
  }, []);

  return apis;
}
