'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type TimelineEvent = {
  year: number;
  event: string;
  impact: number;
};

type ProcessedEvent = TimelineEvent & { y: number };

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ProcessedEvent;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ProcessedEvent;
    return (
      <div className="p-2 text-sm bg-background border rounded-md shadow-lg">
        <p className="font-bold">{data.year}</p>
        <p>{data.event}</p>
        <p className={`font-mono ${data.impact > 0 ? 'text-green-500' : 'text-red-500'}`}>
          Impacto: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.impact)}
        </p>
      </div>
    );
  }

  return null;
};

interface TimelineChartProps {
  events: TimelineEvent[];
}

export function TimelineChart({ events }: TimelineChartProps) {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Linha do Tempo de Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Nenhum evento na timeline.</p>
        </CardContent>
      </Card>
    );
  }

  const processedData: ProcessedEvent[] = [];
  const yearCounts: { [year: number]: number } = {};

  events.forEach(event => {
    if (yearCounts[event.year]) {
      yearCounts[event.year]++;
    } else {
      yearCounts[event.year] = 1;
    }
    processedData.push({ ...event, y: yearCounts[event.year] });
  });

  const uniqueYears = Array.from(new Set(processedData.map(e => e.year)));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Linha do Tempo de Eventos</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="year" 
              name="Ano" 
              domain={['dataMin - 1', 'dataMax + 1']} 
              ticks={uniqueYears}
              tick={{ fontSize: 12 }}
            />
            <YAxis type="number" dataKey="y" name="Eventos" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="Eventos" data={processedData} fill="hsl(var(--primary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
