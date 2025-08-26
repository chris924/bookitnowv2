import { getSpecificEmployeeContent } from "@/api/employee";
import { getUserData } from "@/api/user";
import { UserDataResponseDTO } from "@/lib/profile-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDetailsForm from "./components/UserDetailsForm";


export default function UserProfileContent()
{
    const { slug } = useParams();

    const [userData, setUserData] = useState<UserDataResponseDTO>();

    useEffect( () => {
    
    
            const fetchUserContent = async () => {
    
                try{
                    if (!slug) {
                        console.error("No slug provided in URL parameters.");
                        return;
                    }
    
                    const userContent = await getUserData(slug);
                    console.log("User Content:", userContent);
                    setUserData(userContent);
                    
                }catch (error) {
                    console.error("Error fetching user content:", error);
                }
    
           
            }
           
            fetchUserContent();
    
        }, [])


    return(
       userData &&  <UserDetailsForm userData={userData}/>
    )
}