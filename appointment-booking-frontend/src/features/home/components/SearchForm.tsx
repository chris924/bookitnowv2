
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import defaultImage from "@/assets/default.jpg"
import SpecialistSelectorForm from "../../../components/ui/own/specialist-selector(not-used)"
import BaseSearchForm, { BaseItemInterface } from "../../../components/ui/own/base-search-form"
import { CompanyDTO, EmployeeSearchOptionsResponseDTO, EmployeeSearchPayload, getSearchEmployeeCritera, PlaceDTO, SpecialistDTO } from "@/api/employee"
import SpecialistGrid from "./SpecialistGrid"


export default function SearchForm() {

   const [specialistName, setSpecialistName] = useState("");
  const [specialistCompany, setSpecialistCompany] = useState("");
  const [specialistPlace, setSpecialistPlace] = useState("");

  const [responseSpecialists, setResponseSpecialists] = useState<SpecialistDTO[]>([]);
  const [responsePlaces, setResponsePlaces] = useState<PlaceDTO[]>([]);
  const [responseCompanies, setResponseCompanies] = useState<CompanyDTO[]>([]);

  const [selectedSpecialist, setSelectedSpecialist] = useState<BaseItemInterface | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<BaseItemInterface | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<CompanyDTO | undefined>();

  const [isLoading, setIsLoading] = useState(true);

   const [gridResultSpecialists, setGridResultSpecialists] = useState<SpecialistDTO[]>([]);

  useEffect(() => {
  const handler = setTimeout(() => {
    const fetchSearchResults = async () => {
      setIsLoading(true);

      const payload: EmployeeSearchPayload = {
      name: specialistName,
      company: specialistCompany,
      place: specialistPlace,
    };

    console.log("PAYLOAD: ", payload)
    try{
    const response: EmployeeSearchOptionsResponseDTO  = await getSearchEmployeeCritera(payload);
    console.log(response)
    setResponseSpecialists(response.specialists);
    setResponsePlaces(response.places);
    setResponseCompanies(response.companies);

      if(selectedSpecialist || selectedCompany || selectedPlace)
        setGridResultSpecialists(response.specialists);
      else
        setGridResultSpecialists([]);

    }
    finally
    {
      setIsLoading(false);
    }
    
    }

    if(specialistCompany === "" && specialistName === "" && specialistPlace === "")
    {
      setResponseCompanies([]);
      setResponsePlaces([]);
      setResponseSpecialists([]);
    }
    
    if(specialistCompany !== "" || specialistName !== "" || specialistPlace !== "")
      fetchSearchResults();


    }, 300)

    return () => {
      clearTimeout(handler);
    };

  }, [specialistName, specialistCompany, specialistPlace])


  return (
    <div className="w-full flex flex-col justify-center items-center"> 

      <div className="max-w-5xl">
        <section className="space-y-5">
          <BaseSearchForm
            title="Szakember"
            type="specialist"
            options={responseSpecialists}
            onSelect={setSelectedSpecialist}
            onChange={setSpecialistName}
            selected={selectedSpecialist}

          />
          <BaseSearchForm
            title="Üzlet"
            type="company"
            options={responseCompanies}
            onSelect={setSelectedCompany}
            onChange={setSpecialistCompany}
            selected={selectedCompany}
          />
          <BaseSearchForm
            title="Hely"
            type="place"
            options={responsePlaces}
            onSelect={setSelectedPlace}
            onChange={setSpecialistPlace}
            selected={selectedPlace}
          />
        </section>
      </div>

      {/* Grid Container (full width, but content centered) */}
      {(gridResultSpecialists) && (selectedCompany || selectedPlace || selectedSpecialist) && (

          <div className="w-full mt-4 flex flex-grow justify-center">
            <section className="p-5 rounded-lg">
              {isLoading ? (
              <div className="text-center text-gray-500">Keresés folyamatban...</div>
            ) : (
              <SpecialistGrid specialists={gridResultSpecialists} />
            )}
            </section>
          </div>
        
      )}
    </div>
  );
}