import { SpecialistDTO } from "@/API/models/SpecialistDTO";
import defaultImage from "@/assets/default.jpg";
import { showToast } from "@/components/ui/own/ShowToast";
import { createSlug } from "@/lib/utils";
import { ArrowRight, Building2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Clickable specialist tile used by the home page lists and the search results.
export default function SpecialistCard({ specialist }: { specialist: SpecialistDTO }) {
  const navigate = useNavigate();

  function handleClick() {
    if (specialist.label && specialist.id) {
      navigate(`/employee/${createSlug(specialist.label, specialist.id)}`);
    } else {
      showToast.error("Label vagy Id nem definiált!");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group flex h-full w-full cursor-pointer flex-col items-center rounded-2xl border bg-card p-4 text-center shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:p-6"
    >
      <img
        src={specialist.image || defaultImage}
        alt={specialist.label}
        className="size-16 rounded-full object-cover ring-4 ring-emerald-500/15 sm:size-20"
      />
      <h3 className="mt-3 line-clamp-1 text-base font-semibold sm:mt-4 sm:text-lg">{specialist.label}</h3>
      {specialist.company && (
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground sm:text-sm">
          <Building2 className="size-3.5 shrink-0 sm:size-4" />
          <span className="line-clamp-1">{specialist.company}</span>
        </p>
      )}
      {specialist.rating != null && (
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 sm:text-sm dark:text-amber-400">
          <Star className="size-3.5 fill-current sm:size-4" />
          {specialist.rating.toFixed(1)}
        </span>
      )}
      <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-emerald-600 sm:text-sm dark:text-emerald-400">
        Időpontfoglalás
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 sm:size-4" />
      </span>
    </button>
  );
}
