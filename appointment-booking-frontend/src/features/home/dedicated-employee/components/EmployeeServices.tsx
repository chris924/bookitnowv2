
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
import { SpecialistPageDTO, SpecialistServiceDTO } from "@/lib/specialist-types"

type SpecialistServicesData = {
    employeeServices: SpecialistServiceDTO[];
}

export default function EmployeeServices({employeeServices} : SpecialistServicesData)
{

    return(
            <div>
    <Table>
      <TableCaption>Szolgáltatások listája</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Szolgáltatás</TableHead>
          <TableHead>Idő</TableHead>
          <TableHead>Leírás</TableHead>
          <TableHead className="text-right">Összeg</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employeeServices.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell className="">{service.duration}</TableCell>
            <TableCell className="">{service.description}</TableCell>
            <TableCell className="text-right">{service.price}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
      </TableFooter>
    </Table>
  


            
            </div>
    )
}