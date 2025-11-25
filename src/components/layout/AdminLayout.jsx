import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

export const AdminLayout = () => {

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <header role="banner" aria-label="Admin Header" data-testid="admin-header" className="sticky top-0 z-40 bg-white flex justify-between items-center ml-64 px-5 py-2 shadow-md">
                <div className="flex justify-between items-center px-4 py-3">
                    <h1 className="text-2xl font-semibold font-khula text-[var(--main-color)]" aria-label="Admin Dashboard Title">Admin Panel</h1>
                </div>
                <div className="flex gap-3 items-center">
                    <span className="text-lg text-white bg-green-500 px-4 py-2 rounded-full">
                        Online
                    </span>
                </div>
            </header>

            {/* Admin Sidebar */}
            <AdminSidebar id="admin-sidebar" />

            {/* Main Content */}
            <div className="ml-64 min-h-screen">
                <main className="p-6" aria-labelledby="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
