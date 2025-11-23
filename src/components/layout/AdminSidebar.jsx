import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
    LayoutDashboard,
    LogOut,
    Star,
    Boxes,
    FlaskConical,
    FileText,
} from "lucide-react";
import { LOGO_IMAGE } from "../../constants/asset";

const NAVIGATION_ITEMS = [
    {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        path: "/admin/featured-books",
        label: "Featured Books",
        icon: <Star className="w-5 h-5" />,
    },
    {
        path: "/admin/resources",
        label: "Resources",
        icon: <Boxes className="w-5 h-5" />,
    },
    {
        path: "/admin/logs",
        label: "System Logs",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        path: "/admin/test",
        label: "Test",
        icon: <FlaskConical className="w-5 h-5" />,
    },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
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
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`h-screen w-64 bg-white shadow-lg border-r border-gray-200 fixed left-0 top-0 z-40 transform ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                    <Link to="/" className="flex items-center">
                        <img
                            src={LOGO_IMAGE}
                            alt="ValACE Logo"
                            className="w-12 h-auto mr-3"
                        />
                        <span className="text-lg font-bold text-[#00104A]">
                            Admin Panel
                        </span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <nav className="mt-8 px-4">
                    <ul className="space-y-2">
                        {NAVIGATION_ITEMS.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                        isActiveRoute(item.path)
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

                {/* Status Section */}
                <div className="mt-8 px-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Status
                        </h3>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">
                                System Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Log out
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;
