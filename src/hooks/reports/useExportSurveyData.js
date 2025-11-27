import { useMutation } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";

export const useExportSurveyData = (options = {}) => {
    return useMutation({
        mutationFn: async (params) => {
            const response = await ApiService.ReportService.exportSurveyData(params);
            
            // Create blob and download file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            const extension = params.format.toLowerCase();
            a.download = `survey_report_${timestamp}.${extension}`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return { success: true };
        },
        ...options,
    });
};
