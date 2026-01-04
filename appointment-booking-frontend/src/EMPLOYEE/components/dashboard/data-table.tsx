

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import defaultAvatar from "@/assets/default.jpg"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CompanyDedicatedEmployeePastBookings } from "@/COMPANY/hooks/query/CompanyDedicatedEmployeeQuery"
import { createSlug, formatDuration, formatTime, handleAPIError } from "@/lib/utils"
import Loader from "@/components/ui/own/Loader"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ApproveDialogForm from "@/components/ui/own/ApproveDialogForm"
import { useState } from "react"
import { useApi } from "@/hooks/useApi"
import { LoginUserRequest } from "@/API"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "@/components/ui/own/ShowToast"
import { useNavigate } from "react-router-dom"

 

export const schema = z.object({
  appointmentId: z.number(),
  customerName: z.string(),
  customerAvatar: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  serviceName: z.string(),
  duration: z.string(),
  isActive: z.boolean()
})




function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.appointmentId,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id} className={row.original.isActive ? "bg-green-500" : "bg-gray-500"}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[]
}) {

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(0);

 const [showCancelAppointment, setShowCancelAppointment] = useState(false);

  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

   const {mutate, isPending, isError, error} = useMutation({

    mutationFn: (appointmentId: number) => api.appointment.employeeCancelAppointment({appointmentId}),
    onSuccess: async () => {
      showToast.success("Foglalás lemondva!");
      setShowCancelAppointment(false);
      setSelectedAppointmentId(0);
      await queryClient.invalidateQueries({queryKey: ["employeeSectionCards"]});
      await queryClient.invalidateQueries({ queryKey: ["EmployeeAppointments"] });
      await queryClient.invalidateQueries({ queryKey: ["pastEmployeeAppointments"] });
    },
    onError: (error) => handleAPIError(error)
  })

function cancelAppointment(appointmentId : number)
{
  mutate(appointmentId);
}


function handleCancelClick(id: number) {
  setSelectedAppointmentId(id);
  setShowCancelAppointment(true);
}

  const data = initialData
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ appointmentId }) => appointmentId) || [],
    [data]
  )

  const centerCell = "flex justify-center items-center w-full";

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
 {
  accessorKey: "Ügyfél",
  header: () => (
    <div className={centerCell}>
      Ügyfél
    </div>
  ),
  cell: ({ row }) => (
    <div className={centerCell}>
      <Avatar>
        <AvatarImage src={row.original.customerAvatar} />
        <AvatarFallback>
          <img src={defaultAvatar} alt="default avatar" />
        </AvatarFallback>
      </Avatar>
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-lg">
        {row.original.customerName ?? '-'}
      </Badge>
    </div>
  ),
  enableHiding: false,
},
  {
    accessorKey: "Dátum",
    header: () => (
    <div className={centerCell}>
      Dátum
    </div>
  ),
    cell: ({ row }) => (
       <div className={centerCell}>
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-center text-lg">
        {row.original.date ?? '-'}
      </Badge>
    </div>
    ),
  },
  {
    accessorKey: "Időpont",
    header: () => (
    <div className={centerCell}>
      Időpont
    </div>
  ),
    cell: ({ row }) => (
     <div className={centerCell}>
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-center text-lg">
        {formatTime(row.original.startTime) + "-" + formatTime(row.original.endTime)}
      </Badge>
    </div>
    ),
  },
  {
    accessorKey: "Szolgáltatás",
   header: () => (
    <div className={centerCell}>
      Szolgáltatás
    </div>
  ),
    cell: ({ row }) => (
      <div className={centerCell}>
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-center text-lg">
        {row.original.serviceName ?? '-'}
      </Badge>
    </div>
    ),
  },
  {
    accessorKey: "Szolgáltatás időtartam",
    header: () => (
    <div className={centerCell}>
      Szolgáltatás időtartam
    </div>
  ),
    cell: ({ row }) => (
      <div className={centerCell}>
        <Badge variant="outline" className="text-muted-foreground px-1.5 text-xl">
          {formatDuration(row.original.duration)}
        </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({row}) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuSeparator />
          {row.original.isActive ? <DropdownMenuItem variant="destructive" onClick={() => handleCancelClick(row.original.appointmentId)}>Időpont lemondás</DropdownMenuItem> : ""}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.appointmentId.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

 

  return (
    <>
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Lefoglalt Időpontok</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Oszlopok testreszabása</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
   {showCancelAppointment && selectedAppointmentId && (
  <ApproveDialogForm
    title="Foglalás lemondás"
    description="Biztosan lemondod a foglalást? Az időpont újra foglalható lesz amíg a munakarend nincs átállítva!"
    onButtonClick={() => cancelAppointment(selectedAppointmentId)}
    onOpenChange={setShowCancelAppointment}
    open={showCancelAppointment}
    buttonVariant="destructive"
    isLoading={isPending}
  />
)}
    </>
  )
}



const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
  
} satisfies ChartConfig

 /*function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()


  const employeeSlug =  createSlug(item.name, item.id);
  const {data, isLoading, error} = CompanyDedicatedEmployeePastBookings(employeeSlug);

  if(isLoading) return <Loader/>

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
           <Avatar className="rounded-lg">
            <AvatarImage
              src={item.}
              alt={item.name}
            />
            <AvatarFallback>{defaultAvatar}</AvatarFallback>
          </Avatar>
          {item.name}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <div className="flex flex-row gap-4 text-center">  
            <Avatar className="rounded-lg">
            <AvatarImage
              src={item.avatarUrl}
              alt={item.name}
            />
            <AvatarFallback>{defaultAvatar}</AvatarFallback>
          </Avatar>
          <DrawerTitle>       
            {item.name}
            </DrawerTitle>
          </div>
          <DrawerDescription>
            Az összes foglalás az elmúlt 6 hónapban
          </DrawerDescription>
         
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={data}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="count"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                    name="Foglalások"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
            </>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Bezárás</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}*/
