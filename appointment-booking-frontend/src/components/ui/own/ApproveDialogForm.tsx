import { Button } from "../button";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "../dialog";
import { Label } from "../label";
import Loader from "./Loader";

type ApproveDialogFormProps = {
    title: string;
    description: string;
    onButtonClick: (id: string) => void;
    open?: boolean
    onOpenChange: (open: boolean) => void
    value: string;
    buttonVariant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"; 
    isLoading: boolean;
}


export default function ApproveDialogForm({title, description, onButtonClick, open, onOpenChange, value, buttonVariant, isLoading} : ApproveDialogFormProps)
{

    return(
        <Dialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Label>{description}</Label>
        </div>

        <DialogFooter>
          
          <Button
            className="flex items-center gap-2 aria-label"
            disabled={isLoading}
            onClick={() => onButtonClick(value)}
            variant={buttonVariant}
          >
            {isLoading && <Loader/>}
            {isLoading ? "Folyamatban..." : "Igen"}
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Mégse
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    )
}