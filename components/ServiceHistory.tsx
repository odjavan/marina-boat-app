import React, { useState, useMemo } from 'react';
import { ServiceRequest, Vessel, ServiceStatus } from '../types';
import { Search, Filter, Printer, Calendar, Ship, CheckCircle2 } from 'lucide-react';
import { Card } from './ui';

interface ServiceHistoryProps {
    services: ServiceRequest[];
    vessels: Vessel[];
}

export function ServiceHistory({ services, vessels }: ServiceHistoryProps) {
    const [filters, setFilters] = useState({
        search: '',
        status: 'all' as ServiceStatus | 'all',
        paymentStatus: 'all' as 'all' | 'Pendente' | 'Pago' | 'N/A',
        vesselId: 'all',
        startDate: '',
        endDate: ''
    });

    const filteredServices = useMemo(() => {
        return services.filter(service => {
            // Search
            const searchLower = filters.search.toLowerCase();
            const matchesSearch =
                service.description.toLowerCase().includes(searchLower) ||
                service.category.toLowerCase().includes(searchLower) ||
                service.id.toLowerCase().includes(searchLower);

            // Status
            const matchesStatus = filters.status === 'all' || service.status === filters.status;

            // Vessel
            const matchesVessel = filters.vesselId === 'all' || service.boat_id === filters.vesselId;

            // Payment Status
            const matchesPayment = filters.paymentStatus === 'all' || service.status_payment === filters.paymentStatus;

            // Date Range
            let matchesDate = true;
            if (filters.startDate) {
                matchesDate = matchesDate && new Date(service.created_at) >= new Date(filters.startDate);
            }
            if (filters.endDate) {
                const end = new Date(filters.endDate);
                end.setHours(23, 59, 59); // End of day
                matchesDate = matchesDate && new Date(service.created_at) <= end;
            }

            return matchesSearch && matchesStatus && matchesVessel && matchesDate && matchesPayment;
        }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [services, filters]);

    const totalCost = filteredServices.reduce((acc, curr) => acc + (curr.total_cost || 0), 0);
    const totalReceived = filteredServices.filter(s => s.status_payment === 'Pago').reduce((acc, curr) => acc + (curr.total_cost || 0), 0);
    const totalPending = filteredServices.filter(s => s.status_payment === 'Pendente').reduce((acc, curr) => acc + (curr.total_cost || 0), 0);

    const handlePrint = () => {
        window.print();
    };

    const getVesselName = (id: string) => vessels.find(v => v.id === id)?.name || 'Desconhecido';

    return (
        <div className="space-y-6 animate-fade-in p-6 print:p-0">
            {/* Header & Actions - Hidden on Print */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Relatórios Gerenciais</h1>
                    <p className="text-slate-500">Visão financeira e operacional da marina.</p>
                </div>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Printer className="w-4 h-4" />
                    <span>Exportar / Imprimir</span>
                </button>
            </div>

            {/* Filters - Hidden on Print */}
            <Card className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 print:hidden">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="w-full pl-9 h-10 rounded-md border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    />
                </div>

                {/* Vessel Filter */}
                <select
                    className="h-10 rounded-md border border-slate-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.vesselId}
                    onChange={e => setFilters(prev => ({ ...prev, vesselId: e.target.value }))}
                >
                    <option value="all">Todas as Embarcações</option>
                    {vessels.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>

                {/* Status Filter */}
                <select
                    className="h-10 rounded-md border border-slate-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.status}
                    onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as ServiceStatus | 'all' }))}
                >
                    <option value="all">Todos os Status</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                </select>

                {/* Date Filter */}
                <input
                    type="date"
                    className="h-10 rounded-md border border-slate-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.startDate}
                    onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
                <input
                    type="date"
                    className="h-10 rounded-md border border-slate-200 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filters.endDate}
                    onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
            </Card>

            {/* Report Header - Visible ONLY on Print */}
            <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Relatório de Serviços</h1>
                <div className="text-slate-600 text-sm">
                    <p>Gerado em: {new Date().toLocaleDateString()} às {new Date().toLocaleTimeString()}</p>
                    <p>Filtros aplicados: {filters.vesselId !== 'all' ? getVesselName(filters.vesselId) : 'Todas as embarcações'}</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total de Serviços</p>
                    <p className="text-2xl font-bold text-slate-900">{filteredServices.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Faturamento Total</p>
                    <p className="text-2xl font-bold text-slate-900">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalCost)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300 border-l-4 border-l-emerald-500">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Recebido</p>
                    <p className="text-2xl font-bold text-emerald-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceived)}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200 print:border-slate-300 border-l-4 border-l-amber-500">
                    <p className="text-xs text-slate-500 uppercase font-semibold">A Receber</p>
                    <p className="text-2xl font-bold text-amber-600">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden print:border-slate-300">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200 print:bg-slate-100">
                            <tr>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Embarcação</th>
                                <th className="px-4 py-3">Serviço/Categoria</th>
                                <th className="px-4 py-3">Descrição</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Pagamento</th>
                                <th className="px-4 py-3 text-right">Valor</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 print:divide-slate-200">
                            {filteredServices.map(service => (
                                <tr key={service.id} className="hover:bg-slate-50 print:hover:bg-transparent">
                                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                        {new Date(service.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-900">
                                        {getVesselName(service.boat_id)}
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">
                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                            {service.category}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate print:whitespace-normal">
                                        {service.description}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${service.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                service.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    service.status === 'Cancelado' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-blue-50 text-blue-700 border-blue-100'
                                            }
                    `}>
                                            {service.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold
                                            ${service.status_payment === 'Pago' ? 'bg-emerald-100 text-emerald-800' :
                                                service.status_payment === 'Pendente' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-slate-100 text-slate-500'}
                                         `}>
                                            {service.status_payment || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium text-slate-900">
                                        {service.total_cost ?
                                            new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.total_cost) :
                                            '-'
                                        }
                                    </td>
                                </tr>
                            ))}

                            {filteredServices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                                        Nenhum serviço encontrado com os filtros atuais.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
