import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { RegisterCompanyRequest } from "@/API";
import { handleAPIError } from "@/lib/utils";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ProviderCompanyRegisterFormProps {
  onBackToLogin: () => void;
}

export default function ProviderCompanyRegisterForm({ onBackToLogin }: ProviderCompanyRegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [appServiceName, setAppServiceName] = useState("");
  const [appServiceDescription, setAppServiceDescription] = useState("");
  const [description, setDescription] = useState("");
  const [place, setPlace] = useState("");

  const api = useApi();

  const { mutate } = useMutation({
    mutationFn: (request: RegisterCompanyRequest) => api.companyAuth.registerCompany(request),
    onSuccess: () => {
      showToast.success("Sikeres regisztráció! Most már bejelentkezhet.");
      onBackToLogin();
    },
    onError: (error) => handleAPIError(error),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      showToast.error("A jelszavak nem egyeznek!");
      return;
    }
    if (email !== emailConfirm) {
      showToast.error("Az email címek nem egyeznek!");
      return;
    }

    mutate({
      companyRegistrationDTO: {
        name,
        email,
        password,
        appServiceName,
        appServiceDescription,
        description,
        place,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cég regisztráció</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-center">Új fiók létrehozása</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Cég neve</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">E-mail</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">E-mail újra</Label>
              <Input type="email" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Jelszó</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Jelszó újra</Label>
              <Input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Szolgáltatás neve</Label>
              <Input value={appServiceName} onChange={(e) => setAppServiceName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Szolgáltatás leírása</Label>
              <Textarea value={appServiceDescription} onChange={(e) => setAppServiceDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right text-xs">Cég leírás</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Helyszín</Label>
              <Input value={place} onChange={(e) => setPlace(e.target.value)} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-blue-400">
              Regisztráció
            </Button>
          </DialogFooter>
          <div className="flex justify-center mt-4">
            <Button variant="ghost" onClick={onBackToLogin}>
              Vissza a bejelentkezéshez
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
