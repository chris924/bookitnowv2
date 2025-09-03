import { useUserStore } from "@/stores/AuthStore";
import { useEffect, useState } from "react";
import GuestLogin from "../ui/own/GuestLogin";
import DropdownUser from "../../features/home/components/UserDropdown";
import { ModeToggle } from "../ui/own/theme-toggle";
import { Button } from "../ui/button";
import Loader from "../ui/own/Loader";
import { useLocation } from "react-router-dom";



export default function Navbar()
{
  
  const { checkAuth, isAuthenticated, user, loading } = useUserStore();
  
  const [openLogin, setOpenLogin] = useState(false);
  
  const loc = useLocation();

  useEffect(() => {
    checkAuth();    
  }, [])

    return (

        <>
  <header className="flex justify-between items-center px-4 py-4">
  <div className="text-m md:text-4xl font-semibold text-center justify-center">Appointment</div>
  <div className="flex items-center gap-x-1.5 md:gap-x-4">
  {loading ? (
    <Loader/>
  ) : isAuthenticated && user ? (
    <DropdownUser user={user} />
  ) : (
    <Button onClick={() => setOpenLogin(true)} className="bg-green-200">Belépés</Button>
  )}
  {!isAuthenticated && <Button variant={"secondary"}>Szolgáltatóknak</Button>}
  <GuestLogin open={openLogin} onOpenChange={setOpenLogin} />
  <ModeToggle />
</div>
  
</header>
</>


    )

}