import axiosInstance from "../api/axios";

export const fetchModules = async () => {
    try {
        const response = await axiosInstance.get('http://127.0.0.1:8000/api/modules/');
        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error);
    }
}