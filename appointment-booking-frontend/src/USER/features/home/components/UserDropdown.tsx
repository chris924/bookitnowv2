import { createSlug } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "@/assets/default.jpg"
import { useUserStore } from "@/stores/AuthStore";
import { UserDataResponseDTO } from "@/API/models/UserDataResponseDTO";
import { showToast } from "@/components/ui/own/ShowToast";

export default function DropdownUser({user}: {user: UserDataResponseDTO} )
{

  const {logoutUser} = useUserStore();
  const navigate = useNavigate();


  async function handleDropDownClick(clickType: string)
  {
    if(user.name && user.id)
    {
      const userSlug = await createSlug(user.name, parseInt(user.id.toString()));
      if(clickType == "exit")
      {
        await logoutUser();
        navigate("/");
      }
      if(clickType == "account")
      {
        console.log("USER IS:", user);
        
        navigate(`/user/${userSlug}`)
      }
      if(clickType == "appointments")
      {
        navigate(`/user/${userSlug}/booked-appointments`);
      }
    }
    else
      showToast.error("Név vagy Id hiányzik!");
  }

    return(
        <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
        <Avatar>
          <AvatarImage src={user.avatarUrl} className="size-10 rounded-full object-cover" />
          <AvatarFallback>
            <img src={defaultAvatar} alt="default avatar" className="size-10 rounded-full object-cover" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8} className="z-50 min-w-44 rounded-xl border bg-popover p-1 text-popover-foreground shadow-lg">
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent" onClick={() => handleDropDownClick("account")}>Fiókom</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm outline-none data-[highlighted]:bg-accent" onClick={() => handleDropDownClick("appointments")}>Időpontjaim</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 outline-none data-[highlighted]:bg-accent" onClick={() => handleDropDownClick("exit")}>Kijelentkezés</DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
    )
}