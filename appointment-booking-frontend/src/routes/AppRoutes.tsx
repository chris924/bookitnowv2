import CompanyDetailedEmployeePage from '@/COMPANY/pages/CompanyDetailedEmployeePage';
import CompanyHomePage from '@/COMPANY/pages/CompanyHomePage';
import CompanyStatisticsPage from '@/COMPANY/pages/CompanyStatisticsPage';
import CompanyLayout from '@/components/layout/CompanyLayout';
import MainLayout from '@/components/layout/MainLayout';
import Loader from '@/components/ui/own/Loader';
import { useCompanyStore, useEmployeeStore, useUserStore } from '@/stores/AuthStore';
import DedicatedEmployeePage from '@/USER/pages/DedicatedEmployeePage';
import DedicatedUserPage from '@/USER/pages/DedicatedUserPage';
import HomePage from '@/USER/pages/HomePage';
import UserBookedAppointmentsPage from '@/USER/pages/UserBookedAppointmentsPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {

  const { user} = useUserStore();
  const {company} = useCompanyStore();
  const {employee} = useEmployeeStore();

  const isCompany = !!company;

  function DetermineHomePage() {
    if (user) return <HomePage />;
    if (company) return <CompanyHomePage />;
    if (employee) return  ""  //<EmployeeHomePage />;
    return <HomePage />;
  }

   return (
    <Routes>
      <Route element={isCompany ? <CompanyLayout /> : <MainLayout />}>
        <Route path="/" element={<DetermineHomePage />} />
        <Route path="/employee/:employeeSlug" element={<DedicatedEmployeePage />} />
        <Route path="/user/:slug" element={<DedicatedUserPage />} />
        <Route path="/user/:slug/booked-appointments" element={<UserBookedAppointmentsPage />} />
        <Route path="/company/statistics" element={<CompanyStatisticsPage/>}/>
        <Route path="/company/employees/:employeeSlug" element={<CompanyDetailedEmployeePage />} />
      </Route>
    </Routes>
  );
}