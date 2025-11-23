import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useGetVisitorCount = (params, options = {}) => {
    return useQuery({
        queryKey: ["visitorCount", params],
        queryFn: async () => {
            const data = await ApiService.DashboardService.getVisitorsCount(params);
            return data;
        },
        ...options,
    });
};
