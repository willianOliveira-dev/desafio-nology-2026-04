from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from core.db.database import create_db_and_tables
from modules.cashback import cashback_router
from modules.health import health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(
    title="Nology Cashback API",
    description="API para cálculo de cashback com histórico por IP",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(cashback_router)

try:
    app.mount("/", StaticFiles(directory="src/web/dist", html=True), name="static")
except RuntimeError:
    pass
