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

  const {logout} = useUserStore();
  const navigate = useNavigate();


  async function handleDropDownClick(clickType: string)
  {
    if(user.name && user.id)
    {
      const userSlug = await createSlug(user.name, parseInt(user.id.toString()));
      if(clickType == "exit")
      {
        await logout();
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
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user.avatarUrl} className="h-20 w-20 rounded-full" />
          <AvatarFallback>
            <img src={defaultAvatar} alt="default avatar" className="h-20 w-20 rounded-full" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-2xl" onClick={() => handleDropDownClick("account")}>Fiókom</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl" onClick={() => handleDropDownClick("appointments")}>Időpontjaim</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl text-red-600" onClick={() => handleDropDownClick("exit")}>Kijelentkezés</DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
    )
}