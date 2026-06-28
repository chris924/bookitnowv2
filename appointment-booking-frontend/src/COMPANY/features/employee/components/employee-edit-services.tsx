import { DeleteServiceRequest, EditServiceRequest, ServiceEntityModifyRequestDTO, ServiceGetResponseDTO } from "@/API"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApproveDialogForm from "@/components/dialogs/ApproveDialogForm";
import { showToast } from "@/components/ui/own/ShowToast";
import {SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";


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


    const { employeeSlug } = useParams();

    if(!employeeSlug){
        showToast.error("Rossz URL cím.")
        return;
    }


     const editServiceMutation = useMutation({
      mutationFn: (requestData: EditServiceRequest) => api.serviceEntity.editService(requestData),
      onSuccess: async (response) => {
        showToast.success(response)
        onOpenChange(false);
        await queryClient.invalidateQueries({ queryKey: ["employeeTable"] });
        
        await queryClient.invalidateQueries({ queryKey: ["sectionCardStatistics"] });

        await queryClient.invalidateQueries({ queryKey: ["pastAppointments"] });

        await queryClient.invalidateQueries({queryKey: ["employeeDataForCompany"]});

        await queryClient.invalidateQueries({queryKey: ["EmployeeServices"]});

      },
      onError: (error) => handleAPIError(error)
    })

    function handleEditClick()
    {
      if(employeeSlug)
      {
      const serviceEntityModifyRequestDTO: ServiceEntityModifyRequestDTO = {
        name: serviceName,
        duration: serviceDuration,
        price: servicePrice,
        description: serviceDescription
      }


      const requestData: EditServiceRequest ={
        employeeSlug: employeeSlug,
        serviceEntityId: service.id,
        serviceEntityModifyRequestDTO: serviceEntityModifyRequestDTO
      }

      editServiceMutation.mutate(requestData);
      }

    }


    const deleteServiceMutation = useMutation({

      mutationFn: (deleteServiceRequest: DeleteServiceRequest) => api.serviceEntity.deleteService(deleteServiceRequest),
      onSuccess: async (response) => {
        showToast.success(response)
        setApproveDeleteForm(false);
        onOpenChange(false);
        await queryClient.invalidateQueries({ queryKey: ["employeeTable"] });
        
        await queryClient.invalidateQueries({ queryKey: ["sectionCardStatistics"] });

        await queryClient.invalidateQueries({ queryKey: ["pastAppointments"] });

        await queryClient.invalidateQueries({queryKey: ["employeeDataForCompany"]});

        await queryClient.invalidateQueries({queryKey: ["EmployeeServices"]});

      },
      onError: (error) => handleAPIError(error)
    })


    function handleDeleteClick()
    {
      if(employeeSlug)
      {
        const deleteRequest: DeleteServiceRequest = {
        serviceEntityId: service.id,
        employeeSlug: employeeSlug
      }


      deleteServiceMutation.mutate(deleteRequest);
      }
      
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
    
    {approveDeleteForm && <ApproveDialogForm open={approveDeleteForm} onOpenChange={setApproveDeleteForm} key={service.id} title="Szolgáltatás törlés" buttonVariant="destructive" description="Biztosan szeretnéd törölni a szolgáltatást? A szolgáltatáshoz kapcsolódó adatok is törlődni fognak(foglalások,bevétel)." value={service.id.toString()} onButtonClick={handleDeleteClick} isLoading={deleteServiceMutation.isPending}/>}

    </>
    )
}