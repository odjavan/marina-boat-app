import React from 'react';
import { Edit, Trash2, Mail, Phone, User as UserIcon } from 'lucide-react';
import { Card } from './ui';
import { Badge } from './Badge';
import type { User } from '../types';

interface ClientCardProps {
    client: User;
    onEdit: (client: User) => void;
    onDelete: (client: User) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onDelete }) => {
    return (
        <Card className="p-5 hover:shadow-lg transition-all duration-200 border-0 shadow-md group">
            <div className="flex items-start justify-between gap-4">
                {/* Avatar e Info Principal */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white dark:ring-slate-900 flex-shrink-0">
                        {client.avatar_initial}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                                {client.name}
                            </h3>
                            <Badge variant="success" size="sm">Ativo</Badge>
                        </div>

                        {/* Informações de Contato */}
                        <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <Mail size={14} className="text-slate-400 flex-shrink-0" />
                                <span className="truncate">{client.email}</span>
                            </div>
                            {client.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone size={14} className="text-slate-400 flex-shrink-0" />
                                    <span>{client.phone}</span>
                                </div>
                            )}
                            {client.cpf && (
                                <div className="flex items-center gap-2">
                                    <UserIcon size={14} className="text-slate-400 flex-shrink-0" />
                                    <span className="font-mono text-xs">{client.cpf}</span>
                                </div>
                            )}
                        </div>

                        {/* Data de Cadastro */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            <span className="text-xs text-slate-500">
                                Cadastrado em {new Date(client.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(client)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                        title="Editar cliente"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(client)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        title="Excluir cliente"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </Card>
    );
};
