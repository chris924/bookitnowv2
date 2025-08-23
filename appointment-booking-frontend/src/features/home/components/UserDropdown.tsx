import { useAuthStore } from "@/stores/AuthStore";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";


export default function DropdownUser()
{

  const {logout} = useAuthStore();

  async function handleDropDownClick(clickType: string)
  {
    if(clickType == "exit")
    {
      await logout();
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
          <DropdownMenuItem className="cursor-pointer text-2xl">Fiókom</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl">Időpontjaim</DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer text-2xl text-red-600" onClick={() => handleDropDownClick("exit")}>Kijelentkezés</DropdownMenuItem>
        </DropdownMenuContent>
  </DropdownMenu>
    )
}