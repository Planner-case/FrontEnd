import { z } from "zod";

export const allocationSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  type: z.enum(["FINANCEIRA", "IMOBILIZADA"]),
  value: z.coerce.number().positive("Valor deve ser um número positivo"),
  date: z.string().nonempty("Data é obrigatória"),
  hasFinancing: z.boolean().optional(),
  startDate: z.string().optional(),
  installments: z.coerce.number().int().optional(),
  interestRate: z.coerce.number().optional(),
  downPayment: z.coerce.number().optional(),
  simulationId: z.coerce.number().int().positive("ID da simulação é obrigatório"),
});

export type AllocationFormData = z.infer<typeof allocationSchema>;
