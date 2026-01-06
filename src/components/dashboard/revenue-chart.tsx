"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig = {
  total: {
    label: "Total",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


export default function RevenueChart() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        setData([
            { date: "Lun", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Mer", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Jeu", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Ven", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Sam", total: Math.floor(Math.random() * 5000) + 1000 },
            { date: "Dim", total: Math.floor(Math.random() * 5000) + 1000 },
        ]);
    }, []);

  if (!data.length) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recettes de la semaine</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="w-full h-[350px] flex items-center justify-center">
                    Chargement des données...
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recettes de la semaine</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ChartContainer config={chartConfig} className="min-h-[350px] w-full">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <ChartTooltip
                cursor={{ fill: 'hsl(var(--accent))', opacity: 0.5 }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
