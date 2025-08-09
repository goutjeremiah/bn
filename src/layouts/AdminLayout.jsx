import { Outlet } from 'react-router-dom';
import AdminHeader from '../component/AdminHeader';
import AdminFooter from '../component/AdminFooter';
import { ToastContainer } from 'react-toastify';

export default function DefaultLayout() {
    return (
        <div>
            <AdminHeader />
            <Outlet />
            <ToastContainer />
            <AdminFooter />
        </div>
    );
}