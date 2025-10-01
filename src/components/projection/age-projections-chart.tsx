"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AgeProjection {
  name: string;
  total: number;
}

interface AgeProjectionsChartProps {
  data: AgeProjection[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function AgeProjectionsChart({ data }: AgeProjectionsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Projeção de Patrimônio por Idade</CardTitle>
          <CardDescription>Valores estimados para as idades chave</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[200px] items-center justify-center">
            <span className="text-sm text-muted-foreground">Nenhum dado de projeção por idade.</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção de Patrimônio por Idade</CardTitle>
        <CardDescription>Valores estimados para as idades chave</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="ageChartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.9}/>
              </linearGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `R$${new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(value)}`
              }
            />
            
            <Tooltip
              cursor={{ fill: 'hsl(var(--card))' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-1 gap-1.5">
                        <span className="text-sm font-bold">
                          {formatCurrency(payload[0].value as number)}
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar dataKey="total" fill="url(#ageChartGradient)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}