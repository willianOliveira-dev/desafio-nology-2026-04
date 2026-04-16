import { CashbackForm } from '../components/cashback-form';
import { CashbackToast } from '../components/cashback-toast';
import { HistoryTable } from '../components/history-table';
import type { CashbackResponse } from '@/api/generated/model';
import { TrendingUp, Shield } from 'lucide-react';
import { toast } from 'sonner';
import logo from '../../../assets/logo.svg';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/shared/components/theme-toggle';

export function CashbackPage() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

            <header
                className={cn(
                    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                    isScrolled
                        ? 'bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm'
                        : 'bg-background/60 backdrop-blur-sm',
                )}
            >
                <div className="container mx-auto px-6 py-3 max-w-7xl flex items-center justify-between">
                    <a href="/" className="inline-block">
                        <img src={logo} alt="Logo" className="h-10 w-auto" />
                    </a>
                    <ThemeToggle />
                </div>
            </header>

            <div className="relative container mx-auto px-4 pt-24 pb-8 max-w-7xl">
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

            <footer className="relative z-10 border-t border-border/40 mt-20">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="Logo"
                                className="h-6 w-auto opacity-40"
                            />
                            <span className="text-sm text-muted-foreground">
                                © {new Date().getFullYear()} Todos os direitos
                                reservados
                            </span>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            Desenvolvido por{' '}
                            <a
                                href="https://github.com/willianOliveira-dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline font-medium transition-colors"
                            >
                                Willian dos Santos Oliveira
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
