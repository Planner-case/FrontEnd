'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insuranceSchema, InsuranceFormData } from './schema';
import { api, getSimulations } from '../../../lib/api/api';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Resolver } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Simulation {
  id: number;
  name: string;
}

export default function NewInsurancePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: simulations, isLoading: isLoadingSimulations } = useQuery<Simulation[]>({
    queryKey: ['simulations'],
    queryFn: getSimulations,
  });

  const resolver = zodResolver(insuranceSchema) as unknown as Resolver<InsuranceFormData>;

  const form = useForm<InsuranceFormData>({
    resolver,
    defaultValues: {
      name: '',
      startDate: '',
      duration: 0,
      premium: 0,
      insuredValue: 0,
      simulationId: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsuranceFormData) => {
      const res = await api.post('/insurances', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurances'] });
      router.push('/insurance');
    },
  });

  const onSubmit = (data: InsuranceFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Novo Seguro</h1>

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
                    <Input placeholder="Digite o nome do seguro" {...field} />
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
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração (anos)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="premium"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prêmio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuredValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Segurado</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="simulationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Simulação</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(Number(value))} disabled={isLoadingSimulations}>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingSimulations ? "Carregando..." : "Selecione a simulação"} />
                      </SelectTrigger>
                      <SelectContent>
                        {simulations?.map((simulation) => (
                          <SelectItem key={simulation.id} value={String(simulation.id)}>
                            {simulation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
