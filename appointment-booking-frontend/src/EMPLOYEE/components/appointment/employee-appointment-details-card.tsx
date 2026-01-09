import { AppointmentGetResponseDTO } from "@/API"
import EditSimpleData from "@/COMPANY/components/employee-components/employee-edit-simpledata"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ItemContent, ItemTitle, ItemDescription, Item } from "@/components/ui/item"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import defaultAvatar from "../../../assets/default.jpg"
import { Separator } from "@/components/ui/separator"
import { formatDuration, formatTime } from "@/lib/utils"

type EmployeeAppointmentDetailsCard = {
    appointment: AppointmentGetResponseDTO
}
//TODO: Wrapper for the card sections? (Company-Employee etc.)
export default function EmployeeAppointmentDetailsCard({appointment}: EmployeeAppointmentDetailsCard)
{
    console.log("APPOINTMENT: ", appointment);

    return(
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
            </div>
            </div>

           
          </ItemDescription>
        </ItemContent>   
      </Item>
    </div>
    
    </CardContent>
        </Card>
  
)

}