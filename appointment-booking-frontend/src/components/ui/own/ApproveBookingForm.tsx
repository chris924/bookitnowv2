import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { EventImpl } from "@fullcalendar/core/internal"
import { addUserToAppointment } from "@/api/appointments"
import { useState } from "react"
import { toast } from "sonner"

type ApproveBookingFormProps = {
  open?: boolean
  onOpenChange: (open: boolean) => void
  slotInfo: EventImpl
}

export default function ApproveBookingForm({
  open,
  onOpenChange,
  slotInfo,
}: ApproveBookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleAppointmentBooking(id: string) {
    try {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate delay
      const data = await addUserToAppointment(parseInt(id))
      console.log(data)

      toast.success("Sikeres foglalás 🎉", {
        description: slotInfo.start?.toLocaleString(),
      })

      onOpenChange(false) // close dialog on success
    } catch (err) {
      toast.error("Hiba történt ❌", {
        description: "Nem sikerült lefoglalni az időpontot",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            Lefoglalja az időpontot?
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label>Dátum: {slotInfo.start?.toDateString()}</Label>
          <Label>
            Kezdés: {slotInfo.start?.getHours()}:
            {slotInfo.start?.getMinutes().toString().padStart(2, "0")}
          </Label>
          <Label>
            Vége: {slotInfo.end?.getHours()}:
            {slotInfo.end?.getMinutes().toString().padStart(2, "0")}
          </Label>
        </div>

        <DialogFooter>
          <Button
            className="bg-blue-400"
            disabled={isLoading}
            onClick={() => handleAppointmentBooking(slotInfo.id)}
          >
            {isLoading ? "Foglalsz..." : "Foglalás"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}