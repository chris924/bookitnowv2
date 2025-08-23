import { useAuthStore } from "@/stores/AuthStore";
import { useEffect, useState } from "react";
import GuestLogin from "../ui/own/GuestLogin";
import DropdownUser from "../../features/home/components/UserDropdown";
import { ModeToggle } from "../ui/own/theme-toggle";
import { Button } from "../ui/button";



export default function Navbar()
{
  
  const { checkAuth, isAuthenticated } = useAuthStore();
  const [openLogin, setOpenLogin] = useState(false);

  useEffect(() => {
    checkAuth()
  }, [])

    return (

        <>
  <header className="flex justify-between items-center px-4 py-4">
  <div className="md:text-3xl">Szolgáltatóknak</div>
  <div className="text-m md:text-4xl font-semibold">Appointment</div>
  <div className="flex items-center gap-x-1.5 md:gap-x-4">
    {isAuthenticated ? <DropdownUser /> : <Button className="" onClick={() => setOpenLogin(true)}>Belépés</Button>}
      <GuestLogin  open={openLogin} onOpenChange={setOpenLogin} />
    <ModeToggle/>
  </div>
  
</header>
</>


    )

}