import MainLayout from '@/components/layout/MainLayout';
import DedicatedEmployeePage from '@/pages/DedicatedEmployeePage';
import DedicatedUserPage from '@/pages/DedicatedUserPage';
import HomePage from '@/pages/HomePage';
import UserBookedAppointmentsPage from '@/pages/UserBookedAppointmentsPage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/employee/:slug" element={<DedicatedEmployeePage />} />
            <Route path="/user/:slug" element={<DedicatedUserPage/>} />
            <Route path="/user/:slug/booked-appointments" element={<UserBookedAppointmentsPage/>} />
        </Route>
    </Routes>
  );
}