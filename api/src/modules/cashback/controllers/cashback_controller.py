from sqlmodel import Session

from modules.cashback.services.cashback_service import CashbackService
from modules.cashback.schemas.cashback_schemas import (
    CashbackResponse, 
    PaginatedResponse, 
    HistoryItem,
    SortOrder
)


class CashbackController:
    """
    Controlador responsável por orquestrar a aplicação.
    """
    
    def __init__(self, db_session: Session) -> None:
        self.service = CashbackService(db_session)

    def calculate_and_save(
        self, 
        ip_address: str, 
        client_type: str, 
        purchase_value_reais: float, 
        discount_percent: int
    ) -> CashbackResponse:
        """
        Delega cálculo e persistência para o Service.
        """
        return self.service.calculate_and_save(
            ip_address=ip_address,
            client_type=client_type,
            purchase_value_reais=purchase_value_reais,
            discount_percent=discount_percent
        )

    def get_history(
        self, 
        ip_address: str, 
        page: int = 1, 
        page_size: int = 20,
        sort_order: SortOrder = "desc"
    ) -> PaginatedResponse[HistoryItem]:
        """
        Delega busca paginada e ordenada para o Service.
        """
        return self.service.get_history(
            ip_address=ip_address,
            page=page,
            page_size=page_size,
            sort_order=sort_order
        )
