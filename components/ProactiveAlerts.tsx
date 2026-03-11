import React from 'react';
import { Card, Badge, cn } from './ui';
import { AlertCircle, Clock, Droplets, ArrowRight } from 'lucide-react';
import { useAppContext } from '../App';

export const ProactiveAlerts = () => {
    const { services, vessels, quotations, currentUser, addNotification, clients } = useAppContext();

    if (!currentUser) return null;

    const alerts = [];

    // 1. Alerta de Orçamento Pendente (Para Cliente)
    if (currentUser.user_type === 'cliente') {
        const pendingQuotes = services.filter(s =>
            s.user_id === currentUser.id && s.status === 'Aguardando Orçamento'
        );
        if (pendingQuotes.length > 0) {
            alerts.push({
                id: 'quote-pending',
                title: 'Orçamento Recebido',
                description: `Você tem ${pendingQuotes.length} proposta(s) aguardando sua aprovação.`,
                icon: Clock,
                color: 'amber',
                action: 'Ver Orçamentos'
            });
        }
    }

    // 2. Alertas de Documentação (Para Marina/Admin)
    if (currentUser.user_type !== 'cliente') {
        // Alertas de Embarcações (Documento Vencido ou Vencendo)
        const today = new Date();
        const nextMonth = new Date();
        nextMonth.setDate(today.getDate() + 30);

        vessels.forEach(vessel => {
            if (vessel.doc_expiry) {
                const expiry = new Date(vessel.doc_expiry);
                if (expiry < today) {
                    alerts.push({
                        id: `vessel-expired-${vessel.id}`,
                        title: 'Documento Vencido',
                        description: `A embarcação ${vessel.name} está com a documentação irregular desde ${expiry.toLocaleDateString('pt-BR')}.`,
                        icon: AlertCircle,
                        color: 'red',
                        action: 'Notificar Proprietário'
                    });
                } else if (expiry < nextMonth) {
                    alerts.push({
                        id: `vessel-warning-${vessel.id}`,
                        title: 'Documento Próximo ao Vencimento',
                        description: `O documento de ${vessel.name} vence em ${expiry.toLocaleDateString('pt-BR')}.`,
                        icon: Clock,
                        color: 'amber',
                        action: 'Avisar Proprietário'
                    });
                }
            }
        });

        // Alertas de Clientes (Arrais/Habilitação)
        clients.forEach(client => {
            if (client.license_expiry) {
                const expiry = new Date(client.license_expiry);
                if (expiry < today) {
                    alerts.push({
                        id: `client-expired-${client.id}`,
                        title: 'Arrais Vencida',
                        description: `O cliente ${client.name} está com a habilitação vencida.`,
                        icon: AlertCircle,
                        color: 'red',
                        action: 'Notificar Cliente'
                    });
                } else if (expiry < nextMonth) {
                    alerts.push({
                        id: `client-warning-${client.id}`,
                        title: 'Arrais Vencendo',
                        description: `A habilitação de ${client.name} vence em ${expiry.toLocaleDateString('pt-BR')}.`,
                        icon: Clock,
                        color: 'amber',
                        action: 'Avisar Cliente'
                    });
                }
            }
        });
    }

    if (alerts.length === 0) return null;

    return (
        <div className="space-y-4 animate-premium">
            <div className="flex items-center gap-2 mb-2">
                <div className="h-5 w-1 bg-cyan-500 rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Insights Proativos</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alerts.map((alert) => (
                    <Card key={alert.id} className="p-4 border-l-4 hover:shadow-lg transition-all border-l-current group" style={{ color: `var(--${alert.color}-500)` }}>
                        <div className="flex gap-4">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                alert.color === 'amber' ? "bg-amber-50 text-amber-600" :
                                    alert.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-600"
                            )}>
                                <alert.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">
                                    {alert.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                    {alert.description}
                                </p>
                                <button
                                    onClick={() => addNotification(`Notificação enviada com sucesso para os proprietários das embarcações! \n\nInsight: ${alert.title}`, 'info')}
                                    className="mt-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all hover:text-cyan-600"
                                >
                                    {alert.action} <ArrowRight size={12} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
