'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Movement = {
  id: number;
  type: string;
  value: number;
  frequency: string;
  startDate: string;
  endDate: string | null;
};

async function fetchMovements(): Promise<Movement[]> {
  const res = await api.get('/movements');
  return res.data;
}

export default function MovementsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movements'],
    queryFn: fetchMovements,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/movements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta movimentação?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar movimentações.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Movimentações</h1>
        <Link href="/movement/new">
          <Button>Nova Movimentação</Button>
        </Link>
      </div>

      <Card className="p-4 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Frequência</TableHead>
              <TableHead>Início</TableHead>
              <TableHead>Fim</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((mov) => (
              <TableRow key={mov.id}>
                <TableCell>{mov.id}</TableCell>
                <TableCell className="font-medium">{mov.type}</TableCell>
                <TableCell>{mov.value}</TableCell>
                <TableCell>{mov.frequency}</TableCell>
                <TableCell>
                  {new Date(mov.startDate).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  {mov.endDate ? new Date(mov.endDate).toLocaleDateString('pt-BR') : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/movement/${mov.id}`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/movement/${mov.id}/edit`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(mov.id)}
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
