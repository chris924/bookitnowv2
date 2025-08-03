import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function createSlug(name: string, id: number) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + '-' + id;
}