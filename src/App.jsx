// src/App.jsx
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import DefaultLayout from './layouts/DefaultLayout';
import AdminLayout from './layouts/AdminLayout';
import DashboardLayout from './layouts/DashboardLayout';

import HomePage from './pages/HomePage'
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateUser from './pages/admin/CreateUser';
import UserDetails from './pages/admin/UserDetails';
// import NotFound from './pages/NotFound';
import UserProfile from './pages/UserProfile';
import AboutPage from './pages/AboutPage';
import Transactions from './pages/Transactions';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
      {/* USER ROUTES with layout */}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
      </Route>

      {/* DASHBOARD ROUTES with dashboard layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/transactions" element={<Transactions />} />
      </Route>


      {/* ADMIN ROUTES with admin layout */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/user/create" element={<CreateUser />} />
        <Route path="/admin/user/:id" element={<UserDetails />} />
      </Route>



      {/* Catch all */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
    </BrowserRouter>
  );
}
