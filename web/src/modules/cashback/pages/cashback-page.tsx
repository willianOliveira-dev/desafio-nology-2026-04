import { CashbackForm } from '../components/cashback-form';
import { CashbackToast } from '../components/cashback-toast';
import { HistoryTable } from '../components/history-table';
import type { CashbackResponse } from '@/api/generated/model';
import { TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function CashbackPage() {
    
    const handleSuccess = (data: CashbackResponse) => {
        toast.custom(() => <CashbackToast data={data} />, {
            duration: 8000,
        });
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none" />

            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

            <div className="relative container mx-auto px-4 py-12 max-w-7xl">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <span className="gradient-text">
                            Calculadora de Cashback
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Calcule seu cashback instantaneamente e acompanhe todo o
                        histórico de consultas em tempo real
                    </p>

                    <div className="flex items-center justify-center gap-8 mt-8">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                Cálculo Instantâneo
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                100% Seguro
                            </span>
                        </div>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto mb-12">
                    <CashbackForm onSuccess={handleSuccess} />
                </div>

                <HistoryTable />
            </div>
        </div>
    );
}
