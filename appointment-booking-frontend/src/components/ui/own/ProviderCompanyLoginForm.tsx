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
      console.log('Logged in:', data);
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
    <div className={cn("flex flex-col gap-6")}>
      <Card>
        <CardHeader>
          <CardTitle>Cég belépés</CardTitle>
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
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Jelszó</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Elfelejtett jelszó?
                  </a>
                </div>
                <Input id="password" type="password" onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" onClick={(e) => handleSubmit(e)}>
                  Bejelentkezés
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Új fiók nyitása?{" "}
              <a href="#" className="underline underline-offset-4">
                Igénylés
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}