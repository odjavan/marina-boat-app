import React, { useState } from 'react';
import { Card, Badge, cn } from './ui';
import { Ship, Info } from 'lucide-react';
import { Vessel } from '../types';
import { useAppContext } from '../App';

interface DockSlot {
    id: string;
    label: string;
    isOccupied: boolean;
    vessel?: Vessel;
}

interface Pier {
    id: string;
    name: string;
    slots: DockSlot[];
}

export const DockMap = () => {
    const { vessels } = useAppContext();
    const [selectedSlot, setSelectedSlot] = useState<DockSlot | null>(null);

    // Gerar Píers dinamicamente com base nos barcos ou vagas pré-definidas
    // Para efeito de demonstração premium, vamos mapear os barcos existentes para vagas
    const generatePiers = (): Pier[] => {
        const slotsPerPier = 5;
        const piers: Pier[] = [
            { id: 'pier-a', name: 'Píer A (Norte)', slots: [] },
            { id: 'pier-b', name: 'Píer B (Sul)', slots: [] }
        ];

        let vesselIdx = 0;
        piers.forEach((pier, pIdx) => {
            for (let i = 1; i <= slotsPerPier; i++) {
                const label = `${pIdx === 0 ? 'A' : 'B'}${i}`;
                const vessel = vessels[vesselIdx];
                pier.slots.push({
                    id: label.toLowerCase(),
                    label,
                    isOccupied: !!vessel,
                    vessel: vessel
                });
                if (vessel) vesselIdx++;
            }
        });
        return piers;
    };

    const activePiers = generatePiers();

    return (
        <Card className="p-6 animate-premium stagger-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Ship className="text-cyan-500" />
                        Mapa Interativo de Píer
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Status de ocupação em tempo real</p>
                </div>
                <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ocupado
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                        Livre
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {activePiers.map((pier) => (
                    <div key={pier.id} className="space-y-4">
                        <h4 className="font-bold text-slate-700 dark:text-slate-300 px-1 border-l-2 border-cyan-500 pl-3">
                            {pier.name}
                        </h4>
                        <div className="flex bg-slate-50/50 dark:bg-slate-800/20 p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 gap-4 flex-wrap">
                            {pier.slots.map((slot) => (
                                <button
                                    key={slot.id}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={cn(
                                        "w-16 h-24 rounded-xl flex flex-col items-center justify-between py-3 transition-all duration-300 hover:scale-110 active:scale-95 border group",
                                        slot.isOccupied
                                            ? "bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm"
                                            : "bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 hover:border-cyan-300 dark:hover:border-cyan-700"
                                    )}
                                >
                                    <span className="text-[10px] font-black tracking-widest">{slot.label}</span>
                                    {slot.isOccupied ? (
                                        <Ship size={24} className="drop-shadow-md group-hover:rotate-12 transition-transform" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full border-2 border-current opacity-20" />
                                    )}
                                    <div className="h-1 w-4 bg-current opacity-10 rounded-full" />
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {selectedSlot && (
                <div className="mt-8 p-5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl border border-cyan-200/50 dark:border-cyan-900/30 animate-premium">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner",
                                selectedSlot.isOccupied ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-white dark:bg-slate-800 text-slate-300"
                            )}>
                                <Ship size={28} />
                            </div>
                            <div>
                                <h5 className="font-black text-slate-900 dark:text-white text-lg leading-tight">
                                    Vaga {selectedSlot.label}
                                </h5>
                                <p className="text-sm font-medium text-slate-500">
                                    {selectedSlot.isOccupied
                                        ? `Embarcação: ${selectedSlot.vessel?.name}`
                                        : 'Disponível para nova atracação'}
                                </p>
                            </div>
                        </div>
                        {selectedSlot.isOccupied ? (
                            <div className="flex flex-col items-end gap-1">
                                <Badge color="green">Ocupado</Badge>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {selectedSlot.vessel?.type}
                                </span>
                            </div>
                        ) : (
                            <Badge color="slate">Livre</Badge>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

