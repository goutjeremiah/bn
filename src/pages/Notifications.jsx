import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    useEffect(() => {
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

        fetchNotifications();
    }, []);

    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const now = new Date();

        // Clear time parts for both dates to compare days only
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const diffTime = nowOnly - dateOnly;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "today";
        if (diffDays === 1) return "yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 14) return "last week";
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 60) return "last month";
        return `${Math.floor(diffDays / 30)} months ago`;
    };


    return (
        <div className="flex flex-col h-screen w-screen mt-24 bg-gray-100 font-inter">
            {/* Static Header */}
            <header className="flex items-center p-4 border-b border-gray-100 bg-white">
                <Link to="/user/dashboard" className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h2 className="flex-grow text-center text-xl font-bold text-gray-800">Notifications</h2>
                <div className="w-10"></div>
            </header>

            {/* Scrollable Content */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className="p-4 rounded-xl border border-gray-200 shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold text-gray-800">{notification.message}</h3>
                                <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No notifications found.</p>
                )}
            </main>


            {/* Static Footer */}
            <footer className="p-4 bg-white border-t border-gray-100 text-center text-sm text-gray-500">
                © 2025 Your Company
            </footer>
        </div>
    );
};

export default NotificationsPage;
