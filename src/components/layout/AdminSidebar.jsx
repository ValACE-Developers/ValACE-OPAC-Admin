import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    LogOut,
    Star,
    Home,
    SignalHigh
} from "lucide-react";
import { LOGO_IMAGE } from "@/constants/asset";

const NAVIGATION_ITEMS = [
    {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: <Home className="w-5 h-5" />,
    },
    {
        path: "/admin/reports",
        label: "Reports",
        icon: <SignalHigh className="w-5 h-5" />,
    },
    {
        path: "/admin/featured-books",
        label: "Featured Books",
        icon: <Star className="w-5 h-5" />,
    },
    // {
    //     path: "/admin/resources",
    //     label: "Resources",
    //     icon: <Boxes className="w-5 h-5" />,
    // },
    // {
    //     path: "/admin/logs",
    //     label: "System Logs",
    //     icon: <FileText className="w-5 h-5" />,
    // },
];

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const isActiveRoute = (path) => {
        if (path === "/admin/dashboard") {
            return location.pathname === "/admin/dashboard";
        }
        if (path === "/admin/choose-resource") {
            return [
                "/admin/choose-resource",
                "/admin/create-redirect",
                "/admin/create-api",
            ].some((route) => location.pathname.startsWith(route));
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="h-screen w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 z-40">
            {/* Logo Section */}
            <div className="flex items-center justify-center px-4">
                <img
                    src={LOGO_IMAGE}
                    alt="ValACE Logo"
                    className="w-48 h-auto"
                />
            </div>

            {/* Navigation Items */}
            <nav className="mt-20 px-4">
                <ul className="space-y-2">
                    {NAVIGATION_ITEMS.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${isActiveRoute(item.path)
                                        ? "bg-[#00104A] text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-[#00104A]"
                                    }`}
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                    <span>Log out</span>
                    <LogOut className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
