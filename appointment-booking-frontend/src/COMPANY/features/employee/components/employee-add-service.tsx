import { AddServiceRequest, ServiceEntityAddRequestDTO } from "@/API"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApproveDialogForm from "@/components/dialogs/ApproveDialogForm";
import { showToast } from "@/components/ui/own/ShowToast";
import {SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose, Sheet } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";


interface EmployeeAddServicesProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
}

export default function EmployeeAddService({ open, onOpenChange}: EmployeeAddServicesProps)
{
    const [serviceName, setServiceName] = useState("");
    const [serviceDuration, setServiceDuration] = useState(0);
    const [servicePrice, setServicePrice] = useState(0);
    const [serviceDescription ,setServiceDescription] = useState("");

    const api = useApi();
    const queryClient = useQueryClient();

    const [approveAddForm, setApproveAddForm] = useState(false);

   const { employeeSlug } = useParams();

    if(!employeeSlug){
        showToast.error("Rossz URL cím.")
        return;
    }


     const addServiceMutation = useMutation({
      mutationFn: (requestData: AddServiceRequest) => api.serviceEntity.addService(requestData),
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

    function handleAddClick()
    {
        if(!employeeSlug)
        {
          showToast.error("No employeeSlug defined.");
          return  
        }

      const serviceEntityAddRequestDTO: ServiceEntityAddRequestDTO = {
        name: serviceName,
        duration: serviceDuration,
        price: servicePrice,
        description: serviceDescription
      }


      const requestData: AddServiceRequest ={
        employeeSlug: employeeSlug,
        serviceEntityAddRequestDTO: serviceEntityAddRequestDTO
      }

      addServiceMutation.mutate(requestData);
    }


    return(
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent >
        <SheetHeader>
          <SheetTitle>Szolgáltatás létrehozása</SheetTitle>
          <SheetDescription>
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <span>Név</span>
            <Input id="sheet-demo-name"  onChange={(e) => setServiceName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <span>Időtartam (perc)</span>
            <Input type="number" id="sheet-demo-duration"  onChange={(e) => setServiceDuration(Number(e.target.value))} min={1} />
          </div>
           <div className="grid gap-3">
            <span>Ár</span>
            <Input type="number" id="sheet-demo-price"  onChange={(e) => setServicePrice(Number(e.target.value))} min={0} />
          </div>
         
           <div className="grid gap-3">
            <span>Bio</span>
             <Textarea placeholder="Leírás"  maxLength={200}  onChange={(e) => setServiceDescription(e.target.value)}/>
          </div>

        <div className="my-1">
        
        </div>

        </div>
        <SheetFooter>
          <Button type="submit" onClick={() => handleAddClick()}>Hozzáadás</Button>
          <SheetClose asChild>
            <Button variant="outline">Mégse</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
    
    {approveAddForm && <ApproveDialogForm open={approveAddForm} onOpenChange={setApproveAddForm}  title="Szolgáltatás létrehozása" buttonVariant="default" description="Biztosan szeretnéd létrehozni a szolgáltatást?"  onButtonClick={handleAddClick} isLoading={addServiceMutation.isPending}/>}

    </>
    )
}