import { useState, useEffect } from "react";
import SpecialistGrid from "./SpecialistGrid";
import BaseSearchForm from "@/components/ui/own/base-search-form";
import { UserSearchResultsQuery } from "@/USER/hooks/query/UserSearchResultsQuery";
import Loader from "@/components/ui/own/Loader";
import { SpecialistDTO, PlaceDTO, CompanyDTO, EmployeeSearchRequestDTO, GetSearchEmployeeRequest } from "@/API";
import { Building2, MapPin, UserRound } from "lucide-react";

export default function SearchForm() {
  const [specialistName, setSpecialistName] = useState("");
  const [specialistCompany, setSpecialistCompany] = useState("");
  const [specialistPlace, setSpecialistPlace] = useState("");

interface EmployeeSearchPayload {
  name: string;
  company: string;
  place: string;
}

  const [debouncedCriteria, setDebouncedCriteria] = useState<EmployeeSearchPayload>({
    name: "",
    company: "",
    place: "",
  });

  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistDTO | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceDTO | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<CompanyDTO | undefined>();

  // Debounce input criteria so we don’t fire on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCriteria({
        name: specialistName,
        company: specialistCompany,
        place: specialistPlace,
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [specialistName, specialistCompany, specialistPlace]);


  const searchCriteria: EmployeeSearchRequestDTO= {
    name: selectedSpecialist?.value ?? debouncedCriteria.name,
    company: selectedCompany?.value ?? debouncedCriteria.company,
    place: selectedPlace?.value ?? debouncedCriteria.place,
  }

  const searchCriteriaFinal: GetSearchEmployeeRequest = {
    employeeSearchRequestDTO: searchCriteria
  };


  const { data, isLoading, isFetching, error } = UserSearchResultsQuery(searchCriteriaFinal);

  const specialists = data?.specialists ?? [];
  const companies = data?.companies ?? [];
  const places = data?.places ?? [];

  const shouldShowGrid = selectedSpecialist || selectedCompany || selectedPlace;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-4xl rounded-2xl border bg-card/80 p-3 text-left shadow-xl shadow-emerald-950/5 backdrop-blur sm:p-4">
        <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <BaseSearchForm<SpecialistDTO>
            title="Szakember"
            type="specialist"
            icon={UserRound}
            options={specialists}
            onSelect={setSelectedSpecialist}
            onChange={setSpecialistName}
            selected={selectedSpecialist}
          />
          <BaseSearchForm<CompanyDTO>
            title="Üzlet"
            type="company"
            icon={Building2}
            options={companies}
            onSelect={setSelectedCompany}
            onChange={setSpecialistCompany}
            selected={selectedCompany}
          />
          <BaseSearchForm<PlaceDTO>
            title="Hely"
            type="place"
            icon={MapPin}
            options={places}
            onSelect={setSelectedPlace}
            onChange={setSpecialistPlace}
            selected={selectedPlace}
          />
        </section>
      </div>

      {shouldShowGrid && (
        <section className="mt-10 w-full max-w-6xl text-left">
          <h2 className="mb-4 text-lg font-semibold md:text-xl">Találatok</h2>
          {isFetching ? (
            <div className="flex justify-center py-6"><Loader /></div>
          ) : (
            <SpecialistGrid specialists={specialists} />
          )}
        </section>
      )}
    </div>
  );
}