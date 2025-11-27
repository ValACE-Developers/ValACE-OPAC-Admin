import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LogoLoading } from "@/components/ui/LogoLoading";

const ProtectedRoute = () => {
    const { isAuthenticated, loading, error } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LogoLoading />
            </div>
        );
    }

    if (error) {
        return (
            <Navigate
                to={"/admin/login"}
                state={{ from: location, error }}
                replace
            />
        );
    }
    // if (!true) {
    if (!isAuthenticated) {
        return (
            <Navigate to={"/admin/login"} state={{ from: location }} replace />
        );
    }

    // If user is authenticated and trying to access root admin path, redirect to dashboard
    if (location.pathname === "/admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
