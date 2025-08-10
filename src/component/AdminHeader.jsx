import { useState } from "react";
import {
    Menu,
    X,
    LayoutDashboard,
    Settings,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <>
            {/* Header Bar */}
            <header className="bg-white shadow-md px-4 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-20">
                <div className="text-lg font-bold">Admin Dashboard</div>

                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={toggleSidebar}
                    className="md:hidden text-gray-700"
                    aria-label="Toggle menu"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
                        <Settings size={20} />
                        <span>Settings</span>
                    </button>
                    <button className="flex items-center space-x-1 text-red-600 hover:text-red-800" onClick={logout}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 z-10 bg-black/40 md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                        />

                        {/* Sidebar */}
                        <motion.div
                            className="fixed top-0 right-0 z-20 h-full w-64 bg-white shadow-lg p-5 md:hidden"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-col gap-4">
                                <button
                                    className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 p-2 rounded"
                                >
                                    <LayoutDashboard size={20} />
                                    <span>Dashboard</span>
                                </button>

                                <button
                                    className="flex items-center gap-2 text-gray-800 hover:bg-gray-100 p-2 rounded"
                                >
                                    <Settings size={20} />
                                    <span>Settings</span>
                                </button>

                                <button
                                    className="flex items-center gap-2 text-red-600 hover:bg-red-100 p-2 rounded"
                                    onClick={logout}
                                >
                                    <LogOut size={20} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
