import { SpecialistDTO } from "@/API/models/SpecialistDTO";
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { showToast } from "@/components/ui/own/ShowToast";
import { createSlug } from "@/lib/utils";
import { useNavigate } from "react-router-dom";


interface SpecialistGridProps{
  specialists: SpecialistDTO[]
}

export default function SpecialistGrid({specialists} : SpecialistGridProps)
{

  const navigate = useNavigate();

if (specialists.length === 0) {
    return;
  }

  async function handleSpecialistClick(specialist: SpecialistDTO)
  {
    // Navigate to the specialist's page using the slug
    if(specialist.label && specialist.id)
    {
      const slug = await createSlug(specialist.label, specialist.id);
      navigate(`/employee/${slug}`);
    }
    else
      showToast.error("Label vagy Id nem definiált!");
    
  }

return(
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-10">
{specialists.map((specialist: SpecialistDTO) => (
   <Card className="cursor-pointer" onClick={() => handleSpecialistClick(specialist)} key={specialist.label}>
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