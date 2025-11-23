import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useDashboardStats = (options = {}) => {
    return useQuery({
        queryKey: ["dashboardStats"],
        queryFn: async () => {
            const data = await ApiService.DashboardService.getStats();
            return data;
        },
        ...options,
    });
};
