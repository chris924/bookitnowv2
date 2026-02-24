import CompanyDetailedEmployeePage from '@/COMPANY/pages/CompanyDetailedEmployeePage';
import CompanyHelpPage from '@/COMPANY/pages/CompanyHelpPage';
import CompanyHomePage from '@/COMPANY/pages/CompanyHomePage';
import CompanyStatisticsPage from '@/COMPANY/pages/CompanyStatisticsPage';
import CompanyLayout from '@/components/layout/CompanyLayout';
import EmployeeLayout from '@/components/layout/EmployeeLayout';
import MainLayout from '@/components/layout/MainLayout';
import EmployeeDedicatedAppointmentPage from '@/EMPLOYEE/pages/EmployeeDetailedAppointmentPage';
import EmployeeHelpPage from '@/EMPLOYEE/pages/EmployeeHelpPage';
import EmployeeHomePage from '@/EMPLOYEE/pages/EmployeeHomePage';
import EmployeeOptionsPage from '@/EMPLOYEE/pages/EmployeeOptionsPage';
import EmployeeServicesPage from '@/EMPLOYEE/pages/EmployeeServicesPage';
import EmployeeWorkhourPage from '@/EMPLOYEE/pages/EmployeeWorkhourPage';
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
  const isEmployee = !!employee

  function DetermineHomePage() {
    if (user) return <HomePage />;
    if (company) return <CompanyHomePage />;
    if (employee) return <EmployeeHomePage />;
    return <HomePage />;
  }

   return (
    <Routes>
      <Route element={isCompany ? <CompanyLayout /> : isEmployee ? <EmployeeLayout /> : <MainLayout />}>
        <Route path="/" element={<DetermineHomePage />} />
        <Route path="/employee/:employeeSlug" element={<DedicatedEmployeePage />} />
        <Route path="/employee/appointment/:appointmentId" element={<EmployeeDedicatedAppointmentPage />} />
        <Route path="/employee/workhours" element={<EmployeeWorkhourPage/>} />
        <Route path="/employee/services/:employeeSlug"element={<EmployeeServicesPage />} />
        <Route path="/employee/help" element={<EmployeeHelpPage/>} />
        <Route path="/employee/options" element={<EmployeeOptionsPage/>}/>
        <Route path="/user/:slug" element={<DedicatedUserPage />} />
        <Route path="/user/:slug/booked-appointments" element={<UserBookedAppointmentsPage />} />
        <Route path="/company/statistics" element={<CompanyStatisticsPage/>}/>
        <Route path="/company/employees/:employeeSlug" element={<CompanyDetailedEmployeePage />} />
        <Route path="/company/help" element={<CompanyHelpPage />} />
      </Route>
    </Routes>
  );
}