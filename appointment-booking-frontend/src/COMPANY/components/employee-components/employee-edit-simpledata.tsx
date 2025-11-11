import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface EditSimpleDataProps{
    open: boolean;
    onOpenChange: (value: boolean) => void;
    details: EmployeeGetResponseDTO;
}


export default function EditSimpleData({open, onOpenChange, details}: EditSimpleDataProps)
{
    const [category, setCategory] = useState(details.experience)

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
            <span>Név</span>
            <Input id="sheet-demo-name" defaultValue={details.name} />
          </div>
          <div className="grid gap-3">
            <span>E-mail</span>
            <Input id="sheet-demo-email" defaultValue={details.email} />
          </div>
           <div className="grid gap-3">
            <span>Telefonszám</span>
            <Input id="sheet-demo-phonenumber" defaultValue={details.phoneNumber} />
          </div>
          <div className="grid gap-3">
            <span>Kategória</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{category}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Kategória</DropdownMenuLabel>
                    <DropdownMenuGroup>
                    <DropdownMenuItem onClick={(e) => setCategory(e.currentTarget.textContent)}>
                        Junior
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => setCategory(e.currentTarget.textContent)}>
                        Senior
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => setCategory(e.currentTarget.textContent)}>
                        Master
                    </DropdownMenuItem>
                   </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
          </div>
           <div className="grid gap-3">
            <span>Bio</span>
             <Textarea placeholder="Bio leírás" maxLength={200} />
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