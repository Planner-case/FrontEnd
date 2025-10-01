import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export async function createSimulationVersion(id: number, payload?: { name: string; rate: number; status?: string }) {
  const res = await api.post(`/simulations/${id}/version`, payload);
  return res.data;
}
export async function getSimulationVersions(id: number) {
  const res = await api.get(`/simulations/${id}/versions`);
  return res.data;
}