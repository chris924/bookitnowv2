import { EventImpl } from "@fullcalendar/core/internal";
import { Button } from "../button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "../dialog";
import { Label } from "../label";
import Loader from "./Loader";
import { Input } from "../input";
import { useState } from "react";

type AddSlotDialogFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading: boolean;
  onSubmit: (data: {fromDate: string; toDate: string; startTime: string;endTime: string; }) => void;
};


export default function AddSlotDialogForm({open, onOpenChange, onSubmit, isLoading,}: AddSlotDialogFormProps) {

    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    const [date, setDate] = useState(today);


  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("16:00");

 

  const handleSubmit = () => {
    onSubmit({
      fromDate,
      toDate,
      startTime,
      endTime,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            Munkarend létrehozás
          </DialogTitle>
        </DialogHeader>

        {/* INPUTS */}
        <div className="flex flex-col gap-4 mt-4">

          <div className="flex flex-col gap-2">
            <Label>Munkarend kezdő dátum</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              defaultValue={new Date().toString()}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Munkarend dátum vége</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <Label>Kezdés</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label>Vége</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <DialogFooter className="mt-6">
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading && <Loader />}
            {isLoading ? "Folyamatban..." : "Mentés"}
          </Button>

          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Mégse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
