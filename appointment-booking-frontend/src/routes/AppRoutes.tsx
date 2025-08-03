import MainLayout from '@/components/layout/MainLayout';
import DedicatedEmployeePage from '@/pages/DedicatedEmployeePage';
import HomePage from '@/pages/HomePage';
import { Routes, Route } from 'react-router-dom';

export default function AppRoutes() {
  return (
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/employee/:slug" element={<DedicatedEmployeePage />} />
        </Route>
    </Routes>
  );
}