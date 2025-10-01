"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/api";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"


type Insurance = {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  premium: number;
  insuredValue: number;
};

async function fetchInsurances(): Promise<Insurance[]> {
  const res = await api.get("/insurances");
  return res.data;
}

export default function InsurancesPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["insurances"],
    queryFn: fetchInsurances,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/insurances/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insurances"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir este seguro?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar seguros.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Seguros</h1>
        <Link href="/insurance/new">
          <Button>Novo Seguro</Button>
        </Link>
      </div>

      <Card className="p-4 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Duração (anos)</TableHead>
              <TableHead>Prêmio</TableHead>
              <TableHead>Valor Segurado</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((ins) => (
              <TableRow key={ins.id}>
                <TableCell>{ins.id}</TableCell>
                <TableCell className="font-medium">{ins.name}</TableCell>
                <TableCell>
                  {new Date(ins.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
                </TableCell>
                <TableCell>{ins.duration}</TableCell>
                <TableCell>{ins.premium}</TableCell>
                <TableCell>{ins.insuredValue}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/insurance/${ins.id}`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/insurance/${ins.id}/edit`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(ins.id)}
                    disabled={deleteMutation.isPending}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
