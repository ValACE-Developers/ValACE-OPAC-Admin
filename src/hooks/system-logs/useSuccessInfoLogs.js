import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useSuccessInfoLogs = (options = {}) => {
    return useQuery({
        queryKey: ["successInfoLogs"],
        queryFn: async () => {
            const data = await ApiService.LogService.getSuccessInfoLog();
            return data;
        },
        ...options,
    });
};