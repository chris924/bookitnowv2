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
import { useState } from "react";

interface EditSimpleDataProps{
    open: boolean;
    onOpenChange: (value: boolean) => void;
    details: EmployeeGetResponseDTO;
}


export default function EditSimpleData({open, onOpenChange, details}: EditSimpleDataProps)
{

  const [name, setName] = useState(details.name)
  const [email, setEmail] = useState(details.email)
  const [phoneNumber, setPhoneNumber] = useState(details.phoneNumber)
  const [experience, setExperience] = useState(details.experience)
  const [bio, setBio] = useState(details.about)


  const api = useApi();
  const queryClient = useQueryClient();

   const { mutate, isPending, isError, error } = useMutation({
  mutationFn: ({
    employeeSlug,
    employeeEditDataRequestDTO,
  }: {
    employeeSlug: string;
    employeeEditDataRequestDTO: EmployeeEditDataRequestDTO;
  }) =>
    api.employee.editEmployeeDataForCompany({
      employeeSlug,
      employeeEditDataRequestDTO,
    }),

  onSuccess: async () => {
    
    await queryClient.invalidateQueries({ queryKey: ["employeeTable"] });
    await queryClient.invalidateQueries({ queryKey: ["sectionCardStatistics"] });
    await queryClient.invalidateQueries({ queryKey: ["pastAppointments"] });
    await queryClient.invalidateQueries({queryKey: ["employeeDataForCompany"]})
    showToast.success("Adatok módosítva!");
    onOpenChange(false);
  },

  onError: (error) => handleAPIError(error),
});

if(isPending) return <Loader/>

  function handleEditClick()
  {
    if(!details.name || !details.id)
      return

    const editRequestDTO : EmployeeEditDataRequestDTO = {

      name: name,
      email: email,
      phoneNumber: phoneNumber,
      experience: experience,
      bio: bio
    }

    mutate({
    employeeSlug: createSlug(details.name, details.id),
    employeeEditDataRequestDTO: editRequestDTO,
  });
  }

   
    return (
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
            <Input id="sheet-demo-name" defaultValue={details.name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <span>E-mail</span>
            <Input id="sheet-demo-email" defaultValue={details.email} onChange={(e) => setEmail(e.target.value)} />
          </div>
           <div className="grid gap-3">
            <span>Telefonszám</span>
            <Input id="sheet-demo-phonenumber" defaultValue={details.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </div>
          <div className="grid gap-3">
            <span>Tapasztalat</span>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">{experience}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuGroup>
                    <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground" onClick={(e) => setExperience(EmployeeEditDataRequestDTOExperienceEnum.Junior)}>
                        Junior
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground" onClick={(e) => setExperience(EmployeeEditDataRequestDTOExperienceEnum.Senior)}>
                        Senior
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-accent hover:text-accent-foreground" onClick={(e) => setExperience(EmployeeEditDataRequestDTOExperienceEnum.Master)}>
                        Master
                    </DropdownMenuItem>
                   </DropdownMenuGroup>
                </DropdownMenuContent>
                </DropdownMenu>
          </div>
           <div className="grid gap-3">
            <span>Bio</span>
             <Textarea placeholder="Bio leírás" maxLength={200}  onChange={(e) => setBio(e.target.value)}/>
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