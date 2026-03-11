import React from 'react';
import { Card, Button, Badge } from './ui';
import { DataTable, type Column } from './DataTable';
import { useAppContext } from '../App';
import { ServiceRequest, ServiceStatus } from '../types';
import { DollarSign, TrendingUp, Clock, CheckCircle2, FileText, Download, Printer } from 'lucide-react';

export const FinanceView: React.FC = () => {
  const { services, vessels, currentUser } = useAppContext();

  // Filtragem de serviços com valor
  const financialServices = services.filter(s => s.total_cost && s.total_cost > 0);

  // Cálculos
  const totalRevenue = financialServices.reduce((sum, s) => sum + (s.total_cost || 0), 0);
  const paidRevenue = financialServices
    .filter(s => s.status_payment === 'Pago')
    .reduce((sum, s) => sum + (s.total_cost || 0), 0);
  const pendingRevenue = totalRevenue - paidRevenue;

  const stats = [
    { label: 'Faturamento Total', value: totalRevenue, icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Recebido', value: paidRevenue, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'A Receber', value: pendingRevenue, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  ];

  const columns: Column<ServiceRequest>[] = [
    {
      header: 'ID',
      width: '60px',
      cell: (s) => <span className="font-mono text-xs text-slate-500">#{s.id.slice(0, 4)}</span>
    },
    {
      header: 'Cliente / Embarcação',
      cell: (s) => {
        const v = vessels.find(v => v.id === s.boat_id);
        return (
          <div>
            <div className="font-medium text-slate-900 dark:text-white">{v?.name || 'N/A'}</div>
            <div className="text-xs text-slate-500">{s.category}</div>
          </div>
        );
      }
    },
    {
      header: 'Data',
      width: '100px',
      cell: (s) => <span className="text-xs text-slate-500">{new Date(s.preferred_date).toLocaleDateString('pt-BR')}</span>
    },
    {
      header: 'Pagamento',
      width: '120px',
      cell: (s) => (
        <Badge color={s.status_payment === 'Pago' ? 'green' : 'yellow'}>
          {s.status_payment || 'Pendente'}
        </Badge>
      )
    },
    {
      header: 'Valor',
      width: '120px',
      className: 'text-right',
      cell: (s) => (
        <span className="font-bold text-slate-900 dark:text-white">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.total_cost || 0)}
        </span>
      )
    }
  ];

  const exportCSV = () => {
    const headers = ['ID', 'Categoria', 'Embarcação', 'Data', 'Valor', 'Status Pagamento'];
    const rows = financialServices.map(s => [
      s.id.slice(0, 8),
      s.category,
      vessels.find(v => v.id === s.boat_id)?.name || 'N/A',
      new Date(s.preferred_date).toLocaleDateString('pt-BR'),
      s.total_cost,
      s.status_payment || 'Pendente'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_financeiro_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 print:p-0">
      {/* Header - Hidden on print */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Gestão Financeira
          </h2>
          <p className="text-slate-500 mt-1">Acompanhe o faturamento e gere relatórios de serviços.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV} className="gap-2">
            <Download size={18} /> CSV
          </Button>
          <Button onClick={handlePrint} className="gap-2 bg-slate-900 hover:bg-slate-800">
            <Printer size={18} /> Imprimir PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
        {stats.map((stat, idx) => (
          <Card key={idx} className="p-6 relative overflow-hidden group">
            <div className={stat.bgColor + " absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl group-hover:scale-110 transition-transform"} />
            <div className="relative z-10 flex items-center gap-4">
              <div className={stat.bgColor + " p-3 rounded-2xl " + stat.color}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stat.value)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Revenue Table */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 mb-4 print:mb-8">
          <div className="h-8 w-1 bg-cyan-500 rounded-full"></div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Detalhamento de Entradas</h3>
        </div>

        <DataTable
          data={financialServices}
          columns={columns}
          emptyMessage="Nenhuma transação financeira registrada."
        />
      </div>

      {/* Footer Branding for PDF */}
      <div className="hidden print:block text-center pt-12 border-t mt-20 text-slate-400 text-xs italic">
        Relatório gerado automaticamente pelo Sistema Marina Boat em {new Date().toLocaleString('pt-BR')}
      </div>

      {/* Estilos específicos para impressão */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:block, .print\\:block * { visibility: visible; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
          .print\\:mb-8 { margin-bottom: 2rem !important; }
          .print\\:p-0, .print\\:p-0 * { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          .print\\:p-0 { position: relative; }
          aside, nav, header { display: none !important; }
          main { margin: 0 !important; padding: 0 !important; width: 100% !important; background: white !important; }
          .Card { border: 1px solid #e2e8f0 !important; box-shadow: none !important; }
        }
      `}} />
    </div>
  );
};
