import { useUserStore } from "@/stores/AuthStore";
import { useEffect, useState } from "react";
import GuestLogin from "../ui/own/GuestLogin";
import { ModeToggle } from "../ui/own/theme-toggle";
import { Button } from "../ui/button";
import Loader from "../ui/own/Loader";
import { useLocation } from "react-router-dom";
import ProviderLoginFormWrapper from "../ui/own/ProviderLoginFormWrapper";
import DropdownUser from "@/USER/features/home/components/UserDropdown";



export default function Navbar()
{
  
  const { checkUserAuth, isAuthenticated, user, userLoading } = useUserStore();
  
  const [openLogin, setOpenLogin] = useState(false);
  const [showProviderWrapper, setShowProviderWrapper] = useState(false);

  const location = useLocation();

  useEffect(() => {
    checkUserAuth();    
  }, [])

    return (

        <>
  <header className="flex justify-between items-center px-4 py-4">
  <div className="text-m md:text-4xl font-semibold text-center justify-center">Appointment</div>
  <div className="flex items-center gap-x-1.5 md:gap-x-4">
  {userLoading ? (
    <Loader/>
  ) : isAuthenticated && user ? (
    <DropdownUser user={user} />
  ) : (
    <Button onClick={() => setOpenLogin(true)} className="bg-green-200">Belépés</Button>
  )}
  {!isAuthenticated && location.pathname == "/" && <Button variant={"secondary"} onClick={() => setShowProviderWrapper(true)}>Szolgáltatóknak</Button>}
  <GuestLogin open={openLogin} onOpenChange={setOpenLogin} />
  <ProviderLoginFormWrapper open={showProviderWrapper} onOpenChange={setShowProviderWrapper}/>
  <ModeToggle />
</div>
  
</header>
</>


    )

}