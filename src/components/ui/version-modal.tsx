"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as z from "zod";

import { createSimulationVersion } from "../../lib/api/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  rate: z.number().min(0).max(1),
});

type FormData = z.infer<typeof schema>;

export function VersionModal({ simulationId }: { simulationId: number }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      rate: 0.04,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => createSimulationVersion(simulationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["versions", simulationId] });
      setOpen(false);
    },
  });

  function onSubmit(values: FormData) {
    mutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Criar nova versão</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Versão</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Nome</Label>
            <Input {...form.register("name")} />
          </div>
          <div>
            <Label>Taxa</Label>
            <Input
              type="number"
              step="0.01"
              {...form.register("rate", { valueAsNumber: true })}
            />
          </div>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
