"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { TimelineChart } from "@/components/timeline/timeline-chart";

type MovementType = 'ENTRADA' | 'SAIDA';
type MovementFrequency = 'UNICA' | 'MENSAL' | 'ANUAL';

interface Movement {
  id: number;
  type: MovementType;
  value: number;
  frequency: MovementFrequency;
  startDate: string;
}

interface Insurance {
  id: number;
  name: string;
  premium: number;
  insuredValue: number;
}

interface TimelineEvent {
  year: number;
  event: string;
  impact: number;
}


interface DashboardDetailsProps {
  details?: {
    movements?: Movement[];
    insurances?: Insurance[];
  };
  timeline?: TimelineEvent[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export function DashboardDetails({ details, timeline }: DashboardDetailsProps) {
  return (
    <div className="space-y-8">

      <TimelineChart events={timeline || []} />

      <Card>
        <CardHeader><CardTitle>Movimentações</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {details?.movements && details.movements.length > 0 ? (
            details.movements.map((movement) => {
              const isCredit = movement.type === 'ENTRADA';
              return (
                <Card key={movement.id} className="bg-background/50">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium capitalize">
                      {movement.type.toLowerCase()} ({movement.frequency.toLowerCase()})
                    </CardTitle>
                    {isCredit ? <ArrowUpRight className="h-4 w-4 text-green-500" /> : <ArrowDownRight className="h-4 w-4 text-red-500" />}
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${isCredit ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(movement.value)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Início em: {new Date(movement.startDate).toLocaleDateString('pt-BR')}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground col-span-2">Nenhuma movimentação encontrada.</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
         <CardHeader><CardTitle>Seguros</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {details?.insurances && details.insurances.length > 0 ? (
            details.insurances.map((insurance) => (
              <Card key={insurance.id} className="bg-background/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">{insurance.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(insurance.insuredValue)}</div>
                  <p className="text-xs text-muted-foreground">
                    Prêmio: {formatCurrency(insurance.premium)}/mês
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
             <p className="text-sm text-muted-foreground col-span-2">Nenhum seguro encontrado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}