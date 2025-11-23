import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useLogin = (options = {}) => {
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
    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.AuthService.logoutAdmin();
            localStorage.removeItem("adminToken");
            return data;
        },
        ...options,
    });
};
