import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useErrorLogs = (options = {}) => {
    return useQuery({
        queryKey: ["errorLogs"],
        queryFn: async () => {
            const data = await ApiService.LogService.getErrorsLog();
            return data;
        },
        ...options,
    });
};