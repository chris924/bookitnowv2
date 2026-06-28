import * as React from "react"
import {
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
} from "@tabler/icons-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import { useCompanyStore } from "@/stores/AuthStore"
import { EmployeeDataTableResponseDTO } from "@/API/models/EmployeeDataTableResponseDTO"
import { useNavigate } from "react-router-dom"

const data = {
  navMain: [
    {
      title: "Áttekintés",
      url: "",
      icon: IconDashboard,
    },
    {
      title: "Beállítások",
      url: "company/options",
      icon: IconListDetails,
    },
    {
      title: "Statisztikák",
      url: "company/statistics",
      icon: IconChartBar,
    },
  ],
  navSecondary: [
    {
      title: "Segítség",
      url: "/company/help",
      icon: IconHelp,
    }
  ]
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  employees: EmployeeDataTableResponseDTO[];
};

export function AppSidebar({employees, ...props }: AppSidebarProps) {
  const { company, logoutCompany } = useCompanyStore();
  const navigate = useNavigate();

  function handleLogout() {
    logoutCompany();
    navigate("/");
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{company?.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} employees={employees}/>
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       {company && <NavUser user={company} onLogout={handleLogout} />}
      </SidebarFooter>
    </Sidebar>
  )
}
