import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { AppointmentsByDateResponseDTO } from "@/API"

const chartConfig = {
  count: {
    label: "Foglalás",
    color: "var(--primary)",
  },
  income: {
    label: "Bevétel",
    color: "var(--primary)",
  }
} satisfies ChartConfig

interface ChartAreaInteractiveProps {
  pastAppointments: AppointmentsByDateResponseDTO[];
}

export function ChartAreaInteractive({ pastAppointments }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredAppointments = pastAppointments.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date();
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Összes foglalás</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Az összes foglalás az elmúlt 3 hónapban
          </span>
          <span className="@[540px]/card:hidden">Utolsó 3 hónap</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Utolsó 3 hónap</ToggleGroupItem>
            <ToggleGroupItem value="30d">Utolsó 30 nap</ToggleGroupItem>
            <ToggleGroupItem value="7d">Utolsó 7 nap</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredAppointments}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <YAxis yAxisId="left" stroke="var(--chart-count)" tick={{ fill: 'var(--chart-count)' }} tickLine={{ stroke: 'var(--chart-count)' }} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--chart-income)" tick={{ fill: 'var(--chart-income)' }} tickLine={{ stroke: 'var(--chart-income)' }} />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value, payload) => {
                    const dateString = payload?.[0]?.payload?.date ?? value;
                    const parsedDate = new Date(dateString);

                    if (isNaN(parsedDate.getTime())) {
                      return value;
                    }

                    return parsedDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              yAxisId="left"
              dataKey="count"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--chart-count)"
              strokeWidth={2}
              dot={true}
              name="Foglalások"
            />

            <Area
              yAxisId="right"
              dataKey="income"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--chart-income)"
              strokeWidth={2}
              dot={true}
              name="Bevétel"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
