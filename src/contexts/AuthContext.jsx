import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { loginAdmin, logoutAdmin, verifyToken } from "../api/AuthService";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const queryClient = useQueryClient();

    // Query for token verification
    const { data: authData, isLoading: loading } = useQuery({
        queryKey: ["auth"],
        queryFn: async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                return { isAuthenticated: false, user: null };
            }

            try {
                const response = await verifyToken(token);
                console.log("response", response);
                if (response.success) {
                    return {
                        isAuthenticated: true,
                        user: response.user,
                    };
                } else {
                    localStorage.removeItem("adminToken");
                    return { isAuthenticated: false, user: null };
                }
            } catch (error) {
                localStorage.removeItem("adminToken");
                return { isAuthenticated: false, user: null };
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (response) => {
            if (response.success === true && response.data.token) {
                localStorage.setItem("adminToken", response.data.token);
                queryClient.setQueryData(["auth"], {
                    isAuthenticated: true,
                    user: response.data.user,
                });
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            localStorage.removeItem("adminToken");
            queryClient.setQueryData(["auth"], {
                isAuthenticated: false,
                user: null,
            });
        },
        onError: (error) => {
            console.error("Logout error:", error);
            // Still clear local state even if API call fails
            localStorage.removeItem("adminToken");
            queryClient.setQueryData(["auth"], {
                isAuthenticated: false,
                user: null,
            });
        },
    });

    const login = async (credentials) => {
        const isTestMode = import.meta.env.VITE_ENVIRONMENT === "development" && import.meta.env.VITE_TEST_MODE === "true";

        if (isTestMode) {
            console.warn("[TEST MODE] Login bypass active.");
            await new Promise((r) => setTimeout(r, 300));
            const mockResponse = {
                status: "success",
                token: "test-token",
                user: { id: 1, email: "test@example.com", role: "admin" },
            };
            localStorage.setItem("adminToken", mockResponse.token);
            queryClient.setQueryData(["auth"], {
                isAuthenticated: true,
                user: mockResponse.user,
            });
            return mockResponse;
        }

        try {
            const response = await loginMutation.mutateAsync(credentials);
            if (response.success === true && response.data.token) {
                return response;
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        // Test mode bypass
        if (typeof process !== "undefined" && process.env?.NODE_ENV === "development" && process.env?.VITE_TEST_MODE === "true") {
            localStorage.removeItem("adminToken");
            queryClient.setQueryData(["auth"], {
                isAuthenticated: false,
                user: null,
            });
            return;
        }

        await logoutMutation.mutateAsync();
    };

    const value = {
        isAuthenticated: authData?.isAuthenticated || false,
        user: authData?.user || null,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;