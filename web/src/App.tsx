import { CashbackPage } from './modules/cashback';
import { ThemeToggle } from './shared/components/theme-toggle';
import { Toaster } from '@/components/ui/sonner';

function App() {
    return (
        <div className="relative">
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>
            <CashbackPage />
            <Toaster />
        </div>
    );
}

export default App;
