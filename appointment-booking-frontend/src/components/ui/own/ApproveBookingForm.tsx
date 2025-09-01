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
import Loader from "./Loader"
import { showToast } from "./ShowToast"
import { handleAPIError} from "@/lib/utils"

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
    //  await new Promise((resolve) => setTimeout(resolve, 2000)) // simulate delay
      const data = await addUserToAppointment(parseInt(id))
      console.log(data)

        if(slotInfo.start)
        {
           showToast.success(slotInfo.start?.toLocaleString());
        }
        else
        {
          showToast.success("");
          showToast.error("Nem található kezdő időpont a foglaláshoz!");
        }

       

      onOpenChange(false) // close dialog on success
    } catch (error) {
      handleAPIError(error);
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
            className="bg-blue-400 flex items-center gap-2"
            disabled={isLoading}
            onClick={() => handleAppointmentBooking(slotInfo.id)}
          >
            {isLoading && <Loader/>}
            {isLoading ? "Foglalás..." : "Foglalás"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}