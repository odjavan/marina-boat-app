import React from 'react';
import { Edit, Trash2, Ship as ShipIcon, Calendar, User as UserIcon } from 'lucide-react';
import { Card } from './ui';
import { Badge } from './Badge';
import type { Vessel } from '../types';

interface VesselCardProps {
    vessel: Vessel;
    ownerName?: string;
    onEdit: (vessel: Vessel) => void;
    onDelete: (vessel: Vessel) => void;
}

export const VesselCard: React.FC<VesselCardProps> = ({ vessel, ownerName, onEdit, onDelete }) => {
    return (
        <Card className="p-5 hover:shadow-lg transition-all duration-200 border-0 shadow-md group">
            <div className="flex items-start justify-between gap-4">
                {/* Ícone e Info Principal */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                        <ShipIcon size={28} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                                {vessel.name}
                            </h3>
                            <Badge variant="info" size="sm">{vessel.type}</Badge>
                        </div>

                        {/* Informações da Embarcação */}
                        <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-500">Modelo:</span>
                                <span>{vessel.model}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-slate-500">Registro:</span>
                                <span className="font-mono text-xs">{vessel.registration_number}</span>
                            </div>
                            {ownerName && (
                                <div className="flex items-center gap-2">
                                    <UserIcon size={14} className="text-slate-400 flex-shrink-0" />
                                    <span>{ownerName}</span>
                                </div>
                            )}
                        </div>

                        {/* Dimensões */}
                        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                            <div>
                                <span className="text-xs text-slate-500">Comprimento</span>
                                <p className="font-semibold text-slate-900 dark:text-white">{vessel.length}m</p>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500">Ano</span>
                                <p className="font-semibold text-slate-900 dark:text-white">{vessel.year}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ações */}
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onEdit(vessel)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                        title="Editar embarcação"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(vessel)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                        title="Excluir embarcação"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </Card>
    );
};
