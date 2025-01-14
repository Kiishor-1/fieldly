import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { ANALYTICS_ENDPOINTS } from "../api";

const {
    FETCH_USERS_ALL_FIELD_ANALYSIS,
    GENERATE_ANALYSIS,
} = ANALYTICS_ENDPOINTS;


export async function fetchAnalyticsData(token) {
    const toastId = toast.loading("Fetching analytics data...");
    try {
        const response = await apiConnector(
            "GET",
            FETCH_USERS_ALL_FIELD_ANALYSIS,
            null,
            { Authorization: `Bearer ${token}` }
        );
        toast.dismiss(toastId);
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.dismiss(toastId);
        toast.error("Failed to fetch analytics data.");
        return null;
    }
}

export async function generateAnalysis(id,token) {
    const toastId = toast.loading("Generating AI analysis...");
    try {
        const response = await apiConnector(
            "GET",
            GENERATE_ANALYSIS(id),
            {},
            { Authorization: `Bearer ${token}` }
        );
        toast.dismiss(toastId);
        return response.data.generatedText;
    } catch (error) {
        console.error("Error generating AI response:", error);
        toast.dismiss(toastId);
        toast.error("Failed to generate AI response.");
        return "Error occurred while generating data.";
    }
}
