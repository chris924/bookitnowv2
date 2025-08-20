import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { EventImpl } from "@fullcalendar/core/internal"

type ApproveBookingFormProps = {
    open? : boolean;
    onOpenChange: (open: boolean) => void;
    slotInfo: EventImpl;
}


export default function ApproveBookingForm({open, onOpenChange, slotInfo}: ApproveBookingFormProps)
{


    return(
        <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
         <DialogHeader>
              <DialogTitle className="text-center">Lefoglalja az időpontot?</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">

                <Label className="text-right">Dátum:{slotInfo.start?.toDateString()}</Label>
                <Label className="text-right">Időpont kezdete: {slotInfo.start?.getHours()}:{slotInfo.end?.getMinutes()}</Label>
               
              <Label className="text-right">Időpont vége: {slotInfo.end?.getHours()}:{slotInfo.end?.getMinutes()}</Label>
              
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-400"
              >
                Foglalás
              </Button>
            </DialogFooter>

      </DialogContent>
    </Dialog>
    )
}