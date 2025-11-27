import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useEmailSurveyData = (options = {}) => {
    return useMutation({
        mutationFn: async (params) => {
            const data = await ApiService.ReportService.emailSurveyData(params);
            return data;
        },
        ...options,
    });
};
