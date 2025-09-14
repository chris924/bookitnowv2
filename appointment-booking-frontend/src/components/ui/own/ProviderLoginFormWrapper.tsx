import { useState } from "react";
import { Card } from "@/components/ui/card";
import ProviderCompanyLoginForm from "./ProviderCompanyLoginForm";
import ProviderEmployeeLoginForm from "./ProviderEmployeeLoginForm";
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent } from "../dialog";

interface ProviderLoginFormWrapperProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function ProviderLoginFormWrapper({open, onOpenChange}: ProviderLoginFormWrapperProps) {
  const [switchLoginForm, setSwitchLoginForm] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        {/* Switch toggle */}
       <div className="flex items-center justify-end mb-4 gap-2">
        <div>
            {switchLoginForm ? "Alkalmazott belépés" : "Cég belépés"}
        </div>
        <Switch
            checked={switchLoginForm}
            onCheckedChange={() => setSwitchLoginForm((prev) => !prev)}
            className="flex items-center m-3"
        />
        </div>

        {/* Conditional form */}
        <div className="min-h-[400px]">
         {switchLoginForm ? (
          <ProviderEmployeeLoginForm />
        ) : (
          <ProviderCompanyLoginForm />
        )}
        </div>
       
      </DialogContent>
    </Dialog>
  );
}