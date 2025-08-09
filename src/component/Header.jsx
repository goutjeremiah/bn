import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Inbox, LogOut, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import logo from '../assets/logo.svg';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About Us', href: '/about' },
    ];
    const user = JSON.parse(localStorage.getItem('user')) || null
    const token = localStorage.getItem('token') || null;

    

    const url = new URL(window.location.href);
    const path = url.pathname;

    // Check login status and fetch notifications on location change
    useEffect(() => {
        setIsLoggedIn(!!user);

        if (token) {
            fetchNotifications();
        }
    }, [location, token]);

    // Fetch notifications from the backend API
    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/notifications/${user.id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch notifications.');
            }

            const data = await response.json();
            setNotifications(data);


        } catch (err) {
            console.error('Error fetching notifications:', err);
            // toast.error(`Error: ${err.message}`);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to mark notification as read.');
            }

            toast.success('Notification marked as read.');
            // Re-fetch notifications to update the state
            fetchNotifications();
        } catch (err) {
            console.error('Error marking as read:', err);
            toast.error(`Error: ${err.message}`);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/');
        setIsLoggedIn(false);
    }

    // === Logged-in View ===
    if (isLoggedIn) {
        return (
            <>
                <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                    <header className="flex items-center justify-between p-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 md:hidden"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu size={20} className="text-gray-600" />
                        </button>

                        <Link to="/" className="w-24 md:w-32">
                            <img src={logo} alt="Your Bank Logo" className="w-full h-auto" />
                        </Link>

                        <div className="flex items-center justify-end w-full space-x-4">
                            {/* Notification Dropdown */}
                            <div className="relative">
                                <button
                                    className="p-2 rounded-full hover:bg-gray-100 relative"
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                >
                                    <Inbox size={20} className="text-gray-600" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
                                            {notifications.length > 0 ? (
                                                notifications.map(n => (
                                                    <div key={n.id} className={`p-4 flex flex-col ${n.read_at ? 'bg-white' : 'bg-blue-50'}`}>
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-800">{n.title}</h4>
                                                                <p className="text-sm text-gray-600">{n.message}</p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {new Date(n.created_at).toLocaleString()}
                                                                </p>
                                                            </div>
                                                            {!n.read_at && (
                                                                <button
                                                                    onClick={() => markAsRead(n.id)}
                                                                    className="ml-2 p-1 rounded-full text-blue-500 hover:bg-blue-100 transition-colors duration-200"
                                                                    title="Mark as read"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No new notifications.
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-2 bg-gray-50 text-center text-sm border-t border-gray-200">
                                            <Link to="/user/notifications" className="text-primary hover:underline">
                                                View All Notifications
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button
                                className="flex items-center space-x-1 text-gray-600 hover:text-gray-800"
                                onClick={logout}
                            >
                                <LogOut size={20} />
                                <span className="text-sm font-medium hidden sm:inline">Log out</span>
                            </button>
                        </div>
                    </header>

                    {/* Tabs */}
                    <div className="flex items-center justify-around px-4 pb-2">
                        <Link
                            to="/user/dashboard"
                            className={`text-sm font-semibold pb-1 ${path === '/user/dashboard'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Accounts
                        </Link>
                        <Link
                            to="/user/profile"
                            className={`text-sm font-semibold pb-1 ${path === '/user/profile'
                                ? 'text-red-600 border-b-2 border-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Profile
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    // === Public View ===
    return (
        <>
            <header className="bg-white text-gray-900 shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
                <Link to="/">
                    <img src={logo} alt="Your Bank Logo" className="w-32 sm:w-36" />
                </Link>

                <nav className="hidden md:flex gap-6 items-center">
                    {navLinks.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.href}
                            className="hover:text-primary text-sm font-medium transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <Link
                        to="/login"
                        className="text-sm font-medium text-primary hover:text-white hover:bg-primary px-4 py-1.5 rounded-md transition duration-300 hidden sm:inline"
                    >
                        Log In
                    </Link>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMobileOpen(true)}>
                        <Menu className="text-gray-900" size={28} />
                    </button>
                </div>
            </header>

            {/* Mobile Sidebar */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden ${mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setMobileOpen(false)}
            >
                <div
                    className={`absolute top-0 right-0 h-full w-64 bg-white shadow-xl p-6 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-between items-center mb-6">
                        <img src={logo} alt="Logo" className="w-28" />
                        <button onClick={() => setMobileOpen(false)}>
                            <X className="text-gray-600" size={28} />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-4">
                        {navLinks.map((link, idx) => (
                            <Link
                                key={idx}
                                to={link.href}
                                className="text-sm font-medium text-gray-700 hover:text-accent transition"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <hr className="my-4" />

                        <Link
                            to="/login"
                            className="text-sm font-medium text-primary hover:text-accent"
                        >
                            Log In
                        </Link>
                        <Link
                            to="/signup"
                            className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-accent text-center"
                        >
                            Sign Up
                        </Link>
                    </nav>
                </div>
            </div>
        </>
    );
}
