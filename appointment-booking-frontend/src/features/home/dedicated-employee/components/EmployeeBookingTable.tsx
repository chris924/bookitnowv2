import { useCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
 
import '@schedule-x/theme-default/dist/index.css'
import { useEffect, useState } from 'react'
import { AppointmentSlotResponseDTO } from '@/lib/appointment-types'

type EmployeeBookingTable = {

  appointmentSlots: AppointmentSlotResponseDTO[];

}


function toScheduleXEvent(slot: AppointmentSlotResponseDTO, index: number) {
  const startTime = slot.start.slice(0, 5); // 'HH:mm'
  const endTime = slot.end.slice(0, 5);

  return {
    id: String(index),
    title: slot.status,
    start: `${slot.date} ${startTime}`,
    end: `${slot.date} ${endTime}`
  };
}

export default function EmployeeBookingTable({appointmentSlots }: EmployeeBookingTable)
{

    const eventsService = useState(() => createEventsServicePlugin())[0]

    const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    plugins: [eventsService]
  })
 
  useEffect(() => {

    if(appointmentSlots.length > 0){
      const events = appointmentSlots.map(toScheduleXEvent);
      eventsService.set(events);
    }

    eventsService.getAll()
  }, [appointmentSlots, eventsService])

    return(

         <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
    )
}