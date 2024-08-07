import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

export const commonApi = async (method: string, url: string, reqBody?: any, reqHeader?: any): Promise<AxiosResponse | AxiosError> => {
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            data: reqBody,
            headers: reqHeader ? reqHeader : { "Content-Type": "application/json" },
        };

        const response: AxiosResponse = await axios(config);
        return response;
    } catch (error:any) {
        return error;
    }
};
