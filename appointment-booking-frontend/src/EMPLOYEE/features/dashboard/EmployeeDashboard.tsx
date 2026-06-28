import Loader from "@/components/ui/own/Loader"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { SectionCards } from "@/components/dashboard/section-cards";
import { EmployeeAppointmentsTableQuery, EmployeePastAppointmentsQuery, EmployeeSectionCardsQuery } from "../../hooks/query/EmployeeDashboardQuery";

export default function EmployeeDashboard() {
  const {data: appointments, isLoading: appointmentsLoading} = EmployeeAppointmentsTableQuery();
  const {data: pastAppointments, isLoading: chartLoading} = EmployeePastAppointmentsQuery();
  const {data: sectionData, isLoading: sectionLoading} = EmployeeSectionCardsQuery();

  if(appointmentsLoading || !appointments || chartLoading || !pastAppointments || sectionLoading || !sectionData)
    return <Loader/>

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          data={sectionData}
          fourthCard={{ label: "Jelenlegi értékelés", value: sectionData.currentRating }}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive pastAppointments={pastAppointments} />
        </div>
        <DataTable data={appointments} />
      </div>
    </div>
  )
}
