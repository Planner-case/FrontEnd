import { z } from "zod";

export const movementSchema = z.object({
  type: z.enum(["ENTRADA", "SAIDA"]),
  value: z.coerce.number().positive("Valor deve ser um número positivo"),
  frequency: z.enum(["UNICA", "MENSAL", "ANUAL"]),
  startDate: z.string().nonempty("Data de início é obrigatória"),
  endDate: z.string().optional(),
  simulationId: z.coerce.number().int().positive("ID da simulação é obrigatório"),
});

export type MovementFormData = z.infer<typeof movementSchema>;
