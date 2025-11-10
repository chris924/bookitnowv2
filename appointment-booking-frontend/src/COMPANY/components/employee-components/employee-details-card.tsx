import { EmployeeGetResponseDTO } from "@/API";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import { Pencil, Mail, Phone, Medal, Star, Book } from "lucide-react";

interface EmployeeDetailsCardProps{
    details: EmployeeGetResponseDTO;
}


export function EmployeeDetailsCard({details}: EmployeeDetailsCardProps)
{

    return(
         <Card className="p-6 md:p-8 shadow-md rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={details.avatarUrl || undefined} alt={details.name} />
          <AvatarFallback>{details.name?.charAt(0) || "?"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-semibold">{details.name}</CardTitle>
          <CardDescription className="text-gray-500">
            {details.type || "Employee"}
          </CardDescription>
          <div className="mt-2 text-sm text-gray-600">
            {details.company}
          </div>
        </div>
      </CardHeader>

      <Separator className="my-4" />

     <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-base sm:text-xl">
  <div className="flex items-center gap-2 flex-wrap">
    <Mail className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
    <span>{details.email || "N/A"}</span>
  </div>
  <div className="flex items-center gap-2 flex-wrap">
    <Phone className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
    <span>{details.phoneNumber || "N/A"}</span>
  </div>
  <div className="flex items-center gap-2 flex-wrap">
    <Medal className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
    {details.experience}
  </div>
  <div className="flex items-center gap-2 flex-wrap">
    <Star className="h-5 w-5 sm:h-4 sm:w-4 text-yellow-500" />
    {details.rating}
  </div>
  <div className="flex items-center gap-2 flex-wrap">
    <Book className="h-5 w-5 sm:h-4 sm:w-4 text-gray-500" />
    {details.about || "No description provided."}
  </div>
</CardContent>
    </Card>
  
    )
}