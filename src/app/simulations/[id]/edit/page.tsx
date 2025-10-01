'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { simulationSchema, SimulationFormData } from '../../new/schema';
import { api } from '../../../../lib/api/api';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Resolver } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

async function fetchSimulation(id: string): Promise<SimulationFormData> {
  const res = await api.get(`/simulations/${id}`);
  res.data.startDate = res.data.startDate ? new Date(res.data.startDate).toISOString().split('T')[0] : '';
  return res.data;
}

export default function EditSimulationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: simulationData, isLoading } = useQuery({
    queryKey: ['simulation', params.id],
    queryFn: () => fetchSimulation(params.id),
    enabled: !!params.id,
  });

  const resolver = zodResolver(simulationSchema) as unknown as Resolver<SimulationFormData>;

  const form = useForm<SimulationFormData>({
    resolver,
    defaultValues: {
      name: '',
      startDate: '',
      rate: 0,
      status: 'VIVO',
    }
  });

  useEffect(() => {
    if (simulationData) {
      form.reset(simulationData);
    }
  }, [simulationData, form]);

  const mutation = useMutation({
    mutationFn: async (data: SimulationFormData) => {
      const res = await api.patch(`/simulations/${params.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      queryClient.invalidateQueries({ queryKey: ['simulation', params.id] });
      router.push('/simulations');
    },
  });

  const onSubmit = (data: SimulationFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Editar Simulação</h1>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome da simulação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Início</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taxa (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIVO">Vivo</SelectItem>
                        <SelectItem value="MORTO">Morto</SelectItem>
                        <SelectItem value="INVALIDO">Inválido</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
