import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Input } from "../input";

export default function GuestLogin()
{
    return(
        <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" 
          className="text-base md:text-3xl md:h-12 lg:text-3xl px-4 py-2 md:px-6 md:py-3 rounded-3xl">
            Belépés</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-center">Bejelentkezés</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              E-mail
            </Label>
            <Input id="email" value="" className="col-span-3" />
          </div>
          <Label className="text-right">
              Elfelejtett jelszó
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Jelszó
            </Label>
            <Input id="password" value="" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>            
          <Button type="submit" className="bg-blue-400">Belépés</Button>
        </DialogFooter>
        <Separator />
        <DialogDescription className="text-center">
          Ha még nem regisztráltál              
        </DialogDescription>
        <Button type="submit">Regisztráció</Button>
      </DialogContent>
    </Dialog>
    )
}