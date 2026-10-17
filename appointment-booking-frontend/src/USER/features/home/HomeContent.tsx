import { useEffect, useState } from "react";
import { ArrowRight, CalendarCheck, CalendarDays, Search, Sparkles } from "lucide-react";
import SearchForm from "./components/SearchForm";
import SpecialistGrid from "./components/SpecialistGrid";
import { SpecialistDTO } from "@/API/models/SpecialistDTO";
import { useApi } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserStore } from "@/stores/AuthStore";
import { useLoginDialogStore } from "@/stores/LoginDialogStore";

const TOP_RATED_LIMIT = 8;

const steps = [
  {
    icon: Search,
    title: "Keress",
    description: "Szűrj szakemberre, üzletre vagy településre.",
  },
  {
    icon: CalendarDays,
    title: "Válassz időpontot",
    description: "Nézd meg a szolgáltatásokat és a szabad időpontokat.",
  },
  {
    icon: CalendarCheck,
    title: "Foglalj",
    description: "Jelentkezz be, és a foglalásod azonnal rögzül.",
  },
];


export default function HomeContent()
{
    const [topRatedEmployees, setTopRatedEmployees] = useState<SpecialistDTO[]>([]);
    const [topRatedLoading, setTopRatedLoading] = useState(true);
    const api = useApi();
    const { isAuthenticated } = useUserStore();
    const { setOpenDialog } = useLoginDialogStore();

      useEffect(() => {

        async function fetchMostRatedEmployees()
        {
         try {

          const response = await api.employee.getMostRatedEmployees();
          setTopRatedEmployees(response);
          } catch (error) {
            console.error('Failed to fetch top-rated employees:', error);
          } finally {
            setTopRatedLoading(false);
          }
        }

        fetchMostRatedEmployees();
      }, [])


   return (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 overflow-x-clip pb-10 md:gap-28">

    {/* Hero */}
    <section className="relative isolate pt-8 text-center md:pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-16 -z-10 mx-auto h-80 max-w-3xl rounded-full bg-linear-to-r from-emerald-400/30 via-teal-300/25 to-sky-400/30 blur-3xl dark:from-emerald-500/20 dark:via-teal-500/10 dark:to-sky-500/20"
      />

      <span className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur sm:text-sm">
        <Sparkles className="size-4 text-emerald-500" />
        Online időpontfoglalás, sorban állás nélkül
      </span>

      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
        Foglalj időpontot profikhoz,{" "}
        <span className="bg-linear-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
          még ma!
        </span>
      </h1>

      <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground md:text-lg">
        Keress szakembert név, üzlet vagy település alapján, nézd meg a szabad
        időpontjait, és foglalj néhány kattintással.
      </p>

      <div className="mt-10">
        <SearchForm />
      </div>
    </section>

    {/* How it works */}
    <section>
      <SectionHeading eyebrow="Egyszerű" title="Hogyan működik?" />
      <ol className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex items-start gap-4 rounded-2xl border bg-card p-5 sm:flex-col">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <step.icon className="size-5" />
            </span>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{index + 1}. lépés</p>
              <h3 className="mt-0.5 font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>

    {/* Top rated */}
    <section>
      <SectionHeading
        eyebrow="Szakembereink"
        title="Legjobbra értékelt szakemberek"
        description="Vendégeink értékelései alapján."
      />
      {topRatedLoading ? (
        <div className="flex flex-wrap justify-center gap-3 *:w-[calc(50%-0.375rem)] sm:grid sm:grid-cols-[repeat(auto-fit,minmax(13rem,15rem))] sm:gap-5 sm:*:w-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 rounded-2xl sm:h-64" />
          ))}
        </div>
      ) : topRatedEmployees.length > 0 ? (
        <SpecialistGrid specialists={topRatedEmployees.slice(0, TOP_RATED_LIMIT)} />
      ) : (
        <p className="text-center text-muted-foreground">Még nincsenek értékelt szakemberek.</p>
      )}
    </section>

    {/* Provider call-to-action */}
    {!isAuthenticated && (
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-emerald-600 to-teal-700 px-6 py-10 text-white md:px-12 md:py-14">
        <div aria-hidden className="absolute -top-20 -right-16 -z-10 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Szolgáltató vagy?</h2>
            <p className="mt-2 text-emerald-50/90">
              Regisztráld a vállalkozásod, add hozzá a munkatársaidat, és kezeld a
              foglalásokat egy helyen.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setOpenDialog("provider")}
            className="w-full bg-white text-emerald-700 hover:bg-emerald-50 sm:w-auto"
          >
            Szolgáltatóknak
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>
    )}

    <footer className="border-t pt-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Appointment Booking
    </footer>
  </div>
);
}


function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6 text-center md:mb-8">
      <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}
