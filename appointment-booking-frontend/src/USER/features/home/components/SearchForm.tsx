import { useState, useEffect } from "react";
import SpecialistGrid from "./SpecialistGrid";
import BaseSearchForm from "@/components/ui/own/base-search-form";
import { UserSearchResultsQuery } from "@/USER/hooks/query/UserSearchResultsQuery";
import Loader from "@/components/ui/own/Loader";
import { SpecialistDTO, PlaceDTO, CompanyDTO, EmployeeSearchRequestDTO, GetSearchEmployeeRequest } from "@/API";

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
    <div className="w-full flex flex-col justify-center items-center">
      <div className="max-w-5xl">
        <section className="space-y-5">
          <BaseSearchForm<SpecialistDTO>
            title="Szakember"
            type="specialist"
            options={specialists}
            onSelect={setSelectedSpecialist}
            onChange={setSpecialistName}
            selected={selectedSpecialist}
          />
          <BaseSearchForm<CompanyDTO>
            title="Üzlet"
            type="company"
            options={companies}
            onSelect={setSelectedCompany}
            onChange={setSpecialistCompany}
            selected={selectedCompany}
          />
          <BaseSearchForm<PlaceDTO>
            title="Hely"
            type="place"
            options={places}
            onSelect={setSelectedPlace}
            onChange={setSpecialistPlace}
            selected={selectedPlace}
          />
        </section>
      </div>

      {shouldShowGrid && (
        <div className="w-full mt-4 flex flex-grow justify-center">
          <section className="p-5 rounded-lg">
            {isFetching ? (
              <Loader></Loader>
            ) : (
              <SpecialistGrid specialists={specialists} />
            )}
          </section>
        </div>
      )}
    </div>
  );
}