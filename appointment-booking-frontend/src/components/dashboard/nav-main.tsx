import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import { ChevronDown, PersonStandingIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { EmployeeDataTableResponseDTO } from "@/API/models/EmployeeDataTableResponseDTO"
import { createSlug } from "@/lib/utils"

export function NavMain({
  items,
  employees
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[],
  employees?: EmployeeDataTableResponseDTO[]
}) {

  const navigate = useNavigate();

  return (
  <SidebarGroup>
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={item.title}
              className="cursor-pointer"
              onClick={() => navigate(item.url)}
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}

        {employees && employees.length > 0 && (
          <SidebarMenuItem>
            <Collapsible defaultOpen className="group/collapsible">
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="cursor-pointer flex items-center justify-between w-full">
                  <span>Alkalmazottak</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="mt-1 flex flex-col gap-1">
                {employees.map((employee) => (
                  <SidebarMenuItem key={employee.name}>
                    <SidebarMenuButton
                      tooltip={employee.name}
                      className="cursor-pointer pl-6"
                      onClick={() => navigate(`company/employees/${createSlug(employee.name, employee.id)}`)}
                    >
                      <PersonStandingIcon/>
                      <span>{employee.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);
}
