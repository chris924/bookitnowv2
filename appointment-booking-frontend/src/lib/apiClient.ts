import { Configuration } from "@/API"; 

// Create a shared configuration for all controllers
export const apiConfig = new Configuration({
  basePath: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080", // backend URL
  credentials: "include", // HttpOnly JWT cookies
});