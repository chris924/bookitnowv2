import { toast } from "sonner";


export const showToast = {
    error: (desc: string) => toast.error("Hiba történt ❌", { description: desc }),
    success: (desc: string) => toast.success("Siker ✅", { description: desc }),
};