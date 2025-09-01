import { showToast } from "@/components/ui/own/ShowToast";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createSlug(name: string, id: number) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + id;
}

export function handleAPIError(error: unknown): void {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message ?? error.message;
    showToast.error(message);
  } else if (error instanceof Error) {
    // fallback for non-Axios errors
    showToast.error(error.message);
  } else {
    showToast.error("Ismeretlen hiba");
  }

}