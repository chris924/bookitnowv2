import { EmployeeGetResponseDTO } from "@/API";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ItemContent, ItemTitle, ItemDescription, Item } from "@/components/ui/item";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { Mail, Phone, Medal, Star, Book, ChevronDown } from "lucide-react";
import { useState } from "react";
import EditSimpleData from "./employee-edit-simpledata";

interface EmployeeDetailsCardProps{
    details: EmployeeGetResponseDTO;
}


export function EmployeeDetailsCard({details}: EmployeeDetailsCardProps)
{

  const [open, setOpen] = useState(false);

    return(
         <Card className="p-6 md:p-8 shadow-md rounded-2xl h-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={details.avatarUrl || undefined} alt={details.name} />
          <AvatarFallback>{details.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <CardTitle className="text-3xl font-semibold">{details.name}</CardTitle>
          <CardDescription className="text-gray-500 text-2xl">
            {details.type || "Employee"}
          </CardDescription>
          <div className="mt-2 text-sm text-gray-600 text-xl">
            {details.company}
          </div>
        </div>

        <div>
          <Button onClick={() => setOpen(true)}>Alapadatok szerkeztése</Button>
           <EditSimpleData open={open} onOpenChange={setOpen} />
        </div>

      </CardHeader>

      <Separator className="" />

     <CardContent className="grid grid-cols-1 sm:grid-cols-2 h-auto sm:gap-4 sm:text-xl">
  <div className="flex items-center gap-2 flex-wrap">
    <Item variant="outline" className="lg:min-w-md">
      <Mail className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
        <ItemContent>
          
          <ItemTitle className="text-xl">E-mail cím</ItemTitle>
          <ItemDescription className="text-lg">
           {details.email || "-"}
          </ItemDescription>
        </ItemContent>   
      </Item>
  </div>
  <div className="flex items-center gap-2 flex-wrap">
     <Item variant="outline" className="lg:min-w-md">
      <Phone className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
        <ItemContent>
          
          <ItemTitle className="text-xl">Telefonszám</ItemTitle>
          <ItemDescription className="text-lg">
           {details.phoneNumber || "-"}
          </ItemDescription>
        </ItemContent>   
      </Item>
  </div>
  <div className="flex items-center gap-2 flex-wrap">
     <Item variant="outline" className="lg:min-w-md">
      <Medal className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
        <ItemContent>
          
          <ItemTitle className="text-xl">Tapasztalat</ItemTitle>
          <ItemDescription className="text-lg">
           {details.experience || "-"}
          </ItemDescription>
        </ItemContent>   
      </Item>
  </div>
  <div className="flex items-center gap-2 flex-wrap ">  
    <Item variant="outline" className="lg:min-w-md ">
      <Star className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-500" />
        <ItemContent>     
          <ItemTitle className="text-xl">Értékelés</ItemTitle>
          <ItemDescription className="text-lg">
           {details.rating || "-"}
          </ItemDescription>
        </ItemContent>   
      </Item>
  </div>
 <div className="flex items-center flex-wrap">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Item
            variant="outline"
            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors lg:min-w-md"
          >
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
              <ItemTitle className="text-lg">Bio</ItemTitle>
            </div>
            <ChevronDown className="h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180" />
          </Item>
        </CollapsibleTrigger>

        <CollapsibleContent className="px-4 py-2 text-sm text-gray-700 whitespace-pre-line">
          {details.about}
        </CollapsibleContent>
      </Collapsible>
  </div>
 
  </CardContent>
    </Card>
  
    )
}