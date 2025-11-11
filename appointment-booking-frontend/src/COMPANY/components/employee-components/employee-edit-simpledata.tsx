import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Sheet } from "@/components/ui/sheet";
import { Label } from "recharts";

interface EditSimpleDataProps{
    open: boolean;
    onOpenChange: (value: boolean) => void;
}


export default function EditSimpleData({open, onOpenChange}: EditSimpleDataProps)
{
    return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alapadatok szerkeztése</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label>Name</Label>
            <Input id="sheet-demo-name" defaultValue="Pedro Duarte" />
          </div>
          <div className="grid gap-3">
            <Label>Username</Label>
            <Input id="sheet-demo-username" defaultValue="@peduarte" />
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Mentés</Button>
          <SheetClose asChild>
            <Button variant="outline">Mégse</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    
    )
}