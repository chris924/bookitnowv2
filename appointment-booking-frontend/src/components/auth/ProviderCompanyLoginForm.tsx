import { cn, handleAPIError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useCompanyStore, useUserStore } from"@/stores/AuthStore";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { LoginCompanyRequest } from "@/API";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";

interface ProviderCompanyLoginFormProps{
  onOpenChange: (open: boolean) => void;
  onRegisterClick: () => void;
}

export default function ProviderCompanyLoginForm({onOpenChange, onRegisterClick} : ProviderCompanyLoginFormProps) {

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
            <div className="flex justify-center m-5">
              <Button variant="ghost" onClick={onRegisterClick}>
                Fiók Igénylés
              </Button>
            </div>
            </form>
        </CardContent>
      </Card>
    
  )
}