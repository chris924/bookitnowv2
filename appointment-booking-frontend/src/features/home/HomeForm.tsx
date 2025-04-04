import FeaturedSpecialist from "@/features/home/components/FeaturedSpecialist";
import SearchForm from "@/features/home/components/SearchForm";
import defaultImage from "@/assets/default.jpg"
import MostRatedSpecialist from "./components/MostRatedSpecialist";

export default function HomeForm()
{
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



    return(
        <>
        <div className="text-3xl md:text-6xl text-center mt-24">
        <p>Foglalj időpontot profikhoz,</p>
       

        </div>
        <div className="text-3xl md:text-6xl text-center pt-3.5 pb-20 ">
        <p>még ma!</p>
        </div>
          
        <div className="flex justify-center">
        <SearchForm/>   
        </div>

        <div className="flex justify-center m-10 text-xl md:text-4xl">
            Kiemelt Szakemberek
        </div>

        <div className="flex justify-center">    
        <FeaturedSpecialist specialists={specialists}/>
        </div>

        <div className="flex justify-center m-10 text-xl md:text-4xl">
            Legjobbra értékelt Szakemberek
        </div>

        <div className="flex justify-center">    
        <MostRatedSpecialist specialists={specialists}/>
        </div>

        </>
    )
}