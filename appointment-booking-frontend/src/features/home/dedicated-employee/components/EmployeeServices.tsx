
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
import { SpecialistServiceDTO } from "@/lib/specialist-types"

type SpecialistServicesData = {
    employeeServices: SpecialistServiceDTO[];
}

export default function EmployeeServicesTable({employeeServices} : SpecialistServicesData)
{

    return(
        <div className="w-full flex justify-center lg:justify-start pt-12">
             <Table className="w-auto lg:ml-12">
      <TableCaption>Szolgáltatások listája</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] whitespace-normal break-words max-w-[150px] text-wrap">Szolgáltatás</TableHead>
          <TableHead className="w-[100px] whitespace-normal break-words max-w-[100px] text-wrap">Összeg</TableHead>
          <TableHead className=" whitespace-normal break-words max-w-[150px] text-wrap">Foglalás</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employeeServices.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium whitespace-normal break-words max-w-[150px] text-wrap">{service.name} <br></br> {service.duration} perc</TableCell>
            <TableCell className="whitespace-normal break-words max-w-[80px] text-wrap">{service.price}</TableCell>
            <TableCell className="whitespace-normal break-words max-w-[100px] text-wrap">{<Button className="w-[75px]">Időpontok</Button>}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
        </div>
   
        
    )
}