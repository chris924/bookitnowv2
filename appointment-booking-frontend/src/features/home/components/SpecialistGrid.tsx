import { SpecialistDTO } from "@/api/employee";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


export interface SpecialistGridInterface
{
    specialists: SpecialistDTO[];
}


export default function SpecialistGrid({specialists} : SpecialistGridInterface)
{

if (specialists.length === 0) {
    return;
  }

return(
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10">
{specialists.map((specialist: SpecialistDTO) => (
   <Card className="">
                         <CardContent className="flex flex-col aspect-square items-center justify-center p-6 space-y-8">
                           <img
                             src={specialist.image}
                             alt={specialist.label}
                             className="w-36 h-36 md:w-24 md:h-24 rounded-full object-cover"
                           >                     
                           </img>
                           <div className="flex flex-col items-center justify-center space-y-2">
                           <span className="text-3xl font-semibold">{specialist.label}</span>
                           <span className="text-1xl">{specialist.company}</span>
                           <span className="text-1xl text-yellow-500">⭐ {specialist.rating} </span>
                           </div>
                         </CardContent>
                       </Card>
)

)}


</div>
   

)

}