import { ResponseError } from "@/API";
import { showToast } from "@/components/ui/own/ShowToast";
import { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createSlug(name: string, id: number) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + id;
}

export function handleAPIError(error: unknown): void {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message ?? error.message;
    showToast.error(message);
 
  }
  else if (error instanceof ResponseError) {
    // Handle fetch-based API errors
    error.response.text().then(async (bodyText) => {
      let message = "Hiba történt a kérés során.";

      try {
        const data = JSON.parse(bodyText);
        message = data.message || message;
      } catch {
        message = bodyText || message;
      }

      showToast.error(message);
    });
  }   
  else if (error instanceof Error) {
    // fallback for non-Axios errors
    showToast.error(error.message);
  } else {
    showToast.error("Ismeretlen hiba");
  }

}


export function formatDuration(duration?: string) {
  if (!duration) return '-';

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!match) return '-';

  const [, h, m, s] = match;

  if (h && m) return `${h} óra ${m} perc`;
  if (h) return `${h} óra`;
  if (m) return `${m} perc`;
  if (s) return `${s} mp`;

  return '-';
}

export function formatTime(time?: string) {
  if (!time) return '-';
  const match = time.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : time;
}
