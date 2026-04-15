export function formatCurrency(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (!numbers) return '';

    const amount = Number(numbers) / 100;

    return amount.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function parseCurrency(value: string): number {
    const numbers = value.replace(/\D/g, '');
    return Number(numbers) / 100;
}

export function formatPercent(value: string): string {
    const numbers = value.replace(/\D/g, '');

    if (!numbers) return '';

    const num = Number(numbers);

    if (num > 100) return '100';

    return num.toString();
}
