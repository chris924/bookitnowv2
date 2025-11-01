import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { DialogHeader, DialogFooter } from "../dialog";
import { Input } from "../input";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/stores/AuthStore";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "./ShowToast";
import { useApi } from "@/hooks/useApi";
import { LoginUserRequest } from "@/API";

type GuestLoginFormProps = {
  setView: React.Dispatch<React.SetStateAction<"login" | "register">>;
  onOpenChange: (open: boolean) => void;
  showApproveBooking?: (open: boolean) => void;
};

export default function GuestLoginForm({setView, onOpenChange, showApproveBooking}: GuestLoginFormProps)
{


    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const api = useApi();

    const navigate = useNavigate();

  const {mutate, isPending, isError, error} = useMutation({

    mutationFn: (request: LoginUserRequest) => api.userAuth.loginUser(request),
    onSuccess: async (data) => {
      console.log('Logged in:', data);
      showToast.success("Sikeres bejelentkezés!");
      await useUserStore.getState().checkAuth();
      onOpenChange(false);

      if(showApproveBooking)  // This is responsible for showing the ApproveBookingForm after a successful login
        showApproveBooking(true);
      
    //  navigate("/");
    }
  })


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      loginDTO: { email, password },
    });
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