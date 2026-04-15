from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from core.db.database import create_db_and_tables
from modules.cashback import cashback_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gerencia o ciclo de vida da aplicação.
    Cria as tabelas do banco na inicialização.
    """
    create_db_and_tables()
    yield


app = FastAPI(
    title="Nology Cashback API",
    description="API para cálculo de cashback com histórico por IP",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cashback_router)


@app.get("/api/health")
async def health_check():
    """
    Endpoint de health check para verificar se a API está funcionando.
    """
    return {"status": "ok", "message": "API is running"}


# TODO Monta os arquivos estáticos do frontend na raiz
# TODO Deve ser a última configuração para não sobrescrever as rotas da API
try:
    app.mount("/", StaticFiles(directory="src/web/dist", html=True), name="static")
except RuntimeError:
    # TODO Em desenvolvimento, o diretório pode não existir ainda
    pass
