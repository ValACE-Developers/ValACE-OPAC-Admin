import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminLayout } from "@/components/layout/index";
import { LogoLoading } from "@/components/ui/LogoLoading";
import ProtectedRoute from "./ProtectedRoute";

// Page imports
import { 
    NotFoundPage, 
    AdminLoginPage,
    AdminDashboard,
    FeaturedBooksPage,
    ResourcePage,
    ExternalResourcePage,
    ChooseResourceTypePage,
    CreateApiResourcePage,
    EditApiResourcePage,
    CreateRedirectResourcePage,
    EditRedirectResourcePage,
    LogsPage
} from "@/pages";

// Component to redirect authenticated users away from login using Outlet
const RedirectIfAuthenticated = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LogoLoading />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Outlet />;
};

const AppRoute = () => {
    return (
        <>
            <Routes>
                {/* Authentication routes */}
                <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/" element={<AdminLoginPage />} />
                </Route>

                {/* Admin routes */}
                <Route path="/admin/*" element={<ProtectedRoute />}>
                    <Route element={<AdminLayout />}>
                        <Route index element={<Navigate to="/admin/dashboard" replace />} />
                        <Route path="dashboard" element={<AdminDashboard />} />
                        {/* <Route path="resources" element={<ResourcePage />} />
                        <Route path="resources/choose" element={<ChooseResourceTypePage />} />
                        <Route path="resources/create/api" element={<CreateApiResourcePage />} />
                        <Route path="resources/:id/edit/api" element={<EditApiResourcePage />} />
                        <Route path="resources/:id/edit/redirect" element={<EditRedirectResourcePage />} />
                        <Route path="resources/create/redirect" element={<CreateRedirectResourcePage />} /> */}
                        <Route path="featured-books" element={<FeaturedBooksPage />} />
                        <Route path="logs" element={<LogsPage />} />
                    </Route>
                </Route>

                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
};

export default AppRoute;
