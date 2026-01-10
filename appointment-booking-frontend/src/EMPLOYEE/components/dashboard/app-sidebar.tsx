import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconScissors,
  IconClock
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
import { NavDocuments } from "./nav-documents"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { useEmployeeStore } from "@/stores/AuthStore"
import { EmployeeDataTableResponseDTO } from "@/API/models/EmployeeDataTableResponseDTO"
import { NavMain } from "./nav-main"

const data = {

  navMain: [
    {
      title: "Áttekintés",
      url: "",
      icon: IconDashboard,
    },
    {
      title: "Szolgáltatások",
      url: "company/statistics",
      icon: IconScissors,
    },
    {
      title: "Munkarend",
      url: "/employee/workhours",
      icon: IconClock,
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
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Segítség",
      url: "#",
      icon: IconHelp,
    }
  ],
  documents: [
    {
      name: "Könyvtár",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Riportok",
      url: "#",
      icon: IconReport,
    },
  ],
}



export function AppSidebar({ ...props }) {

const { employee } = useEmployeeStore();

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
                <span className="text-base font-semibold">{employee?.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
         
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       {employee && <NavUser employee={employee} />}
      </SidebarFooter>
    </Sidebar>
  )
}
