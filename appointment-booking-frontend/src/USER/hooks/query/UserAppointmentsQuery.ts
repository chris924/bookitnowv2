import { addUserToAppointment, cancelBookedAppointment, getUserBookedAppointments } from "@/api/userSide/appointments";
import { showToast } from "@/components/ui/own/ShowToast";
import { AppointmentGetResponseDTO } from "@/lib/appointment-types";
import { createSlug, handleAPIError } from "@/lib/utils";
import { useUserStore } from "@/stores/AuthStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

//Query for gettin the user appointments. Better than a simple fetch, since it is cacheable.
export function UserAppointmentsQuery(userSlug: string)
{
    return useQuery<AppointmentGetResponseDTO[]>({
        queryKey: ["appointments", userSlug],
        queryFn: () => getUserBookedAppointments(userSlug).then(res => res.data),
        enabled: !!userSlug,
        staleTime: 1000 * 60
    });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userSlug, appointmentId }: { userSlug: string; appointmentId: number }) =>
      cancelBookedAppointment(userSlug, appointmentId),
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

  return useMutation({
    mutationFn: ({  appointmentId }: { appointmentId: number }) =>
      addUserToAppointment(appointmentId),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      if(user)
      {
        const userSlug = await createSlug(user?.name, user?.id);
        toast.success("Siker ✅", {
        description: "Foglalás kész!",
        onAutoClose: () => navigate(`/user/${userSlug}/booked-appointments`),
        duration: 1000
      });
      }   
    },
    onError: (error) => handleAPIError(error)
  });
}