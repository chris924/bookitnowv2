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
import { useEffect, useState } from "react"
import { APIError } from "@/api/axios"
import Loader from "./Loader"
import { showResultToast } from "./ResultSoonerForm"

type ApproveBookingFormProps = {
    open? : boolean;
    onOpenChange: (open: boolean) => void;
    slotInfo: EventImpl;
}


export default function ApproveBookingForm({open, onOpenChange, slotInfo}: ApproveBookingFormProps)
{
  const [successfullBooking, setSuccessfullBooking] = useState(false);
  const [clickedOnBook, setClickedOnBook] = useState(false);
  const [bookingResponse, setBookingResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (!open) {
    setClickedOnBook(false)
    setSuccessfullBooking(false)
  }
}, [open])
  
async function handleAppointmentBooking(id: string)
  {
    try {
      setIsLoading(true);     
      setClickedOnBook(true);
      await new Promise((resolve) => setTimeout(resolve, 6000));
      const data = await addUserToAppointment(parseInt(id));
      console.log(data);
      setSuccessfullBooking(true);
    } catch (error) {
      const err = error as APIError;
      setSuccessfullBooking(false);
      if(err.response?.data)
      {
        setBookingResponse(err.response.data.message)
      }
      else
      {
        setBookingResponse("Ismeretlen hiba!");
      }
    }
    finally
    {
      
      setIsLoading(false);
      showResultToast("TEEEST");
    }

  }

return (
  <Dialog
    open={open}
    onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) {
        setClickedOnBook(false)       // reset when closing
        setSuccessfullBooking(false)  // optional reset
      }
    }}
  >
    {isLoading ? (
      <DialogContent>
        <Loader />
      </DialogContent>
    ) : clickedOnBook ? (
      <p></p>
    ) : (
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            Lefoglalja az időpontot?
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label className="text-right">
            Dátum: {slotInfo.start?.toDateString()}
          </Label>
          <Label className="text-right">
            Időpont kezdete: {slotInfo.start?.getHours()}:
            {slotInfo.start?.getMinutes().toString().padStart(2, "0")}
          </Label>
          <Label className="text-right">
            Időpont vége: {slotInfo.end?.getHours()}:
            {slotInfo.end?.getMinutes().toString().padStart(2, "0")}
          </Label>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            className="bg-blue-400"
            onClick={() => handleAppointmentBooking(slotInfo.id)}
          >
            Foglalás
          </Button>
        </DialogFooter>
      </DialogContent>
    )}
  </Dialog>
)

}