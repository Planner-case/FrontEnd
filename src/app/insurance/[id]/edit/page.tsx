'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insuranceSchema, InsuranceFormData } from '../../new/schema';
import { api } from '../../../../lib/api/api';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Resolver } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

async function fetchInsurance(id: string): Promise<InsuranceFormData> {
  const res = await api.get(`/insurances/${id}`);
  res.data.startDate = res.data.startDate ? new Date(res.data.startDate).toISOString().split('T')[0] : '';
  return res.data;
}

export default function EditInsurancePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: insuranceData, isLoading } = useQuery({
    queryKey: ['insurance', params.id],
    queryFn: () => fetchInsurance(params.id),
    enabled: !!params.id,
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
      simulationId: 1,
    }
  });

  useEffect(() => {
    if (insuranceData) {
      form.reset(insuranceData);
    }
  }, [insuranceData, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsuranceFormData) => {
      const res = await api.patch(`/insurances/${params.id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['insurances'] });
      queryClient.invalidateQueries({ queryKey: ['insurance', params.id] });
      router.push('/insurance');
    },
  });

  const onSubmit = (data: InsuranceFormData) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Editar Seguro</h1>

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
                  <FormLabel>ID da Simulação</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
