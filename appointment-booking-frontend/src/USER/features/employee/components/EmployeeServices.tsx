
import { ServiceGetResponseDTO, AppointmentSlotResponseDTO } from "@/API";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useApi } from "@/hooks/useApi";

type SpecialistServicesData = {
    employeeServices: ServiceGetResponseDTO[];
    setSlots: (slots: AppointmentSlotResponseDTO) => void;
}

export default function EmployeeServicesTable({employeeServices, setSlots} : SpecialistServicesData)
{

   const api = useApi();
   
async function handleBookingClick(serviceId: number) {
 
  console.log(`Booking clicked for service ID: ${serviceId}`);
  const response = await api.appointment.getEmployeeMonthlyAppointments({serviceId}); //getMonthlyAppointments(serviceId);
  console.log(response);

  setSlots(response);

}

    return(
        <div className="flex flex-col justify-center lg:justify-start pt-12">
             <Table className="w-auto lg:max-w-2xl">
      <TableCaption>Szolgáltatások listája</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] lg:text-2xl whitespace-normal break-words max-w-[150px] lg:max-w-[400px] text-wrap">Szolgáltatás</TableHead>
          <TableHead className="w-[100px] lg:text-2xl  whitespace-normal break-words max-w-[100px] lg:max-w-[300px] text-wrap">Összeg</TableHead>
          <TableHead className=" whitespace-normal lg:text-2xl break-words max-w-[150px] lg:max-w[400px] text-wrap">Foglalás</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employeeServices.map((service) => (
          <TableRow key={service.id}>
            <TableCell className=" lg:w-[250px] font-medium lg:text-xl whitespace-normal break-words max-w-[150px] lg:max-w-[400px] text-wrap">{service.name} <br></br> <p className="lg:text-lg">{service.duration} perc</p></TableCell>
            <TableCell className=" lg:w-[200px] whitespace-normal lg:text-xl break-words max-w-[80px] lg:max-w-[300px] text-wrap">{service.price}</TableCell>
            <TableCell className="whitespace-normal lg:text-xl break-words max-w-[100px] lg:max-w-[400px] text-wrap">{<Button className="w-[75px] lg:w-[150px]" onClick={() => handleBookingClick(service.id)}>Időpontok</Button>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
        </div>
   
        
    )
}