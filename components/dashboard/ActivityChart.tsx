"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardTrend, stationTraffic } from "@/lib/mock-data";

export function ActivityChart() {
  return (
    <div className="grid gap-3 xl:grid-cols-[1.4fr,1fr]">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Performance Pulse</CardTitle>
            <CardDescription>
              Reservations and revenue momentum with a clean, finance-inspired visual rhythm.
            </CardDescription>
          </div>
          <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Last 9 months
          </div>
        </CardHeader>
        <div className="h-[250px] px-1 pb-1 sm:px-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dashboardTrend} margin={{ left: 0, right: 12, top: 10, bottom: 2 }}>
              <defs>
                <linearGradient id="reservationsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1E90FF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1E90FF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(226,232,240,0.85)",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                  background: "rgba(255,255,255,0.92)"
                }}
              />
              <Area
                type="monotone"
                dataKey="reservations"
                stroke="#1E90FF"
                strokeWidth={2.2}
                fill="url(#reservationsGradient)"
                activeDot={{ r: 4 }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0f71d0"
                strokeWidth={1.8}
                fill="url(#revenueGradient)"
                activeDot={{ r: 3.5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Station Momentum</CardTitle>
          <CardDescription>Bookings by station paired with satisfaction score for quick comparison.</CardDescription>
        </CardHeader>
        <div className="h-[250px] px-1 pb-1 sm:px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stationTraffic} margin={{ left: 0, right: 8, top: 10, bottom: 2 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
              <XAxis dataKey="station" tickLine={false} axisLine={false} tickMargin={8} interval={0} angle={-15} height={48} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(226,232,240,0.85)",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                  background: "rgba(255,255,255,0.92)"
                }}
              />
              <Bar dataKey="bookings" radius={[10, 10, 5, 5]}>
                {stationTraffic.map((entry) => (
                  <Cell
                    key={entry.station}
                    fill={entry.station === "Lagoon Bay" ? "#1E90FF" : "rgba(30, 144, 255, 0.35)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
