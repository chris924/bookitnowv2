import { ServiceGetResponseDTO } from "@/API"
import { EmployeeEditDataRequestDTO, EmployeeEditDataRequestDTOExperienceEnum } from "@/API";
import { EmployeeGetResponseDTO } from "@/API/models/EmployeeGetResponseDTO";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import ApproveDialogForm from "@/components/ui/own/ApproveDialogForm";
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

    const api = useApi();
    const queryClient = useQueryClient();

    const [approveDeleteForm, setApproveDeleteForm] = useState(false);

    function handleEditClick()
    {

    }


    const deleteServiceMutation = useMutation({

      mutationFn: (serviceEntityId: number) => api.serviceEntity.deleteServiceFromCompany({serviceEntityId}),
      onSuccess: async (response) => {
        showToast.success(response)
        setApproveDeleteForm(false);
        onOpenChange(false);
        await queryClient.invalidateQueries({ queryKey: ["employeeTable"] });
        
        await queryClient.invalidateQueries({ queryKey: ["sectionCardStatistics"] });

        await queryClient.invalidateQueries({ queryKey: ["pastAppointments"] });

        await queryClient.invalidateQueries({queryKey: ["employeeDataForCompany"]});
      },
      onError: (error) => handleAPIError(error)
    })


    function handleDeleteClick(serviceEntityId: string)
    {
      deleteServiceMutation.mutate(Number(serviceEntityId));
    }

    return(
      <>
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
               
        <Button type="submit" variant="destructive" onClick={() => setApproveDeleteForm(true)}>
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
    
    {approveDeleteForm && <ApproveDialogForm open={approveDeleteForm} onOpenChange={setApproveDeleteForm} key={service.id} title="Szolgáltatás törlés" buttonVariant="destructive" description="Biztosan szeretnéd törölni a szolgáltatást?" value={service.id.toString()} onButtonClick={handleDeleteClick} isLoading={deleteServiceMutation.isPending}/>}

    </>
    )
}