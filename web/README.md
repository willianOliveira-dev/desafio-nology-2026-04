<div align="center">
  <img src="public/logo_presentation.svg" alt="Nology Cashback" width="200"/>
  <h1>Nology Cashback - Frontend</h1>
  <p>SPA React servida pela API FastAPI</p>
  
  ![React](https://img.shields.io/badge/react-19.2.4-61DAFB?style=flat-square&logo=react)
  ![TypeScript](https://img.shields.io/badge/typescript-6.0.2-3178C6?style=flat-square&logo=typescript)
  ![Vite](https://img.shields.io/badge/vite-8.0.4-646CFF?style=flat-square&logo=vite)
  ![TanStack Query](https://img.shields.io/badge/tanstack_query-5.99.0-FF4154?style=flat-square&logo=reactquery)
  ![shadcn/ui](https://img.shields.io/badge/shadcn/ui-4.2.0-000000?style=flat-square)
</div>

---

## Sobre o Frontend

O frontend do Nology Cashback é uma Single Page Application (SPA) construída com React 19 e TypeScript. A aplicação é servida diretamente pela API FastAPI através do mecanismo de StaticFiles, eliminando a necessidade de hospedagem separada e simplificando o processo de deploy.

A interface permite que usuários calculem cashback baseado em regras de negócio específicas e visualizem o histórico de consultas realizadas.

---

## Integração com a API

Uma das principais características arquiteturais deste projeto é que o frontend é servido pela mesma origem (same origin) da API. Isso traz diversos benefícios:

**Same Origin Serving:**

- O frontend é buildado e copiado para o diretório `api/src/web/dist/`
- A API FastAPI serve esses arquivos estáticos através do endpoint raiz
- Frontend e API compartilham a mesma URL base (ex: `http://localhost:8000`)

**Benefícios:**

- **Sem variáveis de ambiente para URL da API**: Não é necessário configurar `VITE_API_URL` ou similar, pois as requisições usam paths relativos
- **Sem problemas de CORS**: Como frontend e backend estão na mesma origem, não há necessidade de configuração CORS
- **Deploy simplificado**: Um único container Docker serve tanto a API quanto o frontend
- **Desenvolvimento mais simples**: Menos configuração e menos pontos de falha

**Requisições HTTP:**

Todas as requisições para a API usam paths relativos:

```typescript
// Exemplo de requisição no código
axios.post('/api/v1/cashback/calculate', data);
axios.get('/api/v1/cashback/history');
```

Não é necessário prefixar com URL completa, pois o frontend está sendo servido pela mesma origem.

---

## Estrutura do Projeto

```
web/
├── src/
│   ├── api/
│   │   ├── generated/       # Cliente API auto-gerado pelo Orval
│   │   │   ├── cashback/    # Endpoints de cashback
│   │   │   ├── health/      # Endpoint de health check
│   │   │   └── model/       # Tipos TypeScript dos schemas
│   │   └── interceptor.ts   # Interceptor Axios (adiciona IP do cliente)
│   ├── modules/
│   │   └── cashback/        # Feature module de cashback
│   │       ├── components/  # Componentes específicos da feature
│   │       │   ├── cashback-form.tsx
│   │       │   ├── cashback-result.tsx
│   │       │   ├── cashback-toast.tsx
│   │       │   └── history-table.tsx
│   │       ├── pages/       # Páginas da feature
│   │       │   └── cashback-page.tsx
│   │       └── index.ts     # Exports públicos do módulo
│   ├── components/
│   │   └── ui/              # Componentes shadcn/ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       └── ...
│   ├── providers/           # React Context Providers
│   │   ├── app-provider.tsx
│   │   └── theme-provider.tsx
│   ├── lib/                 # Utilitários e configurações
│   │   ├── query-client.ts  # Configuração TanStack Query
│   │   └── utils.ts         # Funções auxiliares
│   ├── utils/               # Funções helper
│   │   └── masks.ts         # Máscaras de formatação (moeda, porcentagem)
│   ├── App.tsx              # Componente raiz da aplicação
│   └── main.tsx             # Entry point da aplicação
├── public/                  # Assets estáticos
│   ├── logo_presentation.svg
│   └── favicon.svg
├── package.json             # Dependências e scripts
├── vite.config.ts           # Configuração do Vite
├── tsconfig.json            # Configuração TypeScript
├── orval.config.ts          # Configuração do Orval (geração de cliente API)
└── README.md
```

**Organização por Features:**

O projeto segue uma arquitetura modular baseada em features. Cada feature (como `cashback`) contém seus próprios componentes, páginas e lógica de negócio, facilitando a manutenção e escalabilidade.

---

## Build Isolado

Para fazer build do frontend isoladamente (sem Docker):

```bash
cd web

# Instalar dependências
npm install

# Build para produção
npm run build

# Output gerado em: web/dist/
```

O comando `npm run build` executa:

1. Compilação TypeScript (`tsc -b`)
2. Build otimizado do Vite (minificação, tree-shaking, code splitting)

O diretório `dist/` contém os arquivos estáticos prontos para serem servidos por qualquer servidor web.

---

## Build Automatizado (Dockerfile)

O projeto utiliza um Dockerfile multi-stage que automatiza o build do frontend e integra com o backend:

**Stage 1: Frontend Builder**

```dockerfile
FROM node:20-alpine AS frontend-builder

WORKDIR /app/web
COPY web/package*.json ./
RUN npm install
COPY web/ .
RUN npm run build
```

- Base image: `node:20-alpine` (leve e otimizada)
- Instala dependências do frontend
- Executa `npm run build`
- Gera `dist/` com arquivos otimizados

**Stage 2: Backend**

```dockerfile
FROM python:3.14-rc-slim

WORKDIR /app
# ... instalação de dependências Python ...

# Copia frontend buildado do Stage 1
COPY --from=frontend-builder /app/web/dist ./src/web/dist
```

- Base image: `python:3.14-rc-slim`
- Copia o build do frontend do Stage 1 para `src/web/dist/`
- A API FastAPI serve esses arquivos via StaticFiles

**Benefícios do Multi-Stage Build:**

- **Build automatizado**: Um único comando (`docker-compose up --build`) faz build de frontend e backend
- **Imagem otimizada**: A imagem final não inclui `node_modules` ou ferramentas de build do Node.js
- **Sincronização garantida**: Frontend e backend sempre estão sincronizados na mesma imagem
- **Processo reproduzível**: O mesmo Dockerfile funciona em desenvolvimento e produção

---

## Tecnologias Utilizadas

**Core:**

- **React 19.2.4**: Biblioteca para construção de interfaces de usuário
- **TypeScript 6.0.2**: Superset do JavaScript com tipagem estática
- **Vite 8.0.4**: Build tool e dev server extremamente rápido

**State Management:**

- **TanStack Query 5.99.0**: Gerenciamento de estado do servidor (cache, refetch, mutations)

**UI e Styling:**

- **shadcn/ui 4.2.0**: Biblioteca de componentes acessíveis e customizáveis
- **Tailwind CSS 4.2.2**: Framework CSS utility-first
- **Lucide React**: Ícones SVG

**Formulários e Validação:**

- **React Hook Form 7.72.1**: Gerenciamento de formulários performático
- **Zod 4.3.6**: Schema validation com inferência de tipos TypeScript

**HTTP Client:**

- **Axios 1.15.0**: Cliente HTTP com interceptors e tratamento de erros

**Geração de Código:**

- **Orval**: Gera cliente TypeScript a partir do OpenAPI schema da API

**Outras:**

- **next-themes**: Suporte a tema claro/escuro
- **sonner**: Toast notifications elegantes
- **class-variance-authority**: Gerenciamento de variantes de componentes

---

## Links Relacionados

- [Documentação Geral do Projeto](../README.md)
- [Documentação da API](../api/README.md)

---
