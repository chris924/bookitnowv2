import { useState } from "react";
import UserDetailsForm from "./components/UserDetailsForm";
import Loader from "@/components/ui/own/Loader";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { UserDataQuery } from "@/USER/hooks/query/UserDataQuery";


export default function UserProfileContent()
{

    const {data: userData, isLoading, error} = UserDataQuery();  // Not used yet, might need it!!

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