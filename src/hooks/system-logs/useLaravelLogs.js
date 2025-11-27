import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useLaravelLogs = (options = {}) => {
    return useQuery({
        queryKey: ["laravelLogs"],
        queryFn: async () => {
            const data = await ApiService.LogService.getLaravelLog();
            return data;
        },
        ...options,
    });
};