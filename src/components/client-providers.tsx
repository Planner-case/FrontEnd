"use client";

import { useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "./ui/button";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>

        <header className="flex justify-between items-center p-4 border-b">
          <nav className="flex gap-4">
            <Link href="/simulations">
              <Button variant="outline">Simulações</Button>
            </Link>
            <Link href="/allocation">
              <Button variant="outline">Alocações</Button>
            </Link>
            <Link href="/insurance">
              <Button variant="outline">Seguros</Button>
            </Link>
            <Link href="/movement">
              <Button variant="outline">Movimentações</Button>
            </Link>
            <Link href="/projection">
              <Button variant="outline">Projeção</Button>
            </Link>
          </nav>
          <ThemeToggle />
        </header>


        <main className="p-6">{children}</main>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
