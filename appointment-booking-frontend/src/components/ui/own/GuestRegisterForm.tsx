import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { DialogHeader, DialogFooter } from "../dialog";
import { Input } from "../input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/api/user";
import { useMutation } from "@tanstack/react-query";


export default function GuestRegisterForm()
{
   const [email, setEmail] = useState("");
   const [emailConfirm, setEmailConfirm] = useState("");
   const [name, setName] = useState("");
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [passwordConfirm, setPasswordConfirm] = useState("");

   const navigate = useNavigate();

  const {mutate, isPending, isError, error} = useMutation({

    mutationFn: registerUser,
    onSuccess: async (data) => {
      console.log('Registered:', data);
      navigate("/");
    }
  })


   const handleRegister = (e: React.MouseEvent) => {
      e.preventDefault();
      mutate({name, username, email, password})
   }


 return (
    <>
            <DialogHeader>
              <DialogTitle className="text-center">Regisztráció</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
               <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Név</Label>
                <Input
                  id="name"
                  value={name}
                  className="col-span-3"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nicknév</Label>
                <Input
                  id="username"
                  value={username}
                  className="col-span-3"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">E-mail</Label>
                <Input
                  id="email"
                  value={email}
                  className="col-span-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">E-mail megerősítés</Label>
                <Input
                  id="emailConfirm"
                  value={emailConfirm}
                  className="col-span-3"
                  onChange={(e) => setEmailConfirm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Jelszó</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  className="col-span-3"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Jelszó megerősítés</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  className="col-span-3"
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-400"
                onClick={(e) => handleRegister(e)}
              >
                Regisztráció
              </Button>
            </DialogFooter>
          </>
 )   
}