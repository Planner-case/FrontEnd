import { z } from "zod";

export const simulationSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  startDate: z.string().nonempty("Data de início é obrigatória"),
  rate: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "number") return val;
      const normalized = val.replace(",", ".");
      const num = Number(normalized);
      if (Number.isNaN(num)) throw new Error("Taxa deve ser um número válido");
      return num;
    })
    .refine((n) => n >= 0, { message: "Taxa deve ser positiva" }),
  status: z.enum(["VIVO", "MORTO", "INVALIDO"]),
});

export type SimulationFormData = z.infer<typeof simulationSchema>;
