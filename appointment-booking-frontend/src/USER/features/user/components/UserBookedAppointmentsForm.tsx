import { useCancelAppointment, UserAppointmentsQuery } from "@/USER/hooks/query/UserAppointmentsQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ApproveDialogForm from "@/components/dialogs/ApproveDialogForm";
import { AppointmentGetResponseDTO } from "@/API/models/AppointmentGetResponseDTO";
import Loader from "@/components/ui/own/Loader";
import { formatTime, handleAPIError } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/components/ui/own/ShowToast";
import { formatDate } from "@fullcalendar/core/index.js";


function getAppointmentStart(slot: { date: string | Date; start: string | undefined }) {
  if (!slot.date || !slot.start) return new Date(NaN);
  const dateStr = typeof slot.date === "string" ? slot.date : slot.date.toISOString().split("T")[0];
  return new Date(`${dateStr}T${slot.start}`);
}


export default function UserBookedAppointmentsForm()
{

    const {data: appointments, isLoading, error} = UserAppointmentsQuery();
    const cancelMutation = useCancelAppointment();
    const [showApproveForm, setShowApproveForm] = useState(false);
    const [cancelAppointmentData, setCancelAppointmentData] = useState<AppointmentGetResponseDTO>();
    const [hoverRating, setHoverRating] = useState<{ id: number; stars: number } | null>(null);

    const api = useApi();
    const queryClient = useQueryClient();

    const rateMutation = useMutation({
      mutationFn: (params: { appointmentId: number; rating: number }) =>
        api.appointment.rateAppointment({ rateAppointmentDTO: params }),
      onSuccess: async () => {
        showToast.success("Értékelés elmentve!");
        await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      },
      onError: handleAPIError,
    });
    
    const now = new Date();

    const upcomingAppointments = appointments?.filter(
    (a) =>  a.slotResponseDTO && a.slotResponseDTO.date && getAppointmentStart(a.slotResponseDTO) >= now && a.slotResponseDTO.status !== "Cancelled"
    );

    const pastAppointments = appointments?.filter(
    (a) => getAppointmentStart(a.slotResponseDTO) < now || a.slotResponseDTO.status === "Cancelled"
    );

    //handleCancelAppointmentClick(appointment.slotResponseDTO.id)
    function handleCancelAppointmentClick(appointmentId: string) {

    cancelMutation.mutate({
        appointmentId:  Number(appointmentId),
    });
}

    function clickOnCancel(appointment: AppointmentGetResponseDTO)
    {
        setCancelAppointmentData(appointment);
        setShowApproveForm(true);
    }

    useEffect(() => {
    if (cancelMutation.isSuccess || cancelMutation.isError) {
        setShowApproveForm(false);
    }
    }, [cancelMutation.isSuccess, cancelMutation.isError]);

    if(isLoading)
      return <Loader/>

   return (
  <div className="space-y-10">
    {showApproveForm ? <ApproveDialogForm title="Biztos lemondja a foglalást?" description="" value={cancelAppointmentData?.slotResponseDTO.id.toString()!} onButtonClick={handleCancelAppointmentClick} onOpenChange={setShowApproveForm} open={showApproveForm} buttonVariant="destructive" isLoading={cancelMutation.isPending}/> : ""}
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
                  <CardDescription>{appointment.companyName ?? "-"} , {appointment.slotResponseDTO.status}</CardDescription>
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
                  {formatDate(appointment.slotResponseDTO.date)} • {formatTime(appointment.slotResponseDTO.start)}–{formatTime(appointment.slotResponseDTO.end)}
0                </p>
                <Button className="text-red-600 hover:text-red-800 font-medium" onClick={() => clickOnCancel(appointment)}>Foglalás törlése</Button>
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
                  <CardDescription>{appointment.companyName ?? "-"}</CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-medium">{appointment.serviceName}</p>
                  <p className="text-muted-foreground">{appointment.servicePrice} Ft</p>
                </div>
              </CardContent>

              <CardContent>
                {appointment.rating ? (
                  <p className="text-sm text-yellow-600 font-medium">
                    {"★".repeat(appointment.rating)}{"☆".repeat(5 - appointment.rating)} Értékelve
                  </p>
                ) : appointment.slotResponseDTO.status !== "Cancelled" ? (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground mr-1">Értékelés:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-xl cursor-pointer transition-colors hover:text-yellow-500"
                        style={{ color: hoverRating?.id === appointment.slotResponseDTO.id && hoverRating.stars >= star ? "#eab308" : "#d1d5db" }}
                        onMouseEnter={() => setHoverRating({ id: appointment.slotResponseDTO.id, stars: star })}
                        onMouseLeave={() => setHoverRating(null)}
                        onClick={() => rateMutation.mutate({ appointmentId: appointment.slotResponseDTO.id, rating: star })}
                        disabled={rateMutation.isPending}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                ) : null}
              </CardContent>
              <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
                <p>
                  {formatDate(appointment.slotResponseDTO.date.toString())} • {formatTime(appointment.slotResponseDTO.start)}–{formatTime(appointment.slotResponseDTO.end)}
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