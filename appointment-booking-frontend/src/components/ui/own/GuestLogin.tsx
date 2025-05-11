import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Input } from "../input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";

export default function GuestLogin()
{

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const {mutate, isPending, isError, error} = useMutation({

    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log('Logged in:', data);
      await useAuthStore.getState().checkAuth();
      navigate("/");
    }
  })


  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate({ email, password });
  };

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
            <Input id="email" value={email} className="col-span-3" onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <Label className="text-right">
              Elfelejtett jelszó
          </Label>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Jelszó
            </Label>
            <Input id="password" type="password" value={password} className="col-span-3" onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <DialogFooter>            
          <Button type="submit" className="bg-blue-400" onClick={(e) => handleSubmit(e)}>Belépés</Button>
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