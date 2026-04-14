from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict


class CashbackRequest(BaseModel):
    """Dados de entrada para cálculo"""
    client_type: str = Field(..., description="'regular' ou 'vip'")
    purchase_value_cents: int = Field(..., gt=0, description="Valor em centavos")
    discount_percent: int = Field(0, ge=0, le=100, description="Desconto de 0 a 100%")


class CashbackResponse(BaseModel):
    """Resposta da API com dados originais e formatados"""
    model_config = ConfigDict(from_attributes=True)
    purchase_value_cents: int
    discount_percent: int
    cashback_amount_cents: int
    purchase_value_formatted: str
    final_value_formatted: str
    cashback_formatted: str


class HistoryItem(BaseModel):
    """Item do histórico retornado pela API"""
    model_config = ConfigDict(from_attributes=True)
    
    client_type: str
    purchase_value_cents: int
    cashback_amount_cents: int
    created_at: datetime
    purchase_value_formatted: str
    cashback_formatted: str