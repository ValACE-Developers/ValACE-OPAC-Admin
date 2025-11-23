import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useGetPerLocationUsage = (params, options = {}) => {
    return useQuery({
        queryKey: ["perLocationUsage", params],
        queryFn: async () => {
            const data = await ApiService.DashboardService.getPerLocationUsage(params);
            return data;
        },
        ...options,
    });
};
