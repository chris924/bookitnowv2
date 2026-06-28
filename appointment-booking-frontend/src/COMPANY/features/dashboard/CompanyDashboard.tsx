import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "./components/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { CompanyEmployeeTableQuery, CompanyPastAppointmentsQuery, CompanyTotalRevenueQuery } from "../../hooks/query/CompanyDashboardQueries"
import Loader from "@/components/ui/own/Loader"

export default function CompanyDashboard() {
  const {data: employees, isLoading: employeesLoading} = CompanyEmployeeTableQuery();
  const {data: pastAppointments, isLoading: chartLoading} = CompanyPastAppointmentsQuery();
  const {data: sectionData, isLoading: sectionLoading} = CompanyTotalRevenueQuery();

  if(employeesLoading || !employees || chartLoading || !pastAppointments || sectionLoading || !sectionData)
    return <Loader/>

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards
          data={sectionData}
          fourthCard={{ label: "Legjobbra értékelt munkatárs", value: sectionData.bestRatedEmployee }}
        />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive pastAppointments={pastAppointments} />
        </div>
        <DataTable data={employees} />
      </div>
    </div>
  )
}
