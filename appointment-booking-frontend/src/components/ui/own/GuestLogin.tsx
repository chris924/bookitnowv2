import { Button } from "../button";
import { Dialog, DialogContent } from "../dialog";
import { useState } from "react";
import GuestRegisterForm from "./GuestRegisterForm";
import GuestLoginForm from "./GuestLoginForm";

interface GuestLoginProps {
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  showApproveBooking?: (open: boolean) => void;
}

export default function GuestLogin({ open, onOpenChange, showApproveBooking  }: GuestLoginProps) {
  const [view, setView] = useState<"login" | "register">("login");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 md:p-8">
        {view === "login" ? (
          <GuestLoginForm setView={setView} onOpenChange={onOpenChange} showApproveBooking={showApproveBooking}/>
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
