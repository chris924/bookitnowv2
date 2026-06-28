import {
  IconChartBar,
  IconClock,
  IconDashboard,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconScissors,
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
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import { NavMain } from "@/components/dashboard/nav-main"
import { useEmployeeStore } from "@/stores/AuthStore"
import { createSlug } from "@/lib/utils"
import { showToast } from "@/components/ui/own/ShowToast"
import { useNavigate } from "react-router-dom"

export function getSidebarData() {
  const { employee } = useEmployeeStore();

  if (!employee || !employee.id || !employee.name) {
    showToast.error("No employee found");
    return null;
  }

  const employeeSlug = createSlug(employee.name, employee.id);

  return {
    navMain: [
      {
        title: "Áttekintés",
        url: "",
        icon: IconDashboard,
      },
      {
        title: "Szolgáltatások",
        url: `employee/services/${employeeSlug}`,
        icon: IconScissors,
      },
      {
        title: "Munkarend",
        url: "/employee/workhours",
        icon: IconClock,
      },
      {
        title: "Beállítások",
        url: "employee/options",
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
        url: "/employee/help",
        icon: IconHelp,
      }
    ]
  }
}

export function AppSidebar({ ...props }) {
  const { employee, logoutEmployee } = useEmployeeStore();
  const navigate = useNavigate();

  const data = getSidebarData();

  if(!data) return;

  function handleLogout() {
    logoutEmployee();
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
                <span className="text-base font-semibold">{employee?.name}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
       {employee && <NavUser user={employee} onLogout={handleLogout} />}
      </SidebarFooter>
    </Sidebar>
  )
}
