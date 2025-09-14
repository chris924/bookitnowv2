import { cn } from "@/lib/utils";
import { Button } from "../button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../card";
import { Input } from "../input";
import { Label } from "../label";


export default function ProviderCompanyLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
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
                <Input id="password" type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
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