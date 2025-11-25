import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "../../api/ApiService";
import { useNotification } from "../useNotification";

// Hook for clearing Laravel logs
export const useClearLaravelLog = () => {
    const queryClient = useQueryClient();
    const { success, error } = useNotification();

    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.LogService.clearLaravelLog();
            return data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch Laravel logs
            queryClient.invalidateQueries({ queryKey: ["laravelLogs"] });
            success(data.message || "Laravel logs cleared successfully");
        },
        onError: (error) => {
            error(error.message || "Failed to clear Laravel logs");
        },
    });
};

// Hook for clearing Info logs
export const useClearInfoLog = () => {
    const queryClient = useQueryClient();
    const { success, error } = useNotification();

    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.LogService.clearInfoLog();
            return data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch Info logs
            queryClient.invalidateQueries({ queryKey: ["successInfoLogs"] });
            success(data.message || "Info logs cleared successfully");
        },
        onError: (error) => {
            error(error.message || "Failed to clear Info logs");
        },
    });
};

// Hook for clearing Error logs
export const useClearErrorLog = () => {
    const queryClient = useQueryClient();
    const { success, error } = useNotification();

    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.LogService.clearErrorLog();
            return data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch Error logs
            queryClient.invalidateQueries({ queryKey: ["errorLogs"] });
            success(data.message || "Error logs cleared successfully");
        },
        onError: (error) => {
            error(error.message || "Failed to clear Error logs");
        },
    });
};

// Hook for clearing all logs
export const useClearAllLogs = () => {
    const queryClient = useQueryClient();
    const { success, error } = useNotification();

    return useMutation({
        mutationFn: async () => {
            const data = await ApiService.LogService.clearAllLogs();
            return data;
        },
        onSuccess: (data) => {
            // Invalidate and refetch all log queries
            queryClient.invalidateQueries({ queryKey: ["laravelLogs"] });
            queryClient.invalidateQueries({ queryKey: ["successInfoLogs"] });
            queryClient.invalidateQueries({ queryKey: ["errorLogs"] });
            success(data.message || "All logs cleared successfully");
        },
        onError: (error) => {
            error(error.message || "Failed to clear all logs");
        },
    });
};