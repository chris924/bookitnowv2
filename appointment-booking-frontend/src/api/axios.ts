import { ErrorResponse } from "@/lib/error-types";
import axios, { AxiosError } from "axios";


const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,    
})

export type APIError = AxiosError<ErrorResponse>;

export default api;

