import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import React from "react";
import { AppSidebar } from "@/EMPLOYEE/components/dashboard/app-sidebar";
import { SiteHeader } from "@/EMPLOYEE/components/dashboard/site-header";
import { ModeToggle } from "../ui/own/theme-toggle";


export default function EmployeeLayout() {

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* The sidebar stays visible on all employee routes */}
      <AppSidebar variant="inset"   />
      
      <SidebarInset>
        
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          {/* Renders the current nested route (e.g. /statistics, etc.) */}
          <Outlet />
        </main>
      </SidebarInset>
      
    </SidebarProvider>
  );
}