import { useState } from "react";
import ProviderCompanyLoginForm from "./ProviderCompanyLoginForm";
import ProviderCompanyRegisterForm from "./ProviderCompanyRegisterForm";
import ProviderEmployeeLoginForm from "./ProviderEmployeeLoginForm";
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ProviderLoginFormWrapperProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProviderLoginFormWrapper({open, onOpenChange}: ProviderLoginFormWrapperProps) {
  const [switchLoginForm, setSwitchLoginForm] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");

  function handleOpenChange(open: boolean) {
    if (!open) {
      setView("login");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] h-auto max-h-[80vh] p-6 md:p-8 overflow-y-auto">

        {view === "login" && (
          <>
            <div className="flex justify-center gap-2">
              {switchLoginForm ? "Alkalmazott belépés" : "Cég belépés"}
            </div>
            <div className="flex justify-center">
              <Switch
                checked={switchLoginForm}
                onCheckedChange={() => setSwitchLoginForm((prev) => !prev)}
                className="flex items-center m-3 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-400"
              />
            </div>

            {switchLoginForm ? (
              <ProviderEmployeeLoginForm onOpenChange={handleOpenChange}/>
            ) : (
              <ProviderCompanyLoginForm onOpenChange={handleOpenChange} onRegisterClick={() => setView("register")}/>
            )}
          </>
        )}

        {view === "register" && (
          <ProviderCompanyRegisterForm onBackToLogin={() => setView("login")} />
        )}

      </DialogContent>
    </Dialog>
  );
}
