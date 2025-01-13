import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:8080/api/v1",
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    console.log(`[API Connector]: ${method} - ${axiosInstance.defaults.baseURL}${url}`);
    console.log(url, bodyData);
    return axiosInstance({
        method: method.toUpperCase(), 
        url: url.startsWith("/") ? url : `/${url}`,
        data: bodyData || null,
        headers: headers || null,
        params: params || null,
    });
};
