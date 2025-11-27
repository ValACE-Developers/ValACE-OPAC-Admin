import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useLogin = (options = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ identifier, password }) => {
            const data = await ApiService.AuthService.loginAdmin({
                identifier,
                password,
            });
            // Persist token if provided
            const token = data?.data?.token || data?.token;
            if (token) localStorage.setItem("adminToken", token);
            return data;
        },
        onSuccess: (response, variables, context) => {
            // Update auth query data to trigger re-authentication
            if (response?.data?.token) {
                queryClient.setQueryData(["auth"], {
                    isAuthenticated: true,
                    user: response.data.user,
                });
            }
            // Call custom onSuccess if provided
            options.onSuccess?.(response, variables, context);
        },
        ...options,
    });
};

export const useVerify = (options = {}) => {
    return useMutation({
        mutationFn: async (token) => {
            const data = await ApiService.AuthService.verifyToken(token);
            return data;
        },
        ...options,
    });
};

export const useLogout = (options = {}) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.AuthService.logoutAdmin();
            localStorage.removeItem("adminToken");
            return data;
        },
        onSuccess: (response, variables, context) => {
            // Clear auth query data
            queryClient.setQueryData(["auth"], {
                isAuthenticated: false,
                user: null,
            });
            // Call custom onSuccess if provided
            options.onSuccess?.(response, variables, context);
        },
        ...options,
    });
};
