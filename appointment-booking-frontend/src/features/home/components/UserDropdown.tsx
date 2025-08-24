import { createSlug } from "@/lib/utils";
import { useAuthStore, User } from "@/stores/AuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useNavigate } from "react-router-dom";


export default function DropdownUser({user}: {user: User} )
{

  const {logout} = useAuthStore();
  const navigate = useNavigate();

  async function handleDropDownClick(clickType: string)
  {
    if(clickType == "exit")
    {
      await logout();
    }
    if(clickType == "account")
    {
      console.log("USER IS:", user);
      const userSlug = await createSlug(user.name, parseInt(user.id));
      navigate(`/user/${userSlug}`)
    }
  }

    return(
        <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" className="h-20 w-20 rounded-full" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer text-2xl" onClick={() => handleDropDownClick("account")}>Fiókom</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl">Időpontjaim</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl text-red-600" onClick={() => handleDropDownClick("exit")}>Kijelentkezés</DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
    )
}