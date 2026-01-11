import { cn, handleAPIError } from "@/lib/utils";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { useState } from "react";
import { useCompanyStore, useUserStore } from"@/stores/AuthStore";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "./ShowToast";
import { useApi } from "@/hooks/useApi";
import { LoginCompanyRequest } from "@/API";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { DialogHeader, DialogFooter } from "../dialog";

interface ProviderCompanyLoginFormProps{
  onOpenChange: (open: boolean) => void;
}

export default function ProviderCompanyLoginForm({onOpenChange} : ProviderCompanyLoginFormProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const api = useApi();

    const {mutate, isPending, isError, error} = useMutation({

    mutationFn: (request: LoginCompanyRequest) =>  api.companyAuth.loginCompany(request),
    onSuccess: async (data) => {
      showToast.success("Sikeres bejelentkezés!");
      await useCompanyStore.getState().checkCompanyAuth();
      onOpenChange(false);
    },
    onError: (error) => handleAPIError(error),
  })

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  mutate({
    loginDTO: { email, password },
  });
};

  return (

      <Card>
        <CardHeader>
          <CardTitle>Cég belépés</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
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
            <Label className="flex justify-center p-2">Elfelejtett jelszó</Label>
            <Separator />   
            <DialogDescription className="text-center m-5">
               <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Fiók Igénylés
              </a> 
            </DialogDescription>
            </form>
        </CardContent>
      </Card>
    
  )
}