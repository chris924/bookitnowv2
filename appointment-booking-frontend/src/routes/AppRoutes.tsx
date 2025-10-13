import CompanyHomePage from '@/COMPANY/pages/CompanyHomePage';
import MainLayout from '@/components/layout/MainLayout';
import { useUserStore } from '@/stores/AuthStore';
import DedicatedEmployeePage from '@/USER/pages/DedicatedEmployeePage';
import DedicatedUserPage from '@/USER/pages/DedicatedUserPage';
import HomePage from '@/USER/pages/HomePage';
import UserBookedAppointmentsPage from '@/USER/pages/UserBookedAppointmentsPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {

  function DetermineHomePage()
  {
    const { user } = useUserStore();

    console.log("USER TYPE:",user?.type)

    if(user?.type == "USER")
    {
      return <HomePage/>
    }
    else if(user?.type == "COMPANY")
    {
      console.log("XD")
      return <CompanyHomePage/>
    }
    else if(user?.type == "EMPLOYEE")
    {
      // return <EmployeeHomePage/> // TODO: Needs implementation
    }
    else
    {
      console.log("HomePage runs")
      return <HomePage/>
    }
  }

  return (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<DetermineHomePage/>} />
            <Route path="/employee/:slug" element={<DedicatedEmployeePage />} />
            <Route path="/user/:slug" element={<DedicatedUserPage/>} />
            <Route path="/user/:slug/booked-appointments" element={<UserBookedAppointmentsPage/>} />
        </Route>
    </Routes>
  );
}