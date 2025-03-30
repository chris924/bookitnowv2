import { useAuthStore } from "@/stores/AuthStore";
import { useEffect } from "react";
import GuestLogin from "../../features/home/GuestLogin";
import DropdownUser from "../../features/home/UserDropdown";
import { ModeToggle } from "../ui/own/theme-toggle";



export default function Navbar()
{
  
  const { checkAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

    return (

        <>
  <header className="flex justify-between items-center px-4 py-4">
  <div className="md:text-3xl">Szolgáltatóknak</div>
  <div className="text-m md:text-4xl font-semibold">Appointment</div>
  <div className="flex items-center gap-x-1.5 md:gap-x-4">
    {isAuthenticated ? <DropdownUser /> : <GuestLogin />}
    <ModeToggle/>
  </div>
  
</header>
</>


    )

}