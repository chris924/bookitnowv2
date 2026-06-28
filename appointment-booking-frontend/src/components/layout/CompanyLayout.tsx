import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import React from "react";
import Loader from "../ui/own/Loader";
import { CompanyEmployeeTableQuery } from "@/COMPANY/hooks/query/CompanyDashboardQueries";
import { AppSidebar } from "@/COMPANY/features/dashboard/components/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";

export default function CompanyLayout() {
  const { data, isLoading } = CompanyEmployeeTableQuery(); // TODO: Refactor so only a dto which has employee name, and id gets into data

  if (isLoading || !data) return <Loader />;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* The sidebar stays visible on all company routes */}
      <AppSidebar variant="inset" employees={data} />

      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-1 flex-col p-4 md:p-6">
          {/* Renders the current nested route (e.g. /statistics, /employees/:id, etc.) */}
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}