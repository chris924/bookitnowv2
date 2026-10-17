import { useUserStore } from "@/stores/AuthStore";
import { useLoginDialogStore } from "@/stores/LoginDialogStore";
import { useEffect } from "react";
import GuestLogin from "../auth/GuestLogin";
import { ModeToggle } from "../ui/own/theme-toggle";
import { Button } from "../ui/button";
import Loader from "../ui/own/Loader";
import { Link, useLocation } from "react-router-dom";
import ProviderLoginFormWrapper from "../auth/ProviderLoginFormWrapper";
import DropdownUser from "@/USER/features/home/components/UserDropdown";
import { CalendarCheck } from "lucide-react";



export default function Navbar()
{

  const { checkUserAuth, isAuthenticated, user, userLoading } = useUserStore();
  const { openDialog, setOpenDialog } = useLoginDialogStore();

  const location = useLocation();

  useEffect(() => {
    checkUserAuth();
  }, [])

    return (

        <>
  <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
  {/* Title */}
  <Link to="/" className="flex min-w-0 items-center gap-2.5">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
      <CalendarCheck className="size-5" />
    </span>
    <span className="truncate text-base font-semibold tracking-tight md:text-xl">
      Appointment Booking
    </span>
  </Link>

  {/* Right-side buttons / user */}
  <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
    {userLoading ? (
      <Loader />
    ) : isAuthenticated && user ? (
      <DropdownUser user={user} />
    ) : (
      <Button onClick={() => setOpenDialog("guest")} className="bg-emerald-600 text-white hover:bg-emerald-700">
        Belépés
      </Button>
    )}

    {/* On phones the home page's provider banner offers this instead. */}
    {!isAuthenticated && location.pathname === "/" && (
      <Button
        variant="ghost"
        className="hidden sm:inline-flex"
        onClick={() => setOpenDialog("provider")}
      >
        Szolgáltatóknak
      </Button>
    )}

    {/* Modals */}
    <GuestLogin
      open={openDialog === "guest"}
      onOpenChange={(open) => setOpenDialog(open ? "guest" : null)}
    />
    <ProviderLoginFormWrapper
      open={openDialog === "provider"}
      onOpenChange={(open) => setOpenDialog(open ? "provider" : null)}
    />

    {/* Dark/Light Mode Toggle */}
    <ModeToggle />
  </div>
  </div>
</header>
</>


    )

}
