"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgeProjectionsChart } from "@/components/projection/age-projections-chart";
import { MainProjectionChart } from "@/components/projection/main-projection-chart";
import { DashboardDetails } from "@/components/projection/dashboard-details";

type SimulationListItem = {
  id: string;
  name: string;
};


type ProjectionApiItem = {
  year: number;
  total: number;
  financeiro: number;
  imobilizado: number;
};

async function fetchSimulationsList(): Promise<SimulationListItem[]> {
  const response = await api.get("/simulations");
  return response.data;
}

async function getDashboardData(simulationId: string) {
  const [detailsRes, projectionRes, timelineRes] = await Promise.all([
    api.get(`/simulations/${simulationId}`),
    api.get(`/simulations/${simulationId}/projection`),
    api.get(`/simulations/${simulationId}/timeline`),
  ]);
  return {
    details: detailsRes.data,
    projection: projectionRes.data as ProjectionApiItem[],
    timeline: timelineRes.data,
  };
}

export default function ProjectionPage() {
  const [selectedSimulationId, setSelectedSimulationId] = useState("");

  const { data: simulationsList } = useQuery({
    queryKey: ["simulationsList"],
    queryFn: fetchSimulationsList,
  });

  const { data: dashboardData, isLoading, isError } = useQuery({
    queryKey: ["dashboard", selectedSimulationId],
    queryFn: () => getDashboardData(selectedSimulationId),
    enabled: !!selectedSimulationId,
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

  const currentYearData = dashboardData?.projection.find((p: ProjectionApiItem) => p.year === 2025);
  const netWorth = currentYearData?.total || 0;

  const ageChartData = [];
  if (dashboardData?.projection) {
    const projectionData = dashboardData.projection;
    const dataFor45 = projectionData.find((p) => p.year === 2025);
    const dataFor55 = projectionData.find((p) => p.year === 2035);
    const dataFor65 = projectionData.find((p) => p.year === 2045);

    if (dataFor45) ageChartData.push({ name: "45 anos", total: dataFor45.total, fill: "url(#ageChartGradient)" });
    if (dataFor55) ageChartData.push({ name: "55 anos", total: dataFor55.total, fill: "url(#ageChartGradient)" });
    if (dataFor65) ageChartData.push({ name: "65 anos", total: dataFor65.total, fill: "url(#ageChartGradient)" });
  }

  const formattedProjectionData = dashboardData?.projection.map((item) => ({
    year: item.year,
    financeiro: item.financeiro,
    imobilizado: item.imobilizado,
  }));

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5 items-start">
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <Select onValueChange={setSelectedSimulationId} value={selectedSimulationId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma Simulação" />
            </SelectTrigger>
            <SelectContent>
              {simulationsList?.map((sim) => (
                <SelectItem key={sim.id} value={sim.id}>
                  {sim.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
            <h2 className="text-lg font-semibold">Patrimônio Líquido</h2>
            <p className="text-3xl font-bold mt-2">
              {isLoading ? "Calculando..." : formatCurrency(netWorth) || 0}
            </p>
             {dashboardData?.details?.name && <p className="text-sm text-muted-foreground">{dashboardData.details.name}</p>}
          </div>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <AgeProjectionsChart data={ageChartData} />
        </div>
      </div>

      {selectedSimulationId ? (
        <>
          {isLoading && <div className="text-center">Carregando dados da projeção...</div>}
          {isError && <div className="text-center text-red-500">Erro ao carregar os dados.</div>}
          {dashboardData && (
            <div className="space-y-8">
              <MainProjectionChart data={formattedProjectionData || []} />
              <DashboardDetails
                details={dashboardData.details}
                timeline={dashboardData.timeline}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-xl font-semibold">Por favor, selecione uma simulação para começar.</h2>
        </div>
      )}
    </div>
  );
}