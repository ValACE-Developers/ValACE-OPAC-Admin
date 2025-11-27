import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useSurveyData = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ["surveyData", params],
        queryFn: async () => {
            const data = await ApiService.ReportService.getSurveyData(params);
            return data;
        },
        ...options,
    });
};
