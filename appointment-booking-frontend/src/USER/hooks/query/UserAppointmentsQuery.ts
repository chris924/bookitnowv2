import { AppointmentGetResponseDTO } from "@/API/models/AppointmentGetResponseDTO";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { createSlug, handleAPIError } from "@/lib/utils";
import { useUserStore } from "@/stores/AuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//Query for gettin the user appointments. Better than a simple fetch, since it is cacheable.
export function UserAppointmentsQuery()
{
    const api = useApi();

    return useQuery<AppointmentGetResponseDTO[]>({
        queryKey: ["appointments"],
        queryFn: () =>  api.appointment.getUserBookedAppointments(),
        staleTime: 1000 * 60
    });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const api = useApi();
  return useMutation({
    mutationFn: ({ appointmentId }: { appointmentId: number }) =>
         api.appointment.cancelUserAppointment({appointmentId}), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      showToast.success("Időpont törölve!");
    },
    onError: (error) => handleAPIError(error)
  });
}

export function useBookAppointment() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {user} = useUserStore();
  const api = useApi();

  return useMutation({
    mutationFn: ({  appointmentId }: { appointmentId: number }) =>
      api.appointment.bookAppointment({appointmentId}),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if(user?.name && user?.id)
      {
        const userSlug = await createSlug(user?.name, user?.id);
        toast.success("Siker ✅", {
        description: "Foglalás kész!",
        onAutoClose: () => navigate(`/user/${userSlug}/booked-appointments`),
        duration: 1000
      });
      }
      else showToast.error("Felhasználó név, vagy ID nem található!");  
    },
    onError: (error) => handleAPIError(error)
  });
}