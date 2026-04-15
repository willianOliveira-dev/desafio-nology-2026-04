from datetime import datetime
from typing import List, Generic, TypeVar, Literal
from pydantic import BaseModel, Field, field_validator


class CashbackRequest(BaseModel):
    """
    Schema de entrada da API.
    Recebe valores em reais (float) e desconto em inteiro.
    O backend converte para centavos internamente.
    """
    client_type: str = Field(
        ..., 
        description="Tipo do cliente: 'regular' ou 'vip'",
        pattern="^(regular|vip)$"
    )
    purchase_value: float = Field(
        ..., 
        gt=0, 
        description="Valor da compra em Reais (ex: 600.50)"
    )
    discount_percent: int = Field(
        default=0, 
        ge=0, 
        le=100, 
        description="Porcentagem de desconto (0 a 100)"
    )

    @field_validator("client_type")
    @classmethod
    def normalize_client_type(cls, v: str) -> str:
        """Normaliza o tipo de cliente para lowercase"""
        return v.strip().lower()


class CashbackResponse(BaseModel):
    """
    Schema de resposta da API.
    Retorna valores formatados em reais para o frontend.
    """
    client_type: str
    purchase_value: str = Field(description="Valor original em reais (ex: R$ 600,00)")
    discount_percent: int
    final_value: str = Field(description="Valor após desconto (ex: R$ 480,00)")
    cashback_amount: str = Field(description="Cashback calculado (ex: R$ 52,80)")


class HistoryItem(BaseModel):
    """
    Item do histórico retornado pela API.
    Valores já formatados em reais.
    """
    client_type: str
    purchase_value: str
    discount_percent: int
    cashback_amount: str
    created_at: datetime


SortOrder = Literal["desc", "asc"]


class PaginationMetadata(BaseModel):
    """
    Metadados de paginação para facilitar navegação no frontend.
    """
    page: int = Field(description="Página atual")
    page_size: int = Field(description="Itens por página")
    total_items: int = Field(description="Total de itens disponíveis")
    total_pages: int = Field(description="Total de páginas")
    has_next: bool = Field(description="Existe próxima página?")
    has_previous: bool = Field(description="Existe página anterior?")
    sort_order: SortOrder = Field(description="Ordenação: 'desc' (mais recente) ou 'asc' (mais antigo)")


T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Resposta paginada genérica com dados e metadados.
    """
    items: List[T] = Field(description="Lista de itens da página atual")
    metadata: PaginationMetadata = Field(description="Metadados de paginação")