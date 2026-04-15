from typing import List
from sqlmodel import Session, select, func, desc, asc

from core.db.models.cashback import Cashback


class CashbackRepository:
    """
    Repositório para operações de banco relacionadas ao Cashback.
    """
    
    def __init__(self, db_session: Session) -> None:
        self.db = db_session
    
    def create(self, cashback: Cashback) -> Cashback:
        """Cria um novo registro de cashback."""
        self.db.add(cashback)
        self.db.commit()
        self.db.refresh(cashback)
        return cashback
    
    def get_history_by_ip(
        self, 
        ip_address: str, 
        limit: int = 20, 
        skip: int = 0,
        sort_order: str = "desc"
    ) -> List[Cashback]:
        """
        Busca histórico de consultas por IP com paginação e ordenação.
        
        Args:
            ip_address: IP do usuário
            limit: Quantidade de itens por página
            skip: Quantidade de itens a pular
            sort_order: 'desc' para mais recente primeiro, 'asc' para mais antigo primeiro
        """
        order_func = desc if sort_order == "desc" else asc
        
        query = (
            select(Cashback)
            .where(Cashback.ip_address == ip_address)
            .order_by(order_func(Cashback.created_at))
            .limit(limit)
            .offset(skip)
        )
        return self.db.exec(query).all()
    
    def count_by_ip(self, ip_address: str) -> int:
        """Conta o número total de consultas por IP."""
        query = select(func.count()).select_from(Cashback).where(Cashback.ip_address == ip_address)
        return self.db.exec(query).one()
