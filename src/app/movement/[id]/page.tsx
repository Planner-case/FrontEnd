'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Movement = {
  id: number;
  type: string;
  value: number;
  frequency: string;
  startDate: string;
  endDate: string | null;
};

async function fetchMovement(id: string): Promise<Movement> {
  const res = await api.get(`/movements/${id}`);
  return res.data;
}

export default function MovementDetailPage() {
  const params = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movement", params.id],
    queryFn: () => fetchMovement(params.id),
    enabled: !!params.id,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !data) return <p>Erro ao carregar movimentação.</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movimentação: {data.type}</CardTitle>
          <CardDescription>Detalhes da Movimentação</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Valor:</strong> R$ {data.value.toFixed(2)}</p>
          <p><strong>Frequência:</strong> {data.frequency}</p>
          <p><strong>Data de Início:</strong> {new Date(data.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
          {data.endDate && <p><strong>Data Final:</strong> {new Date(data.endDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>}
        </CardContent>
      </Card>
    </div>
  );
}