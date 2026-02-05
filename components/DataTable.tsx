import React from 'react';
import { cn } from './ui';

export interface Column<T> {
    header: string;
    accessorKey?: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
    width?: string;
}

export interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    actions?: (item: T) => React.ReactNode;
    rowClassName?: (item: T) => string;
    emptyMessage?: string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    actions,
    rowClassName,
    emptyMessage = " Nenhum registro encontrado."
}: DataTableProps<T>) {
    return (
        <div className="w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            {columns.map((col, index) => (
                                <th
                                    key={index}
                                    className={cn(
                                        "px-4 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 whitespace-nowrap",
                                        col.className
                                    )}
                                    style={{ width: col.width }}
                                >
                                    {col.header}
                                </th>
                            ))}
                            {actions && <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Ações</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr
                                    key={item.id}
                                    onClick={() => onRowClick && onRowClick(item)}
                                    className={cn(
                                        "group transition-colors",
                                        onRowClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 active:bg-slate-100 dark:active:bg-slate-800" : "",
                                        rowClassName ? rowClassName(item) : ""
                                    )}
                                >
                                    {columns.map((col, colIndex) => (
                                        <td key={colIndex} className="px-4 py-3 text-slate-700 dark:text-slate-300 align-middle">
                                            {col.cell ? col.cell(item) : (col.accessorKey ? String(item[col.accessorKey]) : null)}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3 text-right align-middle" onClick={(e) => e.stopPropagation()}>
                                            {actions(item)}
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
