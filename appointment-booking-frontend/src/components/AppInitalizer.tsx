import { useUserStore, useCompanyStore, useEmployeeStore } from "@/stores/AuthStore";
import { useEffect, useState } from "react";
import Loader from "./ui/own/Loader";

export default function AppInitializer({ children }: { children: React.ReactNode }) {
  const { checkUserAuth, userLoading } = useUserStore();
  const { checkCompanyAuth, companyLoading } = useCompanyStore();
  const { checkEmployeeAuth, employeeLoading } = useEmployeeStore();

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      await Promise.all([
        checkUserAuth(),
        checkCompanyAuth(),
        checkEmployeeAuth(),
      ]);
      setInitialized(true);
    };

    initAuth();
  }, []);

  const isLoading = !initialized || userLoading || companyLoading || employeeLoading;

  if (isLoading) {
    return (
     <Loader/>
    );
  }

  return <>{children}</>;
}