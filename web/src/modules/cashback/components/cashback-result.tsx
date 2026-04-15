import type { CashbackResponse } from '@/api/generated/model';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface CashbackResultProps {
    data: CashbackResponse;
}

export function CashbackResult({ data }: CashbackResultProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Cashback Calculado!</h3>
                    <p className="text-sm text-muted-foreground">
                        Confira os detalhes abaixo
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                            Tipo de Cliente
                        </p>
                        <p className="text-base font-medium capitalize">
                            {data.client_type}
                        </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground mb-1">
                            Desconto
                        </p>
                        <p className="text-base font-medium">
                            {data.discount_percent}%
                        </p>
                    </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                        Valor Original
                    </p>
                    <p className="text-lg font-medium">{data.purchase_value}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">
                        Valor Final
                    </p>
                    <p className="text-lg font-medium">{data.final_value}</p>
                </div>

                <div className="p-6 rounded-xl bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">
                            Seu Cashback
                        </p>
                    </div>
                    <p className="text-4xl font-bold text-primary">
                        {data.cashback_amount}
                    </p>
                </div>
            </div>
        </div>
    );
}
