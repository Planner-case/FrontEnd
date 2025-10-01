'use client';

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../lib/api/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type Insurance = {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  premium: number;
  insuredValue: number;
};

async function fetchInsurance(id: string): Promise<Insurance> {
  const res = await api.get(`/insurances/${id}`);
  return res.data;
}

export default function InsuranceDetailPage() {
  const params = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["insurance", params.id],
    queryFn: () => fetchInsurance(params.id),
    enabled: !!params.id,
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !data) return <p>Erro ao carregar seguro.</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{data.name}</CardTitle>
          <CardDescription>Detalhes do Seguro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Data de Início:</strong> {new Date(data.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
          <p><strong>Duração:</strong> {data.duration} anos</p>
          <p><strong>Prêmio:</strong> R$ {data.premium.toFixed(2)}</p>
          <p><strong>Valor Segurado:</strong> R$ {data.insuredValue.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}