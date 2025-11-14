import { ServiceGetResponseDTO } from "@/API"
import { EmployeeEditDataRequestDTO, EmployeeEditDataRequestDTOExperienceEnum } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loader from "@/components/ui/own/Loader";
import { showToast } from "@/components/ui/own/ShowToast";
import {SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { createSlug, handleAPIError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Delete, Trash2Icon } from "lucide-react";
import { useState } from "react";


interface EmployeeEditServicesProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    service: ServiceGetResponseDTO
}

export default function EmployeeEditServices({service, open, onOpenChange}: EmployeeEditServicesProps)
{
    const [serviceName, setServiceName] = useState(service.name);
    const [serviceDuration, setServiceDuration] = useState(service.duration);
    const [servicePrice, setServicePrice] = useState(service.price);
    const [serviceDescription ,setServiceDescription] = useState(service.description);


    function handleEditClick()
    {

    }
    function handleDeleteClick()
    {

    }

    return(
        <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent >
        <SheetHeader>
          <SheetTitle>Alapadatok szerkeztése</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <span>Név</span>
            <Input id="sheet-demo-name" defaultValue={service.name} onChange={(e) => setServiceName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <span>Időtartam (perc)</span>
            <Input type="number" id="sheet-demo-duration" defaultValue={service.duration} onChange={(e) => setServiceDuration(Number(e.target.value))} min={1} />
          </div>
           <div className="grid gap-3">
            <span>Ár</span>
            <Input type="number" id="sheet-demo-price" defaultValue={service.price} onChange={(e) => setServicePrice(Number(e.target.value))} min={0} />
          </div>
         
           <div className="grid gap-3">
            <span>Bio</span>
             <Textarea placeholder="Leírás" defaultValue={service.description} maxLength={200}  onChange={(e) => setServiceDescription(e.target.value)}/>
          </div>

        <div className="my-1">
               
        <Button type="submit" variant="destructive" onClick={() => handleDeleteClick()}>
         <Trash2Icon />
        {"Szolgáltatás törlés"}
        </Button>
        
        </div>

        </div>
        <SheetFooter>
          <Button type="submit" onClick={() => handleEditClick()}>Mentés</Button>
          <SheetClose asChild>
            <Button variant="outline">Mégse</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>   
    )
}