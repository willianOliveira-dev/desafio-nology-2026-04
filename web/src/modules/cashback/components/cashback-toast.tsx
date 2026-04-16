import type { CashbackResponse } from '@/api/generated/model';
import { TrendingUp, Star } from 'lucide-react';

interface CashbackToastProps {
    data: CashbackResponse;
}

export function CashbackToast({ data }: CashbackToastProps) {
    const isVip = data.client_type === 'vip';

    return (
        <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-2xl max-w-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-bold">Cashback Calculado!</h3>
                    <p className="text-xs text-muted-foreground">
                        Confira os detalhes
                    </p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="text-sm font-medium capitalize flex items-center gap-1">
                        {data.client_type}
                        {isVip && (
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        )}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        Valor Original
                    </span>
                    <span className="text-sm font-medium">
                        {data.purchase_value}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        Desconto
                    </span>
                    <span className="text-sm font-medium">
                        {data.discount_percent}%
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                        Valor Final
                    </span>
                    <span className="text-sm font-medium">
                        {data.final_value}
                    </span>
                </div>
                <div className="pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-muted-foreground">
                            Seu Cashback
                        </span>
                        <span className="text-2xl font-bold text-primary">
                            {data.cashback_amount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
