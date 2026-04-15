from typing import List
from sqlmodel import Session

from modules.cashback.repositories.cashback_repository import CashbackRepository
from modules.cashback.schemas.cashback_schemas import (
    CashbackResponse, 
    HistoryItem, 
    PaginatedResponse,
    PaginationMetadata,
    SortOrder
)
from core.db.models.cashback import Cashback


class CashbackService:
    """
    Serviço responsável pela regra de negócio de cálculo de cashback
    e formatação de valores monetários.
    """
    
    BASE_RATE_PERCENT = 5
    VIP_BONUS_RATE_PERCENT = 10
    HIGH_VALUE_THRESHOLD_CENTS = 50000

    def __init__(self, db_session: Session) -> None:
        self.repository = CashbackRepository(db_session)

    @staticmethod
    def reais_to_cents(reais: float) -> int:
        """
        Converte reais para centavos.
        """
        return int(round(reais * 100))

    @staticmethod
    def cents_to_reais_formatted(cents: int) -> str:
        """
        Converte centavos para string formatada em reais.
        """
        sinal = "-" if cents < 0 else ""
        abs_cents = abs(cents)
        reais = abs_cents // 100
        centavos = abs_cents % 100
        
        reais_fmt = f"{reais:,}".replace(",", ".")
        return f"{sinal}R$ {reais_fmt},{centavos:02d}"

    def calculate(
        self,
        client_type: str,
        purchase_value_reais: float,
        discount_percent: int,
    ) -> dict:
        """
        Calcula o cashback seguindo as regras de negócio.
        
        1. Aplica desconto no valor da compra.
        2. Calcula 5% sobre o valor final (Cashback Base).
        3. Se valor final >= R$ 500,00, dobra o cashback base (promoção).
        4. Se VIP, adiciona 10% de bônus sobre o cashback (já dobrado ou não).
        """
        purchase_value_cents = self.reais_to_cents(purchase_value_reais)
        
        discount_amount_cents = (purchase_value_cents * discount_percent) // 100
        final_value_cents = purchase_value_cents - discount_amount_cents

        cashback_cents = (final_value_cents * self.BASE_RATE_PERCENT) // 100

        if final_value_cents >= self.HIGH_VALUE_THRESHOLD_CENTS:
            cashback_cents *= 2

        if client_type == "vip":
            bonus_cents = (cashback_cents * self.VIP_BONUS_RATE_PERCENT) // 100
            cashback_cents += bonus_cents

        return {
            "purchase_value_cents": purchase_value_cents,
            "discount_percent": discount_percent,
            "final_value_cents": final_value_cents,
            "cashback_amount_cents": cashback_cents,
            "purchase_value_formatted": self.cents_to_reais_formatted(purchase_value_cents),
            "final_value_formatted": self.cents_to_reais_formatted(final_value_cents),
            "cashback_formatted": self.cents_to_reais_formatted(cashback_cents),
        }

    def calculate_and_save(
        self,
        ip_address: str,
        client_type: str,
        purchase_value_reais: float,
        discount_percent: int,
    ) -> CashbackResponse:
        """
        Calcula o cashback e persiste no banco.
        """
        result = self.calculate(
            client_type=client_type,
            purchase_value_reais=purchase_value_reais,
            discount_percent=discount_percent
        )
        
        record = Cashback(
            ip_address=ip_address,
            client_type=client_type,
            purchase_value_cents=result["purchase_value_cents"],
            discount_percent=discount_percent,
            cashback_amount_cents=result["cashback_amount_cents"]
        )
        
        self.repository.create(record)
        
        return CashbackResponse(
            client_type=client_type,
            purchase_value=result["purchase_value_formatted"],
            discount_percent=discount_percent,
            final_value=result["final_value_formatted"],
            cashback_amount=result["cashback_formatted"],
        )

    def get_history(
        self, 
        ip_address: str, 
        page: int = 1, 
        page_size: int = 20,
        sort_order: SortOrder = "desc"
    ) -> PaginatedResponse[HistoryItem]:
        """
        Busca histórico no banco com paginação e ordenação.
        """
        skip = (page - 1) * page_size
        
        total_items = self.repository.count_by_ip(ip_address)
        
        records = self.repository.get_history_by_ip(
            ip_address=ip_address,
            limit=page_size,
            skip=skip,
            sort_order=sort_order
        )
        
        total_pages = (total_items + page_size - 1) // page_size if total_items > 0 else 0
        
        items = [
            HistoryItem(
                client_type=r.client_type,
                purchase_value=self.cents_to_reais_formatted(r.purchase_value_cents),
                discount_percent=r.discount_percent,
                cashback_amount=self.cents_to_reais_formatted(r.cashback_amount_cents),
                created_at=r.created_at,
            )
            for r in records
        ]
        
        metadata = PaginationMetadata(
            page=page,
            page_size=page_size,
            total_items=total_items,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1,
            sort_order=sort_order
        )
        
        return PaginatedResponse(items=items, metadata=metadata)
