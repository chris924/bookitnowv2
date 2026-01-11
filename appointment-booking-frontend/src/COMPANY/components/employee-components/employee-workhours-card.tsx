import { EmployeeWorkingHoursResponseDTO } from "@/API/models/EmployeeWorkingHoursResponseDTO";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useEffect, useState } from "react";
import { EventInput } from "@fullcalendar/core/index.js";
import { Button } from "@/components/ui/button"
import { EventImpl } from "@fullcalendar/core/internal";
import EditSlotDialogForm from "@/components/ui/own/EditSlotDialogForm";
import { showToast } from "@/components/ui/own/ShowToast";
import { useApi } from "@/hooks/useApi";
import { handleAPIError } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { WorkhourEditDTO } from "@/API/models/WorkhourEditDTO";
import AddSlotDialogForm from "@/components/ui/own/AddSlotDialogForm";
import { WorkhourAddDTO } from "@/API/models/WorkhourAddDTO";
import ApproveDialogForm from "@/components/ui/own/ApproveDialogForm";

interface EmployeeWorkingHoursCardProps
{
  workingHours: EmployeeWorkingHoursResponseDTO[]
  employeeSlug: string
}


function toFullCalendarEvent(slot: EmployeeWorkingHoursResponseDTO, _index: number): EventInput {
  const startTime = slot.startTime.slice(0, 5); // 'HH:mm'
  const endTime = slot.endTime.slice(0, 5);

  const dateStr = new Date(slot.date).toISOString().split("T")[0];

  const event = {
    id: slot.id.toString(),
    title: slot.name,
    start: `${dateStr}T${startTime}`,
    end: `${dateStr}T${endTime}`,
    color: "red",
    className: "cursor-pointer",
  };

  console.log(event);
  return event;

}

