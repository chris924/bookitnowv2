import { DialogTitle } from "@radix-ui/react-dialog";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import { RegisterUserRequest } from "@/API";


export default function GuestRegisterForm()
{
   const [email, setEmail] = useState("");
   const [emailConfirm, setEmailConfirm] = useState("");
   const [name, setName] = useState("");
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");
   const [passwordConfirm, setPasswordConfirm] = useState("");

   const navigate = useNavigate();
   const api = useApi();

  const {mutate, isPending, isError, error} = useMutation({

    mutationFn: (request: RegisterUserRequest) => api.userAuth.registerUser(request),
    onSuccess: async (data) => {
      console.log('Registered:', data);
      navigate("/");
    }
  })


   const handleRegister = (e: React.MouseEvent) => {
      e.preventDefault();
      mutate({userRegistrationDTO: {name, username, email, password}})
   }


   const isPasswordMatch =
  password.length > 0 &&
  password === passwordConfirm;

  const isEmailMatch =
    email.length > 0 &&
    email === emailConfirm;

  const isFormValid =
    name.trim() !== "" &&
    username.trim() !== "" &&
    isPasswordMatch &&
    isEmailMatch;

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
              {passwordConfirm && !isPasswordMatch && (
              <p className="text-sm text-red-500">
                A jelszavak nem egyeznek
              </p>
            )}

            {emailConfirm && !isEmailMatch && (
              <p className="text-sm text-red-500">
                Az email címek nem egyeznek
              </p>
            )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-400"
                onClick={(e) => handleRegister(e)}
                disabled={!isFormValid}
              >
                Regisztráció
              </Button>
            </DialogFooter>
          </>
 )   
}