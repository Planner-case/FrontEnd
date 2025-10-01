'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const chartData = [
  { name: 'Jan', projection: 4000, reality: 2400 },
  { name: 'Fev', projection: 3000, reality: 1398 },
  { name: 'Mar', projection: 2000, reality: 9800 },
  { name: 'Abr', projection: 2780, reality: 3908 },
  { name: 'Mai', projection: 1890, reality: 4800 },
  { name: 'Jun', projection: 2390, reality: 3800 },
  { name: 'Jul', projection: 3490, reality: 4300 },
];

function OverviewChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="projection" fill="#8884d8" />
        <Bar dataKey="reality" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function Home() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Sua visão geral de finanças e investimentos.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Simulações</CardTitle>
            <CardDescription>Crie e gerencie suas simulações financeiras.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Visualize diferentes cenários para o seu futuro financeiro.</p>
          </CardContent>
          <CardFooter>
            <Link href="/simulations">
              <Button>Acessar Simulações</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projeção Patrimonial</CardTitle>
            <CardDescription>Acompanhe a evolução do seu patrimônio.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Gráficos e dados sobre o crescimento dos seus ativos.</p>
          </CardContent>
          <CardFooter>
            <Link href="/projection">
              <Button>Ver Projeção</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alocações</CardTitle>
            <CardDescription>Gerencie seus bens e investimentos.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Controle de ativos financeiros e imobilizados.</p>
          </CardContent>
          <CardFooter>
            <Link href="/allocation">
              <Button>Ver Alocações</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seguros</CardTitle>
            <CardDescription>Administre suas apólices de seguro.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Mantenha seus seguros de vida e patrimoniais organizados.</p>
          </CardContent>
          <CardFooter>
            <Link href="/insurance">
              <Button>Ver Seguros</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movimentações</CardTitle>
            <CardDescription>Controle suas receitas e despesas.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Registre todas as entradas e saídas para um controle preciso.</p>
          </CardContent>
          <CardFooter>
            <Link href="/movement">
              <Button>Ver Movimentações</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Card className="col-span-1 lg:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Visão Geral da Projeção</CardTitle>
          <CardDescription>Projeção vs. Realidade (Exemplo)</CardDescription>
        </CardHeader>
        <CardContent>
          <OverviewChart />
        </CardContent>
      </Card>

    </div>
  );
}