import { cn, handleAPIError } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEmployeeStore } from "@/stores/AuthStore";
import { LoginCompanyRequest, LoginEmployeeRequest } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "@/components/ui/own/ShowToast";
import { DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { Separator } from "@radix-ui/react-separator";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";

interface ProviderEmployeeLoginFormProps{
  onOpenChange: (open: boolean) => void;
}


export default function ProviderEmployeeLoginForm({onOpenChange}: ProviderEmployeeLoginFormProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const api = useApi();

    const {mutate, isPending, isError, error} = useMutation({

    mutationFn: (request: LoginEmployeeRequest) =>  api.employeeAuth.loginEmployee(request),
    onSuccess: async (data) => {
      console.log('Logged in:', data);
      showToast.success("Sikeres bejelentkezés!");
      await useEmployeeStore.getState().checkEmployeeAuth();
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
          <CardTitle>Alkalmazott belépés</CardTitle>
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
            <Label className="flex justify-center p-4">Elfelejtett jelszó</Label>
            <Separator />
            <DialogDescription className="text-center m-5">
            </DialogDescription>
            </form>
        </CardContent>
      </Card>
  )
}