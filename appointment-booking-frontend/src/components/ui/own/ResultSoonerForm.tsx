import { toast } from "sonner"



export function showResultToast(message: string) {
  toast(message, {
    description: message,
    action: {
      label: "Undo",
      onClick: () => console.log("Undo"),
    },
  })
}