"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../lib/api/api";
import { Table,TableBody,TableCell,TableHead,TableHeader,TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link"


type Simulation = {
  id: number;
  name: string;
  startDate: string;
  rate: number;
  status: string;
};

async function fetchSimulations(): Promise<Simulation[]> {
  const res = await api.get("/simulations");
  return res.data;
}

export default function SimulationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["simulations"],
    queryFn: fetchSimulations,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/simulations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["simulations"] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta simulação? Todas as suas dependências (alocações, seguros, etc) também serão excluídas.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar simulações.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Simulações</h1>
        <Link href="/simulations/new">
          <Button>Nova Simulação</Button>
        </Link>
      </div>

      <Card className="p-4 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((sim) => (
              <TableRow key={sim.id}>
                <TableCell>{sim.id}</TableCell>
                <TableCell className="font-medium">{sim.name}</TableCell>
                <TableCell>
                  {new Date(sim.startDate).toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                  })}
                </TableCell>
                <TableCell>{sim.rate}</TableCell>
                <TableCell>{sim.status}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/simulations/${sim.id}`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/simulations/${sim.id}/edit`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(sim.id)}
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
