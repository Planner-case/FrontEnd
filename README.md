# Planner Case - Front-End

Este é o front-end do projeto Planner Case, construído com [Next.js](https://nextjs.org/) e [Tailwind CSS](https://tailwindcss.com/).

## Sumário

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração do Ambiente](#configuração-do-ambiente)
- [Executando o Projeto](#executando-o-projeto)
  - [Com Docker Compose (Recomendado)](#com-docker-compose-recomendado)
  - [Manualmente](#manualmente)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Build com Docker](#build-com-docker)
- [Nota sobre o Ambiente de Desenvolvimento](#nota-sobre-o-ambiente-de-desenvolvimento)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 ou superior)
- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)

## Instalação

Clone o repositório e instale as dependências com `npm`:

```bash
npm install
```

## Configuração do Ambiente

O projeto requer uma variável de ambiente para se conectar ao back-end. Crie um arquivo chamado `.env.local` na raiz do diretório `frontend` e adicione o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

Este valor aponta para o serviço de back-end que, por padrão, roda na porta 4000.

## Executando o Projeto

### Com Docker Compose (Recomendado)

A forma mais simples de executar o ambiente completo (frontend, backend e banco de dados) é utilizando o Docker Compose a partir da raiz do monorepo.

1.  Certifique-se de que o Docker está em execução.
2.  Na raiz do projeto (`planner-case`), execute:

```bash
docker-compose up --build
```

O frontend estará disponível em [http://localhost:3000](http://localhost:3000). O serviço está configurado para hot-reload, então qualquer alteração no código será refletida automaticamente.

### Manualmente

Para executar o frontend de forma isolada (assumindo que o back-end já está rodando), use o seguinte comando:

```bash
npm run dev
```

O projeto iniciará em modo de desenvolvimento com Turbopack e estará disponível em [http://localhost:3000](http://localhost:3000).

## Scripts Disponíveis

-   `npm run dev`: Inicia o servidor de desenvolvimento com Next.js e Turbopack.
-   `npm run build`: Compila o projeto para produção.
-   `npm run start`: Inicia um servidor de produção após a compilação (`build`).
-   `npm run lint`: Executa o linter (ESLint) para análise estática do código.

## Build com Docker

O `Dockerfile` presente no diretório `frontend` foi projetado para o ambiente de desenvolvimento com `docker-compose`. Para gerar uma imagem Docker otimizada para **produção**, seria necessário um `Dockerfile` multi-stage.

No entanto, para buildar a imagem conforme o `Dockerfile` atual, você pode usar o comando `docker build`.

1.  Navegue até o diretório `frontend`.
2.  Execute o comando de build:

```bash
# Exemplo de build
docker build -t planner-frontend:latest .
```

Para executar um contêiner com esta imagem, lembre-se de mapear a porta e fornecer a variável de ambiente:

```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_URL="http://localhost:4000" planner-frontend:latest
```

**Nota:** Como o `Dockerfile` atual executa `npm run dev`, esta não é uma imagem adequada para produção.

## Nota sobre o Ambiente de Desenvolvimento

Para uma experiência de desenvolvimento correta e livre de erros no VS Code, é essencial instalar a extensão **[PostCSS Language Support](https://marketplace.visualstudio.com/items?itemName=csstools.postcss)**.

O Tailwind CSS utiliza diretivas (`@tailwind`) que podem ser marcadas incorretamente como erros pelo editor sem esta extensão.