export default function EmployeeWorkingHoursCard({workingHours, employeeSlug}: EmployeeWorkingHoursCardProps)
{
  const [events, setEvents] = useState<EventInput[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showApproveDeleteAll, setShowApproveDeleteAll] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventImpl>();



  const latestVisibleRange = workingHours.length > 0 ? Math.max(
  ...workingHours
    .filter(w => w.date != null)
    .map(w => new Date(w.date!).getTime()) 
): 0;


const today = new Date();
const todayStr = today.toISOString().split("T")[0];

const endDate = new Date(latestVisibleRange);
endDate.setDate(endDate.getDate() + 1);


// day of week: 0=Sun .. 6=Sat
const firstDayOfWeek = today.getDay();

  useEffect(() => {

   let events = [
  // Working hour events
  ...workingHours.map((wh) => toFullCalendarEvent(wh, wh.id)),
];

    setEvents(events)

  }, [workingHours])


    const queryClient = useQueryClient();
    const api = useApi();

     const deleteSlotMutation = useMutation({
      mutationFn: ({ employeeSlug, workhourId }: { employeeSlug: string, workhourId: number }) =>
          api.employee.deleteEmployeeWorkhour({employeeSlug, workhourId}), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
         queryClient.invalidateQueries({ queryKey: ["employeeDataForCompany"] });
        showToast.success("Esemény törölve!");
        setShowEditForm(false);
        
      },
      onError: (error) => handleAPIError(error)
    });


     const editSlotMutation = useMutation({
      mutationFn: ({ employeeSlug, workhourId, workhourEditDTO }: { employeeSlug: string, workhourId: number, workhourEditDTO: WorkhourEditDTO }) =>
          api.employee.editEmployeeWorkhour({employeeSlug, workhourId, workhourEditDTO}), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
         queryClient.invalidateQueries({ queryKey: ["employeeDataForCompany"] });
        showToast.success("Esemény módosítva!");
        setShowEditForm(false);
        
      },
      onError: (error) => handleAPIError(error)
    });

     const addSlotMutation = useMutation({
      mutationFn: ({ employeeSlug, workhourAddDTO }: { employeeSlug: string, workhourAddDTO: WorkhourAddDTO }) =>
          api.employee.createEmployeeWorkhour({employeeSlug, workhourAddDTO}), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
         queryClient.invalidateQueries({ queryKey: ["employeeDataForCompany"] });
        showToast.success("Esemény létrehozva!");
        setShowAddForm(false);
        
      },
      onError: (error) => handleAPIError(error)
    });

     const deleteAllSlotMutation = useMutation({
      mutationFn: ({ employeeSlug }: { employeeSlug: string }) =>
          api.employee.deleteEmployeeWorkhours({employeeSlug}), 
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
         queryClient.invalidateQueries({ queryKey: ["employeeDataForCompany"] });
        showToast.success("Események törölve!");
        setShowApproveDeleteAll(false);
        
      },
      onError: (error) => handleAPIError(error)
    });

    function handleEditSlot(newSlotName: string, newStartValue: string, newEndValue: string)
    {
      if(selectedEvent)
      {
        const workhourId = parseInt(selectedEvent?.id);

        const workhourEditDTO = {
          slotName: newSlotName,
          newStart: newStartValue,
          newEnd: newEndValue
        }

          editSlotMutation.mutate({employeeSlug, workhourId, workhourEditDTO})
      }
      
    }

    function handleDeleteSlot(event: EventImpl)
    {
      const workhourId = parseInt(event.id); 
      deleteSlotMutation.mutate({employeeSlug, workhourId})
    }

    function handleAddSlot(data:  {slotName: string, fromDate: string, toDate: string, startTime: string, endTime: string; })
    {
      const workhourAddDTO = {
        slotName: data.slotName,
        start: data.startTime,
        end: data.endTime,
        fromDate: data.fromDate,
        toDate: data.toDate

      }
      addSlotMutation.mutate({employeeSlug, workhourAddDTO})
    }

    function handleDeleteAllSlot()
    {
      deleteAllSlotMutation.mutate({employeeSlug});
    }

    const isMobile = window.innerWidth < 640;

    return(
      <>
      <div className="p-5">
      <p className="text-4xl">Munkarend</p>
      </div>
      <div className="">
        <Button className=" m-5" onClick={() => {setShowAddForm(true)}}>Munakrend beállítás</Button>
        <Button variant="destructive" onClick={() => {setShowApproveDeleteAll(true)}}>Munakrendek törlése</Button>
      </div>
        <FullCalendar
        windowResize={(arg) => {
          arg.view.calendar.changeView(
            window.innerWidth < 640 ? "timeGridDay" : "timeGridWeek"
          )
        }}
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        initialView={isMobile ? "timeGridDay" : "timeGridWeek"}
        initialDate={new Date().toISOString().split('T')[0]}
        visibleRange={{
          start: todayStr, // today
          end: latestVisibleRange ? endDate.toISOString().split("T")[0] : new Date().toISOString().split('T')[0],
        }}
        validRange={{
          start: todayStr,
          end:  latestVisibleRange ? endDate.toISOString().split("T")[0] : new Date().toISOString().split('T')[0],
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
          setSelectedEvent(info.event); 
          setShowEditForm(true);
        
  }}  
      />  
      {showEditForm && selectedEvent && <EditSlotDialogForm value={selectedEvent} onEditClick={handleEditSlot} onDeleteClick={handleDeleteSlot} open={showEditForm} onOpenChange={setShowEditForm} isLoading={false}/>}
      {showAddForm && <AddSlotDialogForm onSubmit={(data) => handleAddSlot(data)} open={showAddForm} onOpenChange={setShowAddForm} isLoading={false} />}
      {showApproveDeleteAll &&  <ApproveDialogForm
              open={showApproveDeleteAll}
              onOpenChange={setShowApproveDeleteAll}
              title="Események törlése"
              description="Biztosan törölni szeretné az összes eseményt? A lefogalt időpontok automatikusan törlésre kerülnek!"
              buttonVariant="destructive"
              isLoading={false}
              onButtonClick={() => {
                handleDeleteAllSlot();
             //   setShowApproveDelete(false); // close approve dialog
               
              }}
            />
        }
      </>
    )
}