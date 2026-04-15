import uuid
from datetime import datetime
from enum import StrEnum

from sqlalchemy import DateTime, Integer, String, text
from sqlalchemy.dialects.postgresql import UUID
from sqlmodel import Column, Field, SQLModel


class ClientType(StrEnum):
    """Enum para tipos de clientes permitidos no sistema."""

    REGULAR = "regular"
    VIP = "vip"


class Cashback(SQLModel, table=True):
    """
    Modelo para armazenar o histórico de consultas por IP.
    OBS: Valores em centavos ( inteiros ) para precisão financeira.
    """

    __tablename__ = "cashback"

    id: uuid.UUID = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("gen_random_uuid()"),
        ),
    )

    ip_address: str = Field(sa_column=Column(String(255), nullable=False, index=True))

    client_type: ClientType = Field(sa_column=Column(String(15), nullable=False))

    purchase_value_cents: int = Field(sa_column=Column(Integer, nullable=False))

    discount_percent: int = Field(default=0, sa_column=Column(Integer, nullable=False))

    cashback_amount_cents: int = Field(sa_column=Column(Integer, nullable=False))

    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True), nullable=False, server_default=text("now()")
        )
    )
