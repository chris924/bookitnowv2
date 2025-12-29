import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
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
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { useCompanyStore, useUserStore } from "@/stores/AuthStore"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import { User2, ChevronUp } from "lucide-react"
import { EmployeeDataTableResponseDTO } from "@/API/models/EmployeeDataTableResponseDTO"

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

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  employees: EmployeeDataTableResponseDTO[]; 
};

export function AppSidebar({employees, ...props }: AppSidebarProps) {

const { company } = useCompanyStore();

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
         
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       {company && <NavUser company={company} />}
      </SidebarFooter>
    </Sidebar>
  )
}
