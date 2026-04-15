from fastapi import APIRouter, Depends, Query, Request
from sqlmodel import Session
from core.db.database import get_session
from modules.cashback.controllers.cashback_controller import CashbackController
from modules.cashback.schemas.cashback_schemas import (
    CashbackRequest,
    CashbackResponse,
    PaginatedResponse,
    HistoryItem,
    SortOrder
)


router = APIRouter(prefix="/api/v1/cashback", tags=["Cashback"])


def get_client_ip(request: Request) -> str:
    """
    Extrai o IP do cliente da requisição.
    Considera proxies (X-Forwarded-For) e fallback para IP direto.
    """
    forwarded = request.headers.get("X-Forwarded-For")
    
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post(
    "/calculate",
    response_model=CashbackResponse,
    status_code=201,
    summary="Calcula e registra cashback",
    description="Calcula o cashback baseado no tipo de cliente, valor da compra e desconto. Registra a consulta no histórico do IP."
)
def calculate_cashback(
    data: CashbackRequest,
    request: Request,
    session: Session = Depends(get_session)
) -> CashbackResponse:
    """
    Calcula o cashback e salva no histórico.
    """
    controller = CashbackController(session)
    ip_address = get_client_ip(request)
    
    return controller.calculate_and_save(
        ip_address=ip_address,
        client_type=data.client_type,
        purchase_value_reais=data.purchase_value,
        discount_percent=data.discount_percent
    )


@router.get(
    "/history",
    response_model=PaginatedResponse[HistoryItem],
    summary="Histórico de consultas",
    description="Retorna o histórico de consultas de cashback do IP atual com paginação e ordenação."
)
def get_history(
    request: Request,
    page: int = Query(1, ge=1, description="Número da página"),
    page_size: int = Query(20, ge=1, le=100, description="Itens por página (máximo 100)"),
    sort_order: SortOrder = Query("desc", description="Ordenação: 'desc' (mais recente) ou 'asc' (mais antigo)"),
    session: Session = Depends(get_session)
) -> PaginatedResponse[HistoryItem]:
    """
    Busca o histórico de consultas de cashback do IP atual.
    """
    controller = CashbackController(session)
    ip_address = get_client_ip(request)
    
    return controller.get_history(
        ip_address=ip_address,
        page=page,
        page_size=page_size,
        sort_order=sort_order
    )
