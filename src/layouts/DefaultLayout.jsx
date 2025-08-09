import { Outlet } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';
import { ToastContainer } from 'react-toastify';

export default function DefaultLayout() {
    return (
        <div>
            <Header />
            <Outlet />
            <ToastContainer />
            <Footer />
        </div>
    );
}