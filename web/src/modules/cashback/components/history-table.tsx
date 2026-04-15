import { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    type ColumnDef,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useGetHistoryApiV1CashbackHistoryGet } from '@/api/generated/cashback/cashback';
import type { HistoryItem } from '@/api/generated/model';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const columns: ColumnDef<HistoryItem>[] = [
    {
        accessorKey: 'created_at',
        header: 'Data',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return date.toLocaleString('pt-BR');
        },
    },
    {
        accessorKey: 'client_type',
        header: 'Tipo',
        cell: ({ row }) => {
            const type = row.getValue('client_type') as string;
            const isVip = type === 'vip';
            return (
                <span className="capitalize flex items-center gap-1">
                    {type}
                    {isVip && (
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    )}
                </span>
            );
        },
    },
    {
        accessorKey: 'purchase_value',
        header: 'Valor',
    },
    {
        accessorKey: 'discount_percent',
        header: 'Desconto',
        cell: ({ row }) => `${row.getValue('discount_percent')}%`,
    },
    {
        accessorKey: 'cashback_amount',
        header: 'Cashback',
        cell: ({ row }) => (
            <span className="font-medium text-primary">
                {row.getValue('cashback_amount')}
            </span>
        ),
    },
];

export function HistoryTable() {
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const pageSize = 10;

    const { data, isLoading, isError } = useGetHistoryApiV1CashbackHistoryGet({
        page,
        page_size: pageSize,
        sort_order: sortOrder,
    });

    const table = useReactTable({
        data: data?.items || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-muted-foreground">
                        Carregando histórico...
                    </p>
                </CardContent>
            </Card>
        );
    }

    if (isError) {
        return (
            <Card>
                <CardContent className="py-8">
                    <p className="text-center text-destructive">
                        Erro ao carregar histórico
                    </p>
                </CardContent>
            </Card>
        );
    }

    const metadata = data?.metadata;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Histórico de Consultas</CardTitle>
                        <CardDescription>
                            {metadata?.total_items || 0} consultas realizadas
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
                        }
                    >
                        {sortOrder === 'desc'
                            ? 'Mais Recentes'
                            : 'Mais Antigas'}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {table.getRowModel().rows.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        Nenhuma consulta realizada ainda
                    </p>
                ) : (
                    <>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <TableHead
                                                            key={header.id}
                                                        >
                                                            {header.isPlaceholder
                                                                ? null
                                                                : flexRender(
                                                                      header
                                                                          .column
                                                                          .columnDef
                                                                          .header,
                                                                      header.getContext(),
                                                                  )}
                                                        </TableHead>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => (
                                        <TableRow key={row.id}>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell key={cell.id}>
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {metadata && metadata.total_pages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-muted-foreground">
                                    Página {metadata.page} de{' '}
                                    {metadata.total_pages}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page - 1)}
                                        disabled={!metadata.has_previous}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setPage(page + 1)}
                                        disabled={!metadata.has_next}
                                    >
                                        Próxima
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
