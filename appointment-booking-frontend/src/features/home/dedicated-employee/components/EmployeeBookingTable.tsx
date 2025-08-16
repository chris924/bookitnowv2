import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for click/select

import { AppointmentSlotResponseDTO, SlotResponseDTO } from '@/lib/appointment-types';

type EmployeeBookingTableProps = {
  appointmentSlots?: AppointmentSlotResponseDTO;
};

function toFullCalendarEvent(slot: SlotResponseDTO, index: number): EventInput {
  const startTime = slot.start.slice(0, 5); // 'HH:mm'
  const endTime = slot.end.slice(0, 5);

  return {
    id: String(index),
    title: "",
    start: `${slot.date}T${startTime}`,
    end: `${slot.date}T${endTime}`,
    color: slot.status == "FREE" ? 'green' : 'grey'
  };
}

export default function EmployeeBookingTable({ appointmentSlots }: EmployeeBookingTableProps) {
  const [events, setEvents] = useState<EventInput[]>([]);

  useEffect(() => {
    if (appointmentSlots && appointmentSlots.slotResponseDTO.length > 0) {
      const fcEvents = appointmentSlots.slotResponseDTO.map(toFullCalendarEvent);
      setEvents(fcEvents);
    }
  }, [appointmentSlots]);

  return (
    <div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={appointmentSlots?.firstDate || new Date().toISOString().split('T')[0]} // default to today if no date
        validRange={{
          start: appointmentSlots?.firstDate || new Date().toISOString().split('T')[0],
          end: appointmentSlots?.lastDate || new Date().toISOString().split('T')[0],
        }}
        events={events}
        slotMinTime={appointmentSlots?.firstHour ? appointmentSlots?.firstHour : "8:00"}   // start hour
        slotMaxTime={appointmentSlots?.lastHour ? appointmentSlots?.lastHour : "16:00"} // end hour
        height="auto"
      />
    </div>
  );
}