import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCalculateCashbackApiV1CashbackCalculatePost } from '@/api/generated/cashback/cashback';
import type { CashbackResponse } from '@/api/generated/model';
import { Calculator, Percent, DollarSign, User } from 'lucide-react';
import { useState } from 'react';
import { formatCurrency, formatPercent, parseCurrency } from '@/utils/masks';
import { useQueryClient } from '@tanstack/react-query';

const formSchema = z.object({
    client_type: z.enum(['regular', 'vip']),
    purchase_value: z
        .number()
        .positive('Valor deve ser maior que zero')
        .max(10000000, 'Valor máximo permitido é R$ 10.000.000,00'),
    discount_percent: z.number().min(0).max(100).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CashbackFormProps {
    onSuccess: (data: CashbackResponse) => void;
}

export function CashbackForm({ onSuccess }: CashbackFormProps) {
    const [purchaseDisplay, setPurchaseDisplay] = useState('');
    const [discountDisplay, setDiscountDisplay] = useState('');
    const queryClient = useQueryClient();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            client_type: 'regular',
            discount_percent: 0,
        },
    });

    const mutation = useCalculateCashbackApiV1CashbackCalculatePost();

    const onSubmit = (data: FormData) => {
        mutation.mutate(
            { data },
            {
                onSuccess: async (response) => {
                    onSuccess(response);
                    await queryClient.invalidateQueries({
                        queryKey: ['/api/v1/cashback/history'],
                    });
                },
            },
        );
    };

    const handlePurchaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCurrency(e.target.value);
        setPurchaseDisplay(formatted);
        setValue('purchase_value', parseCurrency(formatted));
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPercent(e.target.value);
        setDiscountDisplay(formatted);
        setValue('discount_percent', Number(formatted));
    };

    return (
        <div className="glass-card rounded-2xl p-8 border border-white/10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Calculator className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold">Calcular Cashback</h2>
                    <p className="text-sm text-muted-foreground">
                        Preencha os dados para calcular
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <Label
                        htmlFor="client_type"
                        className="flex items-center gap-2"
                    >
                        <User className="w-4 h-4" />
                        Tipo de Cliente
                    </Label>
                    <Controller
                        name="client_type"
                        control={control}
                        render={({ field }) => (
                            <Select
                                value={field.value}
                                onValueChange={field.onChange}
                            >
                                <SelectTrigger
                                    id="client_type"
                                    className="glass-button h-12"
                                >
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="regular">
                                        Regular
                                    </SelectItem>
                                    <SelectItem value="vip">VIP</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.client_type && (
                        <p className="text-sm text-destructive">
                            {errors.client_type.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="purchase_value"
                        className="flex items-center gap-2"
                    >
                        <DollarSign className="w-4 h-4" />
                        Valor da Compra
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            R$
                        </span>
                        <Input
                            id="purchase_value"
                            type="text"
                            placeholder="0,00"
                            value={purchaseDisplay}
                            onChange={handlePurchaseChange}
                            className="glass-button h-12 text-lg pl-12"
                        />
                    </div>
                    {errors.purchase_value && (
                        <p className="text-sm text-destructive">
                            {errors.purchase_value.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label
                        htmlFor="discount_percent"
                        className="flex items-center gap-2"
                    >
                        <Percent className="w-4 h-4" />
                        Desconto
                    </Label>
                    <div className="relative">
                        <Input
                            id="discount_percent"
                            type="text"
                            placeholder="0"
                            value={discountDisplay}
                            onChange={handleDiscountChange}
                            className="glass-button h-12 text-lg pr-12"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            %
                        </span>
                    </div>
                    {errors.discount_percent && (
                        <p className="text-sm text-destructive">
                            {errors.discount_percent.message}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 text-lg font-semibold bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-all duration-200"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? (
                        <span className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Calculando...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Calculator className="w-5 h-5" />
                            Calcular Cashback
                        </span>
                    )}
                </Button>

                {mutation.isError && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive">
                            Erro ao calcular cashback. Tente novamente.
                        </p>
                    </div>
                )}
            </form>
        </div>
    );
}
