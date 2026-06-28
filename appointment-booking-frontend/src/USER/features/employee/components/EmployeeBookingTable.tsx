import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { EventInput } from '@fullcalendar/core/index.js';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // for click/select
import { useEmployeeStore, useUserStore } from '@/stores/AuthStore';


import GuestLogin from '@/components/auth/GuestLogin';
import { EventImpl } from '@fullcalendar/core/internal';
import ApproveDialogForm from '@/components/dialogs/ApproveDialogForm';
import { useBookAppointment } from '@/USER/hooks/query/UserAppointmentsQuery';
import { AppointmentSlotResponseDTO, SlotResponseDTO } from '@/API';

type EmployeeBookingTableProps = {
  appointmentSlots?: AppointmentSlotResponseDTO;
};

function toFullCalendarEvent(slot: SlotResponseDTO, _index: number): EventInput {
  const startTime = slot.start.slice(0, 5); // 'HH:mm'
  const endTime = slot.end.slice(0, 5);

  const isoDate = new Date(slot.date).toISOString().split("T")[0];
  return {
    id: String(slot.id),
    title: "",
    start: `${isoDate}T${startTime}`,
    end: `${isoDate}T${endTime}`,
    color: (slot.status === "FREE" || slot.status === "CANCELLED") ? "green" : "grey",
    className: slot.status == "FREE" ? "cursor-pointer" : "",
  };
}

export default function EmployeeBookingTable({ appointmentSlots }: EmployeeBookingTableProps) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showApproveBooking, setShowApproveBooking] = useState(false);
  const [clickedAppointment, setClickedAppointment] = useState<EventImpl>();

  const {isAuthenticated} = useUserStore();

 // const [view, setView] = useState<"login" | "register">("login");

  const handleBookAppointment = useBookAppointment();

  useEffect(() => {
    if (appointmentSlots && appointmentSlots.slotResponseDTO.length > 0) {
      const fcEvents = appointmentSlots.slotResponseDTO.map(toFullCalendarEvent);
      setEvents(fcEvents);

    }
  }, [appointmentSlots]);

  async function handleOnButtonClick(id: string) {
    handleBookAppointment.mutate(
      { appointmentId: Number(id) },
      {
        onSuccess: () => {
          setShowApproveBooking(false);
        },
      }
    );
  }


  const endDate = new Date(appointmentSlots?.lastDate!);
  endDate.setDate(endDate.getDate() + 1);

  const isMobile = window.innerWidth < 640;

  
  return (
    <>
     
    <div>
      <FullCalendar
       windowResize={(arg) => {
          arg.view.calendar.changeView(
            window.innerWidth < 640 ? "timeGridDay" : "timeGridWeek"
          )
        }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
        initialDate={appointmentSlots?.firstDate || new Date().toISOString().split('T')[0]} // default to today if no date
        visibleRange={{
          start: new Date().toISOString().split("T")[0], // today
          end: appointmentSlots?.lastDate || new Date().toISOString().split("T")[0],
        }}
        validRange={{
          start: appointmentSlots?.firstDate || new Date().toISOString().split('T')[0],
          end: endDate || new Date().toISOString().split('T')[0],
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
      <div> 
    {showLoginForm ? <GuestLogin open={showLoginForm} onOpenChange={setShowLoginForm} showApproveBooking={setShowApproveBooking}/> :
                        clickedAppointment && <ApproveDialogForm title='Biztosan lefoglalja az időpontot?' open={showApproveBooking} isLoading={handleBookAppointment.isPending} buttonVariant='default'
                         description={`Dátum: ${clickedAppointment.start?.toDateString()} Kezdés: ${clickedAppointment.start?.getHours()}:${clickedAppointment.start?.getMinutes().toString().padStart(2, "0")}`} onOpenChange={setShowApproveBooking} onButtonClick={handleOnButtonClick} value={clickedAppointment.id}/>}
    </div>
      
    </div>
   
    </>
  ); 
}