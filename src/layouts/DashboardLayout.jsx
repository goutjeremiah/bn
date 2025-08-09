import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import DashboardFooter from '../component/DashboardFooter';
import { ToastContainer } from 'react-toastify';

export default function DashboardLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <ToastContainer />
            <DashboardFooter />
        </div>
    );
}