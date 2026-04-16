from functools import lru_cache

from pydantic_settings import BaseSettings


class Env(BaseSettings):
    """
    Configurações de variáveis de ambiente.
    """

    PYTHON_ENV: str = "development"
    DEBUG: bool = True
    DATABASE_URL: str

    class Config:
        env_file = "../../../.env"
        case_sensitive = True


@lru_cache()
def get_env() -> Env:
    """
    Retorna uma instânica única das configurações das variáveis de ambiente.
    O lru_cache garante que o arquivo .env seja lido apenas uma vez.
    """
    return Env()


env = get_env()
