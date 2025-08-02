
import { useEffect, useState } from "react"
import BaseSearchForm from "../../../components/ui/own/base-search-form"
import {  EmployeeSearchOptionsResponseDTO, EmployeeSearchPayload, getSearchEmployeeCritera} from "@/api/employee"
import SpecialistGrid from "./SpecialistGrid"
import { SpecialistDTO, CompanyDTO, PlaceDTO } from '@/lib/specialist-types';

export default function SearchForm() {

   const [specialistName, setSpecialistName] = useState("");
  const [specialistCompany, setSpecialistCompany] = useState("");
  const [specialistPlace, setSpecialistPlace] = useState("");

  const [responseSpecialists, setResponseSpecialists] = useState<SpecialistDTO[]>([]);
  const [responsePlaces, setResponsePlaces] = useState<PlaceDTO[]>([]);
  const [responseCompanies, setResponseCompanies] = useState<CompanyDTO[]>([]);

  const [selectedSpecialist, setSelectedSpecialist] = useState<SpecialistDTO | undefined>();
  const [selectedPlace, setSelectedPlace] = useState<PlaceDTO | undefined>();
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
    
    fetchSearchResults();


    }, 300)

    return () => {
      clearTimeout(handler);
    };

  }, [specialistName, specialistCompany, specialistPlace, selectedSpecialist])


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
            isLoading={isLoading}

          />
          <BaseSearchForm<CompanyDTO>
            title="Üzlet"
            type="company"
            options={responseCompanies}
            onSelect={setSelectedCompany}
            onChange={setSpecialistCompany}
            selected={selectedCompany}
            isLoading={isLoading}
          />
          <BaseSearchForm
            title="Hely"
            type="place"
            options={responsePlaces}
            onSelect={setSelectedPlace}
            onChange={setSpecialistPlace}
            selected={selectedPlace}
            isLoading={isLoading}
          />
        </section>
      </div>

      {(gridResultSpecialists) && (

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