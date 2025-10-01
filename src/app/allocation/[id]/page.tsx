'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Allocation = {
  id: number;
  type: string;
  name: string;
  value: number;
  date: string;
  hasFinancing: boolean;
  startDate: string | null;
  installments: number | null;
  interestRate: number | null;
  downPayment: number | null;
};

async function fetchAllocation(id: string): Promise<Allocation> {
  const res = await api.get(`/allocations/${id}`);
  return res.data;
}

export default function AllocationDetailPage() {
  const params = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["allocation", params.id],
    queryFn: () => fetchAllocation(params.id),
    enabled: !!params.id,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !data) return <p>Erro ao carregar alocação.</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>Detalhes da Alocação ({data.type})</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Valor:</strong> R$ {data.value.toFixed(2)}</p>
          <p><strong>Data:</strong> {new Date(data.date).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
          {data.hasFinancing && (
            <div className="pt-4 border-t mt-4">
              <h3 className="font-semibold">Detalhes do Financiamento</h3>
              {data.startDate && <p><strong>Data de Início:</strong> {new Date(data.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>}
              {data.installments && <p><strong>Parcelas:</strong> {data.installments}</p>}
              {data.interestRate && <p><strong>Taxa de Juros:</strong> {data.interestRate}%</p>}
              {data.downPayment && <p><strong>Entrada:</strong> R$ {data.downPayment.toFixed(2)}</p>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}