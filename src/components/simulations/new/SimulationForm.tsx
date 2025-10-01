"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";
import { simulationSchema, SimulationFormData } from "../../../app/simulations/new/schema";

export function SimulationForm() {
  const resolver = zodResolver(simulationSchema) as unknown as Resolver<SimulationFormData>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SimulationFormData>({
    resolver,
    defaultValues: {
      name: "",
      startDate: "",
      rate: 0.04,
      status: "VIVO",
    },
  });

  const onSubmit = (data: SimulationFormData) => {
    console.log("Simulação criada:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-auto bg-white p-6 rounded-2xl shadow-sm space-y-6"
    >

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
          Nome
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className={`mt-1 block w-full rounded-lg border ${
            errors.name ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
          placeholder="Ex: Projeção 2025"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="startDate" className="block text-sm font-medium text-gray-900">
          Data de início
        </label>
        <input
          id="startDate"
          type="date"
          {...register("startDate")}
          className={`mt-1 block w-full rounded-lg border ${
            errors.startDate ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        />
        {errors.startDate && (
          <p className="mt-1 text-xs text-red-600">{errors.startDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rate" className="block text-sm font-medium text-gray-900">
          Taxa (%)
        </label>
        <input
          id="rate"
          type="text"
          {...register("rate")}
          className={`mt-1 block w-full rounded-lg border ${
            errors.rate ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
          placeholder="Ex: 0,04"
        />
        {errors.rate && (
          <p className="mt-1 text-xs text-red-600">{errors.rate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-900">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className={`mt-1 block w-full rounded-lg border ${
            errors.status ? "border-red-500" : "border-gray-300"
          } px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200`}
        >
          <option value="VIVO">VIVO</option>
          <option value="MORTO">MORTO</option>
          <option value="INVALIDO">INVALIDO</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Salvando..." : "Criar Simulação"}
        </button>
      </div>
    </form>
  );
}
