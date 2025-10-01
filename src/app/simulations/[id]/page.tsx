"use client";

import { useParams } from "next/navigation";
import { useQuery} from "@tanstack/react-query";
import { api, getSimulationVersions} from "../../../lib/api/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VersionModal } from "@/components/ui/version-modal";

type Simulation = {
  id: number;
  name: string;
  startDate: string;
  rate: number;
  status: string;
  allocations: { id: number; name: string; value: number; type: string }[];
  movements: { id: number; type: string; value: number; frequency: string }[];
  insurances: { id: number; name: string; premium: number; insuredValue: number }[];
};

async function fetchSimulation(id: string): Promise<Simulation> {
  const res = await api.get(`/simulations/${id}`);
  return res.data;
}


type SimulationVersion = {
  id: number;
  version: number;
  createdAt: string;
};

function SimulationVersionsTab({ simulationId }: { simulationId: number }) {

  const { data, isLoading, isError } = useQuery<SimulationVersion[]>({
    queryKey: ["simulation-versions", simulationId],
    queryFn: () => getSimulationVersions(simulationId),
  });

  if (isLoading) return <p>Carregando versões...</p>;
  if (isError) return <p>Erro ao carregar versões.</p>;

  return (
    <Card className="p-4">
    <h2 className="text-lg font-semibold mb-4">Histórico de versões</h2>

    <VersionModal simulationId={simulationId} />

    {data && data.length > 0 ? (
      <ul className="space-y-2 mt-4">
        {data.map((version) => (
          <li
            key={version.id}
            className="flex justify-between border-b py-2 text-sm"
          >
            <span>Versão {version.version}</span>
            <span>
              Criada em {new Date(version.createdAt).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-sm text-muted-foreground mt-4">
        Nenhuma versão encontrada ainda.
      </p>
    )}
  </Card>
  );
}

export default function SimulationDetailPage() {
  const params = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["simulation", params.id],
    queryFn: () => fetchSimulation(params.id),
  });

  if (isLoading) return <p>Carregando...</p>;
  if (isError || !data) return <p>Erro ao carregar simulação.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Simulação: {data.name}</h1>

      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="versoes">Versões</TabsTrigger>
        </TabsList>

        <TabsContent value="dados">
          <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Informações Básicas</h2>
            <p>Status: {data.status}</p>
            <p>Data de início: {new Date(data.startDate).toLocaleDateString("pt-BR", { timeZone: "UTC" })}</p>
            <p>Taxa: {data.rate}</p>

            <h3 className="text-md font-semibold mt-4">Alocações</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.allocations.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>{a.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="text-md font-semibold mt-4">Movimentos</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Frequência</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.movements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{m.value}</TableCell>
                    <TableCell>{m.frequency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <h3 className="text-md font-semibold mt-4">Seguros</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Prêmio</TableHead>
                  <TableHead>Valor Segurado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.insurances.map((i) => (
                  <TableRow key={i.id}>
                    <TableCell>{i.name}</TableCell>
                    <TableCell>{i.premium}</TableCell>
                    <TableCell>{i.insuredValue}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="versoes">
          <SimulationVersionsTab simulationId={data.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}