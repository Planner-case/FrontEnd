'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Allocation = {
  id: number;
  name: string;
  type: string;
  value: number;
  date: string;
};

async function fetchAllocations(): Promise<Allocation[]> {
  const res = await api.get('/allocations');
  return res.data;
}

export default function AllocationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['allocations'],
    queryFn: fetchAllocations,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/allocations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta alocação?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar alocações.</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alocações</h1>
        <Link href="/allocation/new">
          <Button>Nova Alocação</Button>
        </Link>
      </div>

      <Card className="p-4 shadow-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((alloc) => (
              <TableRow key={alloc.id}>
                <TableCell>{alloc.id}</TableCell>
                <TableCell className="font-medium">{alloc.name}</TableCell>
                <TableCell>{alloc.type}</TableCell>
                <TableCell>{alloc.value}</TableCell>
                <TableCell>
                  {new Date(alloc.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/allocation/${alloc.id}`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Detalhes
                    </Button>
                  </Link>
                  <Link href={`/allocation/${alloc.id}/edit`}>
                    <Button size="sm" variant="outline" className="mr-2">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(alloc.id)}
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
