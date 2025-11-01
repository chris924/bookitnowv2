import CompanyHomePage from '@/COMPANY/pages/CompanyHomePage';
import CompanyLayout from '@/components/layout/CompanyLayout';
import MainLayout from '@/components/layout/MainLayout';
import { useCompanyStore, useEmployeeStore, useUserStore } from '@/stores/AuthStore';
import DedicatedEmployeePage from '@/USER/pages/DedicatedEmployeePage';
import DedicatedUserPage from '@/USER/pages/DedicatedUserPage';
import HomePage from '@/USER/pages/HomePage';
import UserBookedAppointmentsPage from '@/USER/pages/UserBookedAppointmentsPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {

  const { user } = useUserStore();
  const { company} = useCompanyStore();
  const { employee } = useEmployeeStore();

  let isCompany = false;

  function DetermineHomePage()
  {
    if(user)
    {
      return <HomePage/>
    }
    else if(company)
    {
      isCompany = true;
      return <CompanyHomePage/>
    }
    else if(employee)
    {
      // return <EmployeeHomePage/> // TODO: Needs implementation
    }
    else
    {
      return <HomePage/>
    }
  }

   return (
    <Routes>
      <Route element={isCompany ? <CompanyLayout /> : <MainLayout />}>
        <Route path="/" element={<DetermineHomePage />} />
        <Route path="/employee/:employeeSlug" element={<DedicatedEmployeePage />} />
        <Route path="/user/:slug" element={<DedicatedUserPage />} />
        <Route path="/user/:slug/booked-appointments" element={<UserBookedAppointmentsPage />} />
      </Route>
    </Routes>
  );
}