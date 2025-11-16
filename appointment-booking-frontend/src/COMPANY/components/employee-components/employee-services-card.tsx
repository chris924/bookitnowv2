import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ItemContent, ItemTitle, ItemDescription, Item } from "@/components/ui/item";
import { Mail, Phone, Medal, Star, Book, ChevronDown, Scissors } from "lucide-react";
import EditSimpleData from "./employee-edit-simpledata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ServiceGetResponseDTO } from "@/API";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import EmployeeEditServices from "./employee-edit-services";

interface EmployeeServicesCardProps {
    services:  ServiceGetResponseDTO[]
}


export default function EmployeeServicesCard({services}: EmployeeServicesCardProps)
{
    const [openEditServices, setOpenEditServices] = useState(false);

      return(
       
          <Card className="p-6 md:p-8 shadow-md rounded-2xl h-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <div className="flex-1 text-center sm:text-left">
          <CardTitle className="text-3xl font-semibold">Szolgáltatások</CardTitle>
        </div>
      </CardHeader>
      <Separator className="" />
         <CardContent className="grid grid-cols-1 sm:grid-cols-2 h-auto sm:gap-4 sm:text-xl">
 
    {services.map((service) => (
         <div className="flex items-center gap-2 flex-wrap justify-between">
        <Item variant="outline" className="lg:min-w-md">
      <Scissors className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
        <ItemContent>  
          <ItemTitle className="text-xl">{service.name}</ItemTitle>
          <ItemDescription className="text-lg">
           
           <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 text-md text-gray-700">
              <p><span className="font-medium">Leírás:</span> {service.description || "-"}</p>
              <p><span className="font-medium">Ár:</span> {service.price ? `${service.price} Ft` : "-"}</p>
              <p><span className="font-medium">Időtartam:</span> {service.duration || "-"}</p>
            </div>

            <div className="flex justify-center">
            <Button className="self-start" onClick={() => setOpenEditServices(true)}>
              Szerkesztés
            </Button>
            </div>
            <EmployeeEditServices
              service={service}
              open={openEditServices}
              onOpenChange={setOpenEditServices}
            />
          </div>
          </ItemDescription>
        </ItemContent>   
      </Item>
    </div>
    ))}
    
 
  </CardContent>



      </Card>
    )
}