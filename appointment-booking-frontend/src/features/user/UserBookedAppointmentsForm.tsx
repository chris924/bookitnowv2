import { useParams } from "react-router-dom";
import { useCancelAppointment, UserAppointmentsQuery } from "@/hooks/query/UserAppointmentsQuery";
import { showToast } from "@/components/ui/own/ShowToast";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export default function UserBookedAppointmentsForm()
{

    const { slug } = useParams<{ slug: string }>();
    
    if(!slug)
        return showToast.error("A felhasználó nem található!");

    const {data: appointments, isLoading, error} = UserAppointmentsQuery(slug);
    const cancelMutation = useCancelAppointment();
    
    function getAppointmentStart(slot: { date: string; start: string }) {
    return new Date(`${slot.date}T${slot.start}`);
    }

    const now = new Date();

    const upcomingAppointments = appointments?.filter(
    (a) => getAppointmentStart(a.slotResponseDTO) >= now && a.slotResponseDTO.status !== "Cancelled"
    );

    const pastAppointments = appointments?.filter(
    (a) => getAppointmentStart(a.slotResponseDTO) < now || a.slotResponseDTO.status === "Cancelled"
    );

    function handleCancelAppointmentClick(appointmentId: number) {
    if (!slug) return; 

    cancelMutation.mutate({
        userSlug: slug,
        appointmentId,
    });
}


   return (
  <div className="space-y-10">
    {/* Upcoming */}
    <section>
      <h2 className="text-xl font-semibold mb-4">Aktív foglalások</h2>
      {upcomingAppointments?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.slotResponseDTO.id} className="hover:shadow-lg transition">
              <CardHeader className="flex items-center gap-4">
                <img
                  src={appointment.employeeAvatarUrl}
                  alt={appointment.employeeName}
                  className="w-16 h-16 rounded-full object-cover shadow"
                />
                <div>
                  <CardTitle className="text-lg">{appointment.employeeName}</CardTitle>
                  <CardDescription>{appointment.companyName} , {appointment.slotResponseDTO.status}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-green-600 font-semibold">{appointment.servicePrice} Ft</p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <p>
                  {appointment.slotResponseDTO.date} • {appointment.slotResponseDTO.start}–{appointment.slotResponseDTO.end}
                </p>
                <Button className="text-red-600 hover:text-red-800 font-medium" onClick={() => (handleCancelAppointmentClick(appointment.slotResponseDTO.id))}>Foglalás törlése</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nincs aktív foglalás.</p>
      )}
    </section>

    {/* Past */}
    <section>
      <h2 className="text-xl font-semibold mb-4">Korábbi foglalások</h2>
      {pastAppointments?.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.slotResponseDTO.id} className="hover:shadow transition opacity-75">
              <CardHeader className="flex items-center gap-4">
                <img
                  src={appointment.employeeAvatarUrl}
                  alt={appointment.employeeName}
                  className="w-16 h-16 rounded-full object-cover grayscale"
                />
                <div>
                  <CardTitle className="text-lg">{appointment.employeeName}</CardTitle>
                  <CardDescription>{appointment.companyName}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-muted-foreground">{appointment.servicePrice} Ft</p>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <p>
                  {appointment.slotResponseDTO.date} • {appointment.slotResponseDTO.start}–{appointment.slotResponseDTO.end}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nincsenek korábbi foglalások.</p>
      )}
    </section>
  </div>
);

}