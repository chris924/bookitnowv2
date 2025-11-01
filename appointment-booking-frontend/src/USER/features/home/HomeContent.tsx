
import defaultImage from "@/assets/default.jpg"
import MostRatedSpecialist from "./components/MostRatedSpecialist";
import { useEffect, useState } from "react";
import FeaturedSpecialist from "./components/FeaturedSpecialist";
import SearchForm from "./components/SearchForm";
import { SpecialistDTO } from "@/API/models/SpecialistDTO";
import { EmployeeGetResponseDTO } from "@/API";
import { useApi } from "@/hooks/useApi";



export default function HomeContent()
{
    const [topRatedEmployees, setTopRatedEmployees] = useState<EmployeeGetResponseDTO[]>([]);
    const api = useApi();
 
    let specialists = [
        {
          id: 1,
          label: "John Doe",
          value: "john-doe",
          image: defaultImage,
          company: "TechCorp",
          rating: 4.7,
          about: "TEST",
        },
        {
          id: 2,
          label: "Buckó",
          value: "anna-smith",
          image:  defaultImage,
          company: "HealthPlus",
          rating: 4.9,
          about: "TEST",
        },
        {
          id: 3,
          label: "Marco Müller",
          value: "marco-muller",
          image:  defaultImage,
          company: "GreenCare",
          rating: 4.6,
          about: "TEST",
        },
        {
          id: 4,
            label: "John ",
            value: "john-doe",
            image: defaultImage,
            company: "TechCorp",
            rating: 4.7,
            about: "TEST",
          },
          {
            id: 5,
            label: "Anna ",
            value: "anna-smith",
            image:  defaultImage,
            company: "HealthPlus",
            rating: 4.9,
            about: "TEST",
          },
          {
            id: 6,
            label: "Marco ",
            value: "marco-muller",
            image:  defaultImage,
            company: "GreenCare",
            rating: 4.6,
            about: "TEST",
          }
      ]
      
      useEffect(() => {

        async function fetchMostRatedEmployees()
        {
         try {
          
          const response = await api.employee.getMostRatedEmployees();
          setTopRatedEmployees(response);
          } catch (error) {
            console.error('Failed to fetch top-rated employees:', error);
          }
        } 
        
        fetchMostRatedEmployees();
      }, [])


   return (
  <div className="flex flex-col items-center text-center px-4">
    <div className="text-3xl md:text-6xl mt-24">
      <p>Foglalj időpontot profikhoz,</p>
    </div>

    <div className="text-3xl md:text-6xl pt-3.5 pb-20">
      <p>még ma!</p>
    </div>

    <div className="w-full">
      <SearchForm />
    </div>
    

    <div className="mt-20 mb-10 text-xl md:text-4xl">
      Kiemelt Szakemberek
    </div>

    <FeaturedSpecialist specialists={specialists} />

    <div className="mt-20 mb-10 text-xl md:text-4xl">
      Legjobbra értékelt Szakemberek
    </div>

    {topRatedEmployees.length > 0 && <MostRatedSpecialist specialists={topRatedEmployees} />}
  </div>
);
}