import { cn, handleAPIError } from "@/lib/utils";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Input } from "../input";
import { Label } from "../label";
import { useEmployeeStore } from "@/stores/AuthStore";
import { LoginCompanyRequest, LoginEmployeeRequest } from "@/API";
import { useApi } from "@/hooks/useApi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "./ShowToast";

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
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Alkalmazott belépés</CardTitle>
          <CardDescription>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Elfelejtett jelszó?
                  </a>
                </div>
                <Input id="password" type="password" required  onChange={(e) => setPassword(e.target.value)}/>
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" onClick={(e) => handleSubmit(e)}>
                  Belépés
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}