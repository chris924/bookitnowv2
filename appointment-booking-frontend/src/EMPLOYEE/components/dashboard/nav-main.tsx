import { type Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"

export function NavMain({
  items
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {

  const navigate = useNavigate();

  return (
  <SidebarGroup>
    <SidebarGroupContent className="flex flex-col gap-2">
      <SidebarMenu>
        {/* --- Main navigation items --- */}
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

      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
);

}
