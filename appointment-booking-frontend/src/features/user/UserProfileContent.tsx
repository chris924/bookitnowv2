import { getSpecificEmployeeContent } from "@/api/employee";
import { getUserData } from "@/api/user";
import { UserDataResponseDTO } from "@/lib/profile-types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserDetailsForm from "./components/UserDetailsForm";
import { handleAPIError } from "@/lib/utils";
import Loader from "@/components/ui/own/Loader";


export default function UserProfileContent()
{
    const { slug } = useParams();

    const [userData, setUserData] = useState<UserDataResponseDTO>();
    const [isLoading, setIsLoading] = useState(false);

   const fetchUserContent = async () => {
  try {

    setIsLoading(true);

    if (!slug) {
      console.error("No slug provided in URL parameters.");
      return;
    }

    const userContent = await getUserData(slug);
    console.log("User Content:", userContent);
    setUserData(userContent);
  } catch (error) {
    handleAPIError(error);
  } finally{
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchUserContent();
}, [slug]); 

return (
    <>
    {isLoading ? <Loader/> : ""}
    {userData && (
    <UserDetailsForm
     // userData={userData}
   //   setUserData={setUserData} 
    />
  )}
  </>
);
}