import { useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { Menu } from "lucide-react";

export const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Don't show sidebar on login page
    if (location.pathname === "/admin/login") {
        return (
            <div className="min-h-screen">
                <Outlet />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header - keep visible and identifiable for tests */}
            <header role="banner" aria-label="Admin Header" data-testid="admin-header" className="sticky top-0 z-40 bg-white flex justify-between items-center lg:ml-64 px-5 py-2 shadow-md">
                <div className="flex justify-between items-center px-4 py-3">
                    <h1 className="text-2xl font-semibold font-khula text-[var(--main-color)]" aria-label="Admin Dashboard Title">Admin Dashboard</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <span className="text-lg text-white bg-green-500 px-4 py-2 rounded-full">
                        Online
                    </span>
                </div>
            </header>
            {/* Mobile menu button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md bg-white shadow-lg border border-gray-200"
                    aria-label="Toggle sidebar"
                    aria-controls="admin-sidebar"
                    aria-expanded={sidebarOpen}
                >
                    <Menu className="w-6 h-6 text-gray-600" />
                </button>
            </div>

            {/* Admin Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} id="admin-sidebar" />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen">
                <main className="p-4 lg:p-6 pt-20" aria-labelledby="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
