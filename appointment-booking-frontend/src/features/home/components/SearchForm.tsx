
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import defaultImage from "@/assets/default.jpg"
import SpecialistSelectorForm from "../../../components/ui/own/specialist-selector(not-used)"
import BaseSearchForm, { BaseItemInterface } from "../../../components/ui/own/base-search-form"
import { CompanyDTO, EmployeeSearchOptionsResponseDTO, EmployeeSearchPayload, getSearchEmployeeCritera, PlaceDTO, SpecialistDTO } from "@/api/employee"


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

  useEffect(() => {
  const handler = setTimeout(() => {
    const fetchSearchResults = async () => {
      

      const payload: EmployeeSearchPayload = {
      name: specialistName,
      company: specialistCompany,
      place: specialistPlace,
    };

    console.log("PAYLOAD: ", payload)

    const response: EmployeeSearchOptionsResponseDTO  = await getSearchEmployeeCritera(payload);
    console.log(response)
    setResponseSpecialists(response.specialists);
    setResponsePlaces(response.places);
    setResponseCompanies(response.companies);
    }
    
    fetchSearchResults();


    }, 300)

    return () => {
      clearTimeout(handler);
    };

  }, [specialistName, specialistCompany, specialistPlace])

  const FormSchema = z.object({
    specialist: z.string({
      required_error: "Please select a specialist.",
    }),
  })

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })
 
  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Submitted succesfully!")
  }
  
  const [open, setOpen] = useState(false);

  return (
    <>
    <div className="space-y-5">
    <BaseSearchForm title={"Szakember"} type="specialist" options={responseSpecialists} onSelect={(selectedSpec) => setSelectedSpecialist(selectedSpec)} onChange={(specialistName) => setSpecialistName(specialistName)} selected={selectedSpecialist} />
    <BaseSearchForm title={"Üzlet"} type="company" options={responseCompanies} onSelect={(selectedComp) => setSelectedCompany(selectedComp)} onChange={(specialistCompany) => setSpecialistCompany(specialistCompany)} selected={selectedCompany} />
    <BaseSearchForm title={"Hely"} type="place" options={responsePlaces} onSelect={(selectedPlace) => setSelectedPlace(selectedPlace)} onChange={(specialistPlace) => setSpecialistPlace(specialistPlace)} selected={selectedPlace} />
    </div>
    
    </>
  )

}