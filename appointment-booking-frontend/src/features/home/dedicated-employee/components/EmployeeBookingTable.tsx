import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for click/select
import { useAuthStore } from '@/stores/AuthStore';

import { AppointmentSlotResponseDTO, SlotResponseDTO } from '@/lib/appointment-types';
import GuestLoginForm from '@/components/ui/own/GuestLoginForm';
import GuestLogin from '@/components/ui/own/GuestLogin';
import { addUserToAppointment } from '@/api/appointments';
import ApproveBookingForm from '@/components/ui/own/ApproveBookingForm';
import { EventImpl } from '@fullcalendar/core/internal';

type EmployeeBookingTableProps = {
  appointmentSlots?: AppointmentSlotResponseDTO;
};

function toFullCalendarEvent(slot: SlotResponseDTO, index: number): EventInput {
  const startTime = slot.start.slice(0, 5); // 'HH:mm'
  const endTime = slot.end.slice(0, 5);

  return {
    id: String(slot.id),
    title: "",
    start: `${slot.date}T${startTime}`,
    end: `${slot.date}T${endTime}`,
    color: slot.status == "FREE" ? 'green' : 'grey',
    className: slot.status == "FREE" ? "cursor-pointer" : ""
  };
}

export default function EmployeeBookingTable({ appointmentSlots }: EmployeeBookingTableProps) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showApproveBooking, setShowApproveBooking] = useState(false);
  const [clickedAppointment, setClickedAppointment] = useState<EventImpl>();

  const {isAuthenticated} = useAuthStore();

  const [view, setView] = useState<"login" | "register">("login");

  

  useEffect(() => {
    if (appointmentSlots && appointmentSlots.slotResponseDTO.length > 0) {
      const fcEvents = appointmentSlots.slotResponseDTO.map(toFullCalendarEvent);
      setEvents(fcEvents);
    }
  }, [appointmentSlots]);

  return (
    <>
     
    <div>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        initialDate={appointmentSlots?.firstDate || new Date().toISOString().split('T')[0]} // default to today if no date
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
        
        if(isAuthenticated)
        {
          console.log("auth true");
          setShowLoginForm(false);
          setShowApproveBooking(true);
     //     handleAppointmentBooking(info.event.id);
        }
        else
        {
          console.log("auth false");
          setShowLoginForm(true);
          setShowApproveBooking(false);
        }
  }}
      /> 
      <div> 
    {showLoginForm ? <GuestLogin open={showLoginForm} onOpenChange={setShowLoginForm} showOtherState={setShowApproveBooking}/> :
                       clickedAppointment && <ApproveBookingForm open={showApproveBooking} onOpenChange={setShowApproveBooking} slotInfo={clickedAppointment}/>} 
    </div>
      
    </div>
   
    </>
  ); 
}