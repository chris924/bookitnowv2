import { EmployeeWorkingHoursResponseDTO } from "@/API/models/EmployeeWorkingHoursResponseDTO";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";
import { Button } from "@/components/ui/button";

interface EmployeeWorkingHoursCardProps
{
  workingHours: EmployeeWorkingHoursResponseDTO[]
}

function toFullCalendarEvent(slot: EmployeeWorkingHoursResponseDTO, _index: number): EventInput {
  const startTime = slot.startTime.slice(0, 5); // 'HH:mm'
  const endTime = slot.endTime.slice(0, 5);

  const dateStr = new Date(slot.date).toISOString().split("T")[0];

  const event = {
    id: slot.id.toString(),
    title: "TEST",
    start: `${dateStr}T${startTime}`,
    end: `${dateStr}T${endTime}`,
    color: "red",
    className: "cursor-pointer",
  };

  console.log(event);
  return event;

}

export default function EmployeeWorkingHoursCard({workingHours}: EmployeeWorkingHoursCardProps)
{
  const [events, setEvents] = useState<EventInput[]>([]);

  const latestVisibleRange = Math.max(
  ...workingHours
    .filter(w => w.date != null)
    .map(w => new Date(w.date!).getTime())
);

const today = new Date();
const todayStr = today.toISOString().split("T")[0];


// day of week: 0=Sun .. 6=Sat
const firstDayOfWeek = today.getDay();

  useEffect(() => {

    setEvents(workingHours.map((workinghour) => (toFullCalendarEvent(workinghour, workinghour.id))))

  }, [workingHours])


    return(
      <>
      <div className="p-5">
      <p className="text-4xl">Munkarend</p>
      </div>
      <div className="">
        <Button className=" m-5">Munakrend beállítás</Button>
        <Button>Munakrendek törlése</Button>
      </div>
        <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={new Date().toISOString().split('T')[0]}
        visibleRange={{
          start: todayStr, // today
          end: new Date(latestVisibleRange).toISOString().split("T")[0],
        }}
        validRange={{
          start: todayStr,
          end:  new Date(latestVisibleRange).toISOString().split("T")[0],
        }}
        events={events}
        slotMinTime="0:00"   // start hour
        slotMaxTime="24:00" // end hour
        height="auto"
        allDaySlot={false}
        slotDuration="00:20:00"
        firstDay={firstDayOfWeek}  // 0=Sun ... 6=Sat
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
      </>
    )
}