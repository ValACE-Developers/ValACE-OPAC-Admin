import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    NotificationContainer,
    useNotification,
} from "@/hooks/useNotification";
import { z } from "zod";
import { useLogin } from "@/hooks/auth/useAuth";
import { LOGO_IMAGE } from "@/constants/asset";

export const AdminLoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loginMutation = useLogin();
    const { notifications, success, error, removeNotification } = useNotification();

    const [formData, setFormData] = useState({
        identifier: "",
        password: "",
    });
    const loginSchema = z.object({
        identifier: z.string().min(1, "Identifier is required"),
        password: z.string().min(1, "Password is required"),
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsed = loginSchema.safeParse({
                identifier: formData.identifier.trim(),
                password: formData.password,
            });
            if (!parsed.success) {
                const firstMsg =
                    parsed.error.issues?.[0]?.message ||
                    "Please fix the form errors.";
                error(firstMsg);
                return;
            }

            const response = await loginMutation.mutateAsync({
                identifier: formData.identifier.trim(),
                password: formData.password,
            });

            if (response.success) {
                success("Login successful!");

                // Redirect to the page they were trying to access or admin dashboard
                const from =
                    location.state?.from?.pathname || "/admin/dashboard";
                setTimeout(() => {
                    navigate(from, { replace: true });
                }, 1000);
            }
        } catch (err) {
            error(err.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <img
                    src={LOGO_IMAGE}
                    alt="ValACE Logo"
                    className="w-[100px] h-auto mx-auto"
                />
            </div>
            <NotificationContainer
                notifications={notifications}
                removeNotification={removeNotification}
            />

            <div className="max-w-2xl w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-5xl font-bold text-[var(--main-color)] font-khula">
                        Admin Log In
                    </h2>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="identifier"
                                className="block text-lg font-bold font-khula text-[var(--main-color)] mb-2"
                            >
                                Identifier :
                            </label>
                            <input
                                id="identifier"
                                type="text"
                                value={formData.identifier}
                                onChange={(e) =>
                                    handleChange("identifier", e.target.value)
                                }
                                className="w-full text-lg font-kulim-park px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
                                placeholder="Please enter your identifier"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-lg font-bold font-khula text-[var(--main-color)] mb-2"
                            >
                                Password :
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                className="w-full text-lg px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--main-color)] focus:border-[var(--main-color)]"
                                placeholder="Please enter your password"
                                required
                            />
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="bg-[var(--main-color)] text-white px-25 py-4 text-1xl rounded-md font-khula font-semibold hover:bg-[var(--main-color)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loginMutation.isPending
                                    ? "Logging in..."
                                    : "Log In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
