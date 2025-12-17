import { EventImpl } from "@fullcalendar/core/internal";
import { Button } from "../button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "../dialog";
import { Label } from "../label";
import Loader from "./Loader";
import { Input } from "../input";
import { useState } from "react";
import ApproveDialogForm from "./ApproveDialogForm";

type EditSlotDialogFormProps = {
    onEditClick: (newStartValue: string, newEndValue: string) => void;
    onDeleteClick: (event: EventImpl) => void;
    open?: boolean
    onOpenChange: (open: boolean) => void
    isLoading: boolean;
    value: EventImpl
}


export default function EditSlotDialogForm({onEditClick, onDeleteClick, open, onOpenChange, isLoading, value} : EditSlotDialogFormProps)
{

  const [deleteClicked, setDeleteClicked] = useState(false);

  const [newStartValue, setNewStartValue] = useState("");
  const [newEndValue, setNewEndValue] = useState("");

   return (
    <>
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
      <DialogHeader>
        <DialogTitle className="text-center">
          Esemény módosítás
        </DialogTitle>
      </DialogHeader>

      {/* INPUT FIELDS */}
      <div className="flex flex-row gap-4 mt-4">
        <div className="flex flex-col gap-2 flex-1">
          <Label>Kezdés</Label>
          <Input type="time" step="1" defaultValue="08:00:00" onChange={(e) => setNewStartValue(e.target.value)} />
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <Label>Vége</Label>
          <Input type="time" step="1" defaultValue="16:00:00" onChange={(e) => setNewEndValue(e.target.value)}/>
        </div>
      </div>

      {/* BUTTONS */}
      <DialogFooter className="mt-6">
        <div className="flex flex-col gap-2 w-full">
          <Button
            className="w-full"
            disabled={isLoading}
            onClick={() => onEditClick(newStartValue, newEndValue )}
          >
            {isLoading && <Loader />}
            {isLoading ? "Folyamatban..." : "Módosítás"}
          </Button>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>

          <Button variant="destructive" onClick={() => setDeleteClicked(true)} className="my-8">
            Esemény törlés
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  <ApproveDialogForm
        open={deleteClicked}
        onOpenChange={setDeleteClicked}
        title="Esemény törlése"
        description="Biztosan törölni szeretné az eseményt? A lefogalt időpontok automatikusan törlésre kerülnek!"
        buttonVariant="destructive"
        isLoading={false}
        value={value.id}
        onButtonClick={() => {
          onDeleteClick(value);
          setDeleteClicked(false); // close approve dialog
         
        }}
      />
  </>
);
}