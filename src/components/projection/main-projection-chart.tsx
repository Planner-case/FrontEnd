"use client";

import { CartesianGrid, XAxis, YAxis, LineChart, Line, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface MainProjectionChartProps {
  data: {
    year: number;
    financeiro: number;
    imobilizado: number;
  }[];
}

const chartConfig = {
  financeiro: {
    label: "Patrimônio Financeiro",
    color: "hsl(var(--chart-1))",
  },
  imobilizado: {
    label: "Patrimônio Imobilizado",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function MainProjectionChart({ data }: MainProjectionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção Patrimonial Detalhada</CardTitle>
        <CardDescription>
          Evolução do seu patrimônio financeiro e imobilizado ao longo dos anos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickFormatter={(value) =>
                `R$ ${new Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                }).format(value)}`
              }
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Legend />
            <Line
              dataKey="financeiro"
              type="monotone"
              stroke="var(--color-financeiro)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="imobilizado"
              type="monotone"
              stroke="var(--color-imobilizado)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}