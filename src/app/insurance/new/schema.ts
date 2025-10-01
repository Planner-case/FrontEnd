import { z } from "zod";

export const insuranceSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  startDate: z.string().nonempty("Data de início é obrigatória"),
  duration: z.coerce.number().int().positive("Duração deve ser um número inteiro positivo"),
  premium: z.coerce.number().positive("Prêmio deve ser um número positivo"),
  insuredValue: z.coerce.number().positive("Valor segurado deve ser um número positivo"),
  simulationId: z.coerce.number().int().positive("ID da simulação é obrigatório"),
});

export type InsuranceFormData = z.infer<typeof insuranceSchema>;
