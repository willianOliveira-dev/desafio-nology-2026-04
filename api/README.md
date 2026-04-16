<div align="center">
  <img src="../web/public/logo_presentation.svg" alt="Nology Cashback" width="200"/>
  <h1>Nology Cashback - API</h1>
  <p>Backend FastAPI que processa cashback, persiste dados e serve o frontend</p>
  
  ![Python](https://img.shields.io/badge/python-3.14-blue?style=flat-square&logo=python)
  ![FastAPI](https://img.shields.io/badge/fastapi-0.135-009688?style=flat-square&logo=fastapi)
  ![SQLModel](https://img.shields.io/badge/sqlmodel-0.0.38-red?style=flat-square)
  ![PostgreSQL](https://img.shields.io/badge/postgresql-16-336791?style=flat-square&logo=postgresql)
  ![uv](https://img.shields.io/badge/uv-latest-purple?style=flat-square)
</div>

---

## Sobre a API

A API é a camada central do sistema de Cashback, responsável por:

- Processar cálculos de cashback baseados em regras de negócio
- Persistir dados de consultas no PostgreSQL
- Servir o frontend React como arquivos estáticos

A API foi desenvolvida com FastAPI, oferecendo documentação interativa automática via Swagger UI e alta performance para operações de I/O.

---

## Decisões Arquiteturais

### Static Files Serving

A API serve o frontend React buildado através do módulo `StaticFiles` do FastAPI. Esta decisão arquitetural traz diversos benefícios:

- **URL única**: Frontend e backend compartilham a mesma origem, simplificando o deploy
- **Sem CORS**: Não há necessidade de configurar CORS para requisições cross-domain
- **Deploy simplificado**: Um único container Docker serve toda a aplicação

O frontend buildado é copiado para `src/web/dist/` durante o processo de build do Docker e montado na rota raiz (`/`) da aplicação.

### Gerenciamento do Banco de Dados

O projeto utiliza **SQLModel** como ORM, combinando a simplicidade do SQLAlchemy com validação de tipos do Pydantic. As tabelas são criadas automaticamente na inicialização da aplicação através da função `create_db_and_tables()`.

A aplicação é compatível com **Supabase PostgreSQL**, permitindo deploy em produção sem necessidade de migrações manuais para o setup inicial.

### Gerenciamento de Dependências

O projeto utiliza **uv** como gerenciador de dependências Python, oferecendo:

- Instalação extremamente rápida de pacotes
- Lockfile para builds reproduzíveis
- Compatibilidade total com pyproject.toml

---

## Regras de Negócio

O cálculo de cashback segue uma sequência específica de regras aplicadas em ordem:

### Ordem de Aplicação

1. **Aplicar desconto** no valor da compra
2. **Calcular cashback base** de 5% sobre o valor final
3. **Dobrar o cashback** se o valor final for >= R$ 500,00
4. **Adicionar bônus VIP** de 10% sobre o cashback (já dobrado, se aplicável)

### Exemplos Numéricos

#### Exemplo 1: Cliente Regular, R$ 400,00, 10% de desconto

- Valor da compra: R$ 400,00
- Desconto (10%): R$ 40,00
- Valor final: R$ 360,00
- Cashback base (5%): R$ 18,00
- Valor final < R$ 500,00: cashback não é dobrado
- Cliente não é VIP: sem bônus adicional
- **Cashback final: R$ 18,00**

#### Exemplo 2: Cliente Regular, R$ 600,00, 10% de desconto

- Valor da compra: R$ 600,00
- Desconto (10%): R$ 60,00
- Valor final: R$ 540,00
- Cashback base (5%): R$ 27,00
- Valor final >= R$ 500,00: cashback é dobrado para R$ 54,00
- Cliente não é VIP: sem bônus adicional
- **Cashback final: R$ 54,00**

#### Exemplo 3: Cliente VIP, R$ 400,00, 10% de desconto

- Valor da compra: R$ 400,00
- Desconto (10%): R$ 40,00
- Valor final: R$ 360,00
- Cashback base (5%): R$ 18,00
- Valor final < R$ 500,00: cashback não é dobrado
- Cliente é VIP: bônus de 10% sobre R$ 18,00 = R$ 1,80
- **Cashback final: R$ 19,80**

#### Exemplo 4: Cliente VIP, R$ 600,00, 10% de desconto

- Valor da compra: R$ 600,00
- Desconto (10%): R$ 60,00
- Valor final: R$ 540,00
- Cashback base (5%): R$ 27,00
- Valor final >= R$ 500,00: cashback é dobrado para R$ 54,00
- Cliente é VIP: bônus de 10% sobre R$ 54,00 = R$ 5,40
- **Cashback final: R$ 59,40**

---

## Endpoints da API

| Método | Rota                         | Descrição                         | Resposta                                                           |
| ------ | ---------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| GET    | `/health`                    | Health check da API               | `{"status": "ok", "message": "API está funcionando corretamente"}` |
| POST   | `/api/v1/cashback/calculate` | Calcula cashback e salva no banco | `CashbackResponse`                                                 |
| GET    | `/api/v1/cashback/history`   | Retorna histórico paginado por IP | `PaginatedResponse[HistoryItem]`                                   |

### POST /api/v1/cashback/calculate

Calcula o cashback baseado no tipo de cliente, valor da compra e desconto. Registra a consulta no histórico do IP.

**Request Body:**

```json
{
    "client_type": "regular",
    "purchase_value": 500.0,
    "discount_percent": 10
}
```

**Response (201 Created):**

```json
{
    "client_type": "regular",
    "purchase_value": "R$ 500,00",
    "discount_percent": 10,
    "final_value": "R$ 450,00",
    "cashback_amount": "R$ 22,50"
}
```

### GET /api/v1/cashback/history

Retorna o histórico de consultas de cashback do IP atual com paginação e ordenação.

**Query Parameters:**

- `page` (int, default: 1, min: 1): Número da página
- `page_size` (int, default: 20, min: 1, max: 100): Itens por página
- `sort_order` ("asc" | "desc", default: "desc"): Ordem de classificação por data

**Response (200 OK):**

```json
{
    "items": [
        {
            "client_type": "regular",
            "purchase_value": "R$ 500,00",
            "discount_percent": 10,
            "cashback_amount": "R$ 22,50",
            "created_at": "2024-01-15T10:30:00"
        }
    ],
    "metadata": {
        "page": 1,
        "page_size": 20,
        "total_items": 50,
        "total_pages": 3,
        "has_next": true,
        "has_previous": false,
        "sort_order": "desc"
    }
}
```

---

## Estrutura do Projeto

```
api/
├── src/
│   ├── core/                    # Configurações e infraestrutura
│   │   ├── config/              # Variáveis de ambiente (env.py)
│   │   └── db/                  # Setup do banco e models
│   │       ├── database.py      # Conexão e criação de tabelas
│   │       └── models/
│   │           └── cashback.py  # Model SQLModel de cashback
│   ├── modules/                 # Módulos de funcionalidades
│   │   ├── cashback/            # Módulo de cashback
│   │   │   ├── controllers/     # Request handlers (FastAPI)
│   │   │   ├── services/        # Lógica de negócio
│   │   │   ├── repositories/    # Acesso a dados (queries)
│   │   │   ├── routes/          # Definição de rotas
│   │   │   └── schemas/         # Schemas Pydantic
│   │   └── health/              # Módulo de health check
│   │       └── routes/          # Rota de health
│   ├── web/
│   │   └── dist/                # Frontend buildado (servido pela API)
│   └── main.py                  # Entry point da aplicação
├── Dockerfile                   # Multi-stage build (frontend + backend)
├── pyproject.toml               # Dependências e configuração do projeto
└── README.md                    # Este arquivo
```

---

## Variáveis de Ambiente

| Variável          | Descrição                                     | Valor Padrão                                           | Obrigatório |
| ----------------- | --------------------------------------------- | ------------------------------------------------------ | ----------- |
| POSTGRES_USER     | Nome de usuário do PostgreSQL                 | postgres                                               | Sim         |
| POSTGRES_PASSWORD | Senha do PostgreSQL                           | postgres                                               | Sim         |
| POSTGRES_DB       | Nome do banco de dados                        | nology_db                                              | Sim         |
| DB_PORT           | Porta do PostgreSQL                           | 5432                                                   | Não         |
| DATABASE_URL      | URL completa de conexão com o banco de dados  | postgresql://postgres:postgres@db:5432/nology_cashback | Sim         |
| PYTHON_ENV        | Ambiente de execução (development/production) | development                                            | Não         |
| DEBUG             | Ativa modo de debug                           | true                                                   | Não         |
| API_PORT          | Porta do servidor da API                      | 8000                                                   | Não         |

---

## Documentação Interativa

A API oferece documentação interativa automática via Swagger UI:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

Através dessas interfaces, é possível testar todos os endpoints diretamente no navegador.

---

## Links Relacionados

- [Documentação Geral do Projeto](../README.md)
- [Documentação do Frontend](../web/README.md)

---
