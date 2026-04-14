from typing import Generator

from sqlmodel import Session, SQLModel, create_engine

from core.config.env import env

engine = create_engine(
    env.DATABASE_URL,
    echo=env.DEBUG,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)


def create_db_and_tables() -> None:
    """
    Cria todas as tabelas mapeadas pelo SQLModel
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependência do FastAPI para injetar uma sessão de banco.
    """
    with Session(engine) as session:
        yield session

