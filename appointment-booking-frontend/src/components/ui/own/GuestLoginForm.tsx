import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { DialogHeader, DialogFooter } from "../dialog";
import { Input } from "../input";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/api/user";
import { useAuthStore } from "@/stores/AuthStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

type GuestLoginFormProps = {
  setView: React.Dispatch<React.SetStateAction<"login" | "register">>;
  onOpenChange: (open: boolean) => void;
  showOtherState: (open: boolean) => void;
};

export default function GuestLoginForm({setView, onOpenChange, showOtherState}: GuestLoginFormProps)
{


     const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

const navigate = useNavigate();

  const {mutate, isPending, isError, error} = useMutation({

    mutationFn: loginUser,
    onSuccess: async (data) => {
      console.log('Logged in:', data);
      await useAuthStore.getState().checkAuth();
      onOpenChange(false);
      showOtherState(true);
    //  navigate("/");
    }
  })


  const handleSubmit = (e: any) => {
    e.preventDefault();
    mutate({ email, password });
  };

    return (
         <>
            <DialogHeader>
              <DialogTitle className="text-center">Bejelentkezés</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">E-mail</Label>
                <Input
                  id="email"
                  value={email}
                  className="col-span-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Label className="text-right">Elfelejtett jelszó</Label>
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
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-blue-400"
                onClick={(e) => handleSubmit(e)}
              >
                Belépés
              </Button>
            </DialogFooter>
            <Separator />
            <DialogDescription className="text-center">
              Ha még nem regisztráltál
            </DialogDescription>
            <Button variant="secondary" onClick={() => setView("register")}>
              Regisztráció
            </Button>
          </>
    )
}