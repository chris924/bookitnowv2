import { EmployeeWorkingHoursResponseDTO } from "@/API/models/EmployeeWorkingHoursResponseDTO";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; 

export default function EmployeeWorkingHoursCard({workingHours}: EmployeeWorkingHoursResponseDTO[])
{



    return(
        <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={new Date().toISOString().split('T')[0]}
        visibleRange={{
          start: new Date().toISOString().split("T")[0], // today
          end: appointmentSlots?.lastDate || new Date().toISOString().split("T")[0],
        }}
        validRange={{
          start: appointmentSlots?.firstDate || new Date().toISOString().split('T')[0],
          end: appointmentSlots?.lastDate || new Date().toISOString().split('T')[0],
        }}
        events={events}
        slotMinTime={appointmentSlots?.firstHour ? appointmentSlots?.firstHour : "8:00"}   // start hour
        slotMaxTime={appointmentSlots?.lastHour ? appointmentSlots?.lastHour : "16:00"} // end hour
        height="auto"
        allDaySlot={false}
        slotDuration="00:20:00"
        firstDay={appointmentSlots?.firstDate ? new Date(appointmentSlots.firstDate).getDay() : 0}  // 0=Sun ... 6=Sat
         slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false 
        }}
        eventClick={(info) => {
        // prevent navigation if the event has a url
        info.jsEvent.preventDefault();

        console.log("Event clicked:", info.event);
        setClickedAppointment(info.event);
        
        if(isAuthenticated && info.event.backgroundColor == "green")
        {
          console.log("auth true");
          setShowLoginForm(false);
          setShowApproveBooking(true);
        }
        else if(info.event.backgroundColor == "green")
        {
          console.log("auth false");
          setShowLoginForm(true);
          setShowApproveBooking(false);
        }
  }}
      />  
    )
}