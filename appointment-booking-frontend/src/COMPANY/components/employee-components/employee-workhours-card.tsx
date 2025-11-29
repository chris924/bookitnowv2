import { EmployeeWorkingHoursResponseDTO } from "@/API/models/EmployeeWorkingHoursResponseDTO";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";

interface EmployeeWorkingHoursCardProps
{
  workingHours: EmployeeWorkingHoursResponseDTO[]
}

function toFullCalendarEvent(slot: EmployeeWorkingHoursResponseDTO, _index: number): EventInput {
  const startTime = slot.startTime.slice(0, 5); // 'HH:mm'
  const endTime = slot.endTime.slice(0, 5);

  return {
    id: slot.id.toString(),
    title: "",
    start: `${slot.date}T${startTime}`,
    end: `${slot.date}T${endTime}`,
    color: "grey",
    className: "cursor-pointer",
  };
}

export default function EmployeeWorkingHoursCard({workingHours}: EmployeeWorkingHoursCardProps)
{
  const [events, setEvents] = useState<EventInput[]>([]);

  const latestVisibleRange = Math.max(
  ...workingHours
    .filter(w => w.date != null)
    .map(w => new Date(w.date!).getTime())
);


    return(
        <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={new Date().toISOString().split('T')[0]}
        visibleRange={{
          start: new Date().toISOString().split("T")[0], // today
          end: new Date(latestVisibleRange).toISOString().split("T")[0],
        }}
        validRange={{
          start: new Date().toISOString().split('T')[0],
          end:  new Date().toISOString().split('T')[0] + 60,
        }}
        events={events}
        slotMinTime="8:00"   // start hour
        slotMaxTime="16:00" // end hour
        height="auto"
        allDaySlot={false}
        slotDuration="00:20:00"
        firstDay= {new Date().getDate()}  // 0=Sun ... 6=Sat
         slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: false 
        }}
        eventClick={(info) => {
        // prevent navigation if the event has a url
        info.jsEvent.preventDefault();

        console.log("Event clicked:", info.event);
  }}
      />  
    )
}