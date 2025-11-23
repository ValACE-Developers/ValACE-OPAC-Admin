import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useUserRoles = (options = {}) => {
    return useQuery({
        queryKey: ["userRoles"],
        queryFn: async () => {
            const data = await ApiService.AuthService.getUserRoles();
            return data;
        },
        ...options,
    });
};
