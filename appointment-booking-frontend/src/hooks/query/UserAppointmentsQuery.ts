import { cancelBookedAppointment, getUserBookedAppointments } from "@/api/appointments";
import { AppointmentGetResponseDTO } from "@/lib/appointment-types";
import { handleAPIError } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    },
    onError: (error) => handleAPIError(error)
  });
}