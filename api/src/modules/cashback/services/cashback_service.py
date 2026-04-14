class CashbackService:
    """
    Serviço responsável pela regra de negócio de cálculo de cashback
    e formatação de valores monetários.
    """
    
    BASE_RATE_PERCENT = 5
    VIP_BONUS_RATE_PERCENT = 10
    HIGH_VALUE_THRESHOLD_CENTS = 50000 

    def calculate(
        self,
        client_type: str,
        purchase_value_cents: int,
        discount_percent: int,
    ) -> dict:
        """
        1. Aplica desconto no valor da compra.
        2. Calcula 5% sobre o valor final (Cashback Base).
        3. Se valor final >= R$ 500,00, dobra o cashback base (promoção).
        4. Se VIP, adiciona 10% de bônus sobre o cashback (já dobrado ou não).
        """
        
        discount_amount = (purchase_value_cents * discount_percent) // 100
        
        final_value_cents = purchase_value_cents - discount_amount

        cashback_cents = (final_value_cents * self.BASE_RATE_PERCENT) // 100

        if final_value_cents >= self.HIGH_VALUE_THRESHOLD_CENTS:
            cashback_cents *= 2

        if client_type.strip().lower() == "vip":
            bonus_cents = (cashback_cents * self.VIP_BONUS_RATE_PERCENT) // 100
            cashback_cents += bonus_cents

        return {
            "purchase_value_cents": purchase_value_cents,
            "discount_percent": discount_percent,
            "final_value_cents": final_value_cents,
            "cashback_amount_cents": cashback_cents,
            "purchase_value_formatted": self._format_cents(purchase_value_cents),
            "final_value_formatted": self._format_cents(final_value_cents),
            "cashback_formatted": self._format_cents(cashback_cents),
        }

    @staticmethod
    def _format_cents(cents: int) -> str:
        """
        Converte centavos para string formatada. Ex: R$ 100,00
        """
        
        sinal = "-" if cents < 0 else ""
        abs_cents = abs(cents)
        reais = abs_cents // 100
        centavos = abs_cents % 100
        
        reais_fmt = f"{reais:,}".replace(",", ".")
        return f"{sinal}R$ {reais_fmt},{centavos:02d}"