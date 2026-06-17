import { AppointmentGetResponseDTO } from "@/API"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ItemContent, ItemTitle, ItemDescription, Item } from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import defaultAvatar from "../../../assets/default.jpg"
import { Separator } from "@/components/ui/separator"
import { formatDuration, formatTime, handleAPIError } from "@/lib/utils"
import { useState } from "react"
import ApproveDialogForm from "@/components/ui/own/ApproveDialogForm"
import { showToast } from "@/components/ui/own/ShowToast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "@/hooks/useApi"
import { useNavigate } from "react-router-dom"

type EmployeeAppointmentDetailsCard = {
    appointment: AppointmentGetResponseDTO
}
//TODO: Wrapper for the card sections? (Company-Employee etc.)
export default function EmployeeAppointmentDetailsCard({appointment}: EmployeeAppointmentDetailsCard)
{
    const [showCancelAppointment, setShowCancelAppointment] = useState(false);
     
      const api = useApi();
      const queryClient = useQueryClient();
      const navigate = useNavigate();

      const isFuture = new Date(appointment.slotResponseDTO.date) > new Date(); //TODO: Include time aswell, not just date

 

     const {mutate, isPending, isError, error} = useMutation({
    
        mutationFn: (appointmentId: number) => api.appointment.employeeCancelAppointment({appointmentId}), //TODO: This mutation is in Employee/data-table aswell!!
        onSuccess: async () => {
          showToast.success("Foglalás lemondva!");
          setShowCancelAppointment(false);
          await queryClient.invalidateQueries({queryKey: ["employeeSectionCards"]});
          await queryClient.invalidateQueries({ queryKey: ["EmployeeAppointments"] });
          await queryClient.invalidateQueries({ queryKey: ["pastEmployeeAppointments"] });
          await queryClient.invalidateQueries({queryKey: ["employeeDedicatedAppointment"]});
        },
        onError: (error) => handleAPIError(error)
      })
    
    function cancelAppointment(appointmentId : number)
    {
      mutate(appointmentId);
    }
    
    
    function handleCancelClick(id: number) {
      setShowCancelAppointment(true);
    }

    return(
      <>
           <Card className="p-6 md:p-8 shadow-md rounded-2xl h-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={appointment.userAvatarUrl} alt={appointment.userName} />
           <AvatarFallback>
            <img
            src={defaultAvatar}
            alt="Default avatar"
            className="h-full w-full object-cover rounded-full"
            />
        </AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <CardTitle className="text-3xl font-semibold">{appointment.userName}</CardTitle>
        </div>
        </CardHeader>
        <Separator className="" />
         <CardContent className="grid grid-cols-1 sm:grid-cols-2 h-auto sm:gap-4 sm:text-xl">

         <div className="flex items-center gap-2 flex-wrap justify-between">
        <Item variant="outline" className="lg:min-w-md">
        <ItemContent>  
          <ItemTitle className="text-xl">{"Foglalás részletei"}</ItemTitle>
          <ItemDescription className="text-lg">
           
           <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-md text-gray-700">
                <p><span className="font-medium">Dátum:</span> { appointment.slotResponseDTO.date + " " + formatTime(appointment.slotResponseDTO.start) + "-" + formatTime(appointment.slotResponseDTO.end) || "-"}</p>
              <p><span className="font-medium">Szolgáltatás:</span> { appointment.serviceName || "-"}</p>
              <p><span className="font-medium">Ár:</span> {appointment.servicePrice + " Ft" || "-" }</p>
              <p><span className="font-medium">Időtartam: </span>{ formatDuration(appointment.duration) || "-"}</p>
              <p><span className="font-medium">Státusz: </span>{ appointment.slotResponseDTO.status || "-"}</p>
            </div>
           
          { appointment.slotResponseDTO.status === "Booked" && <Button variant="destructive" onClick={() => handleCancelClick(appointment.slotResponseDTO.id)}>{isFuture ? "Foglalás lemondás": "Nem jött el"}</Button> }
            </div>

           
          </ItemDescription>
        </ItemContent>   
      </Item>
    </div>
    
    </CardContent>
        </Card>

         {showCancelAppointment && (
          <ApproveDialogForm
          title={isFuture ? "Foglalás lemondás" : "Nem jött el"}
          description= {isFuture ? "Biztosan lemondod a foglalást? Az időpont újra foglalható lesz amíg a munakarend nincs átállítva!" : "Biztosan nem jött el az Ügyyfél?"}
          onButtonClick={(value) => cancelAppointment(parseInt(value))}
          value={appointment.slotResponseDTO.id.toString()}
          onOpenChange={setShowCancelAppointment}
          open={showCancelAppointment}
          buttonVariant="destructive"
          isLoading={isPending}
        />
    )}

    </>
  
)

}