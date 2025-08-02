import FeaturedSpecialist from "@/features/home/components/FeaturedSpecialist";
import SearchForm from "@/features/home/components/SearchForm";
import defaultImage from "@/assets/default.jpg"
import MostRatedSpecialist from "./components/MostRatedSpecialist";
import { useEffect, useState } from "react";
import { getMostRatedEmployees, TopRatedEmp } from "@/api/employee";



export default function HomeForm()
{
    const [topRatedEmployees, setTopRatedEmployees] = useState<TopRatedEmp[]>([]);
 
    let specialists = [
        {
          label: "John Doe",
          value: "john-doe",
          image: defaultImage,
          company: "TechCorp",
          rating: 4.7,
        },
        {
          label: "Anna Smith",
          value: "anna-smith",
          image:  defaultImage,
          company: "HealthPlus",
          rating: 4.9,
        },
        {
          label: "Marco Müller",
          value: "marco-muller",
          image:  defaultImage,
          company: "GreenCare",
          rating: 4.6,
        },
        {
            label: "John ",
            value: "john-doe",
            image: defaultImage,
            company: "TechCorp",
            rating: 4.7,
          },
          {
            label: "Anna ",
            value: "anna-smith",
            image:  defaultImage,
            company: "HealthPlus",
            rating: 4.9,
          },
          {
            label: "Marco ",
            value: "marco-muller",
            image:  defaultImage,
            company: "GreenCare",
            rating: 4.6,
          }
      ]
      
      useEffect(() => {

        async function fetchMostRatedEmployees()
        {
         try {
            const response = await getMostRatedEmployees();
            setTopRatedEmployees(response);
          //  console.log("RESPONSE:", response)
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

    {topRatedEmployees && <MostRatedSpecialist specialists={topRatedEmployees} />}
  </div>
);
}