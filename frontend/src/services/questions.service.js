import axiosInstance from "../api/axios";

export const fetchQuestions = async () => {
    try {
        const response = await axiosInstance.get("/api/questions/");
        return response.data;
    } catch (error) {
        console.error(error);
    }
}