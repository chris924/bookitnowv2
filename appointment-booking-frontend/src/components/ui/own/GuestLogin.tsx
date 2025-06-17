import { Label, Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Input } from "../input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/api/user";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/AuthStore";
import GuestRegister from "./GuestRegisterForm";
import GuestRegisterForm from "./GuestRegisterForm";
import GuestLoginForm from "./GuestLoginForm";

export default function GuestLogin()
{

 

  const [view, setView] = useState<"login" | "register">("login");
  

  
  

   return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-base md:text-3xl md:h-12 lg:text-3xl px-4 py-2 md:px-6 md:py-3 rounded-3xl"
        >
          Belépés
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        {view === "login" ? (
         <GuestLoginForm setView={setView}/>
        ) : (
          <>
            <GuestRegisterForm />

            <Button variant="ghost" onClick={() => setView("login")}>
              Vissza a bejelentkezéshez
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}