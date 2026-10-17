import { SpecialistDTO } from "@/API/models/SpecialistDTO";
import SpecialistCard from "./SpecialistCard";


interface SpecialistGridProps{
  specialists: SpecialistDTO[]
}

export default function SpecialistGrid({specialists} : SpecialistGridProps)
{
  if (specialists.length === 0) {
    return <p className="py-6 text-center text-muted-foreground">Nincs a keresésnek megfelelő szakember.</p>;
  }

  return (
    // Phones: two per row, an odd last card centered. From sm up: fixed-width tracks that stay
    // centered however many cards there are.
    <div className="flex flex-wrap justify-center gap-3 *:w-[calc(50%-0.375rem)] sm:grid sm:grid-cols-[repeat(auto-fit,minmax(13rem,15rem))] sm:gap-5 sm:*:w-auto">
      {specialists.map((specialist) => (
        <SpecialistCard key={specialist.id ?? specialist.label} specialist={specialist} />
      ))}
    </div>
  );
}
