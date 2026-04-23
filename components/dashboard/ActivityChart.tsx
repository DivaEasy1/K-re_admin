"use client";

import {
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
import type { Activity } from "@/types";

interface ActivityChartProps {
  activities: Activity[];
}

const difficultyConfig = [
  { key: "EASY", label: "Facile", color: "#10b981" },
  { key: "MEDIUM", label: "Intermediaire", color: "#f59e0b" },
  { key: "HARD", label: "Difficile", color: "#ef4444" }
] as const;

const categoryColors = ["#1E90FF", "#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd"];

function getCategoryLabel(category: string) {
  if (category === "leisure") return "Loisir";
  if (category === "nature") return "Nature";
  if (category === "gastronomy") return "Gastronomie";
  if (category === "sport") return "Sport";
  return category;
}

export function ActivityChart({ activities }: ActivityChartProps) {
  const difficultyData = difficultyConfig.map((difficulty) => ({
    name: difficulty.label,
    value: activities.filter((activity) => activity.difficulty === difficulty.key).length,
    color: difficulty.color
  }));

  const categoryMap = new Map<string, number>();

  activities.forEach((activity) => {
    const current = categoryMap.get(activity.category) ?? 0;
    categoryMap.set(activity.category, current + 1);
  });

  const categoryData = Array.from(categoryMap.entries()).map(([category, count], index) => ({
    name: getCategoryLabel(category),
    value: count,
    color: categoryColors[index % categoryColors.length]
  }));

  return (
    <div className="grid gap-3 xl:grid-cols-[1.4fr,1fr]">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-start justify-between gap-3">
          <div>
            <CardTitle>Repartition des activites</CardTitle>
            <CardDescription>Vue en direct des activites en base par niveau de difficulte.</CardDescription>
          </div>
          <div className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {activities.length} activites
          </div>
        </CardHeader>
        <div className="h-[250px] px-1 pb-1 sm:px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData} margin={{ left: 0, right: 12, top: 10, bottom: 2 }} barSize={34}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(226,232,240,0.85)",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                  background: "rgba(255,255,255,0.92)"
                }}
              />
              <Bar dataKey="value" radius={[12, 12, 6, 6]}>
                {difficultyData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Categories d&apos;activites</CardTitle>
          <CardDescription>Les categories sont calculees a partir des activites reelles du catalogue.</CardDescription>
        </CardHeader>
        <div className="h-[250px] px-1 pb-1 sm:px-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ left: 0, right: 8, top: 10, bottom: 2 }} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} interval={0} angle={-15} height={48} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(226,232,240,0.85)",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
                  background: "rgba(255,255,255,0.92)"
                }}
              />
              <Bar dataKey="value" radius={[10, 10, 5, 5]}>
                {categoryData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
