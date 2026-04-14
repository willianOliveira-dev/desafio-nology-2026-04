from typing import List
from sqlmodel import Session, select
from src.modules.cashback.models.cashback import Cashback 


class CashbackRepository:
    """
    Repositório para operações de banco relacionadas ao Cashback.
    """
    
    def __init__(self, db_session: Session) -> None:
        self.db = db_session
        
    
    def create(self, cashback: Cashback) -> Cashback:
        """
        Cria um novo registro.
        """
       self.db.add(cashback)
       self.db.commit()
       self.db.refresh(cashback)
       return cashback
    
    def get_history_by_ip(self, ip_address: str) -> List[Cashback]:
        """
        Busca todo o histórico de consultas por endereço IP.
       """
       query = select(Casback).where(Cashback.ip_address == ip_address).order_by(Cashback.created_at.desc())
       return self.db.exec(query).all()
   
    def count_by_ip(self, ip_address: str) -> int:
        
        """
        Conta o número de consultas por endereço IP.
        """
        query = select(Cashback).where(Cashback.ip_address == ip_address)
        return len(self.db.exec(query).all())

       
    
    

    