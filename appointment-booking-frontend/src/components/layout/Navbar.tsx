import { useAuthStore } from "@/stores/AuthStore";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Separator } from "../ui/separator";
import GuestLogin from "../ui/own/guest-login";
import DropdownUser from "../ui/own/dropdown-user";
import { ModeToggle } from "../ui/own/theme-toggle";



export default function Navbar()
{
  
  const { checkAuth, isAuthenticated } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [])

    return (

        <>
  <header className="flex justify-between items-center px-4 py-2">
  <div>HELP</div>
  <div className="text-xl font-semibold">Appointment Booking</div>
  <div className="flex items-center gap-x-4">
    {isAuthenticated ? <DropdownUser /> : <GuestLogin />}
    <ModeToggle/>
  </div>
  
</header>
</>


    )

}