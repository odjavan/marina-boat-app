import React, { useState } from 'react';
import { Card, Button, Input, Label, Select, Badge, cn } from './ui';
import { Vessel, Service, ServiceRequest } from '../types';
import { Ship, Wrench, Calendar, Camera, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

interface ServiceRequestWizardProps {
    vessels: Vessel[];
    catalog: Service[];
    onSubmit: (request: any) => Promise<void>;
    onCancel: () => void;
    preSelectedService?: Service | null;
}

export const ServiceRequestWizard: React.FC<ServiceRequestWizardProps> = ({
    vessels,
    catalog, // We'll need to pass the catalog of services here
    onSubmit,
    onCancel,
    preSelectedService
}) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const totalSteps = 4;

    const [formData, setFormData] = useState({
        vessel_id: '',
        service_name: preSelectedService?.name || '',
        category: preSelectedService?.category_id || '', // Note: This might need mapping if category_id is int/uuid
        description: preSelectedService?.description || '',
        urgency: 'Normal',
        preferred_date: '',
        photos: [] as File[]
    });

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    // --- Step Components ---

    const Step1Vessel = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Ship className="text-blue-500" /> Selecione a Embarcação
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vessels.map(v => (
                    <div
                        key={v.id}
                        onClick={() => setFormData({ ...formData, vessel_id: v.id })}
                        className={cn(
                            "p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800",
                            formData.vessel_id === v.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md ring-1 ring-blue-500"
                                : "border-slate-200 dark:border-slate-700"
                        )}
                    >
                        <div className="font-bold text-slate-900 dark:text-white">{v.name}</div>
                        <div className="text-sm text-slate-500">{v.model} • {v.length} pés</div>
                    </div>
                ))}
            </div>
            {vessels.length === 0 && (
                <div className="p-4 text-center text-amber-600 bg-amber-50 rounded-lg border border-amber-200">
                    Você não possui embarcações cadastradas. Cadastre uma antes de solicitar serviço.
                </div>
            )}
        </div>
    );

    const Step2Service = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Wrench className="text-blue-500" /> Detalhes do Serviço
            </h3>

            {preSelectedService ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900 mb-4">
                    <Label>Serviço Selecionado</Label>
                    <div className="font-bold text-lg text-blue-700 dark:text-blue-300">{preSelectedService.name}</div>
                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80">{preSelectedService.description}</p>
                    {preSelectedService.price && (
                        <div className="mt-2 font-medium text-blue-800 dark:text-blue-200">
                            Custo Estimado: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(preSelectedService.price)}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <Label>Tipo de Serviço</Label>
                    <Select
                        value={formData.service_name}
                        onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
                        className="mb-4"
                    >
                        <option value="">Selecione um serviço...</option>
                        {catalog.map(s => (
                            <option key={s.id} value={s.name}>
                                {s.name} ({s.estimated_time})
                                {s.price ? ` - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.price)}` : ''}
                            </option>
                        ))}
                        <option value="Outro">Outro / Personalizado</option>
                    </Select>
                </div>
            )}

            <div>
                <Label>Descrição Detalhada / Observações</Label>
                <textarea
                    className="w-full h-32 px-4 py-2 mt-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Descreva o problema ou necessidade específica..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>
        </div>
    );

    const Step3DateUrgency = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="text-blue-500" /> Agendamento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label>Data Preferencial</Label>
                    <Input
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div>
                    <Label>Nível de Urgência</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                        {['Normal', 'Urgente', 'Emergencial'].map(urg => (
                            <button
                                key={urg}
                                onClick={() => setFormData({ ...formData, urgency: urg })}
                                className={cn(
                                    "px-3 py-2 rounded-lg text-sm font-medium border transition-all",
                                    formData.urgency === urg
                                        ? urg === 'Normal' ? "bg-blue-100 text-blue-700 border-blue-300"
                                            : urg === 'Urgente' ? "bg-amber-100 text-amber-700 border-amber-300"
                                                : "bg-red-100 text-red-700 border-red-300"
                                        : "bg-white dark:bg-slate-800 text-slate-600 border-slate-200 dark:border-slate-700"
                                )}
                            >
                                {urg}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const Step4Review = () => {
        const vessel = vessels.find(v => v.id === formData.vessel_id);
        const selectedServiceObj = catalog.find(s => s.name === formData.service_name);
        // Use preSelectedService if available and matches, or find in catalog
        const serviceObj = preSelectedService && preSelectedService.name === formData.service_name
            ? preSelectedService
            : selectedServiceObj;

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle2 className="text-green-500" /> Revisar e Enviar
                </h3>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 space-y-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-slate-500">Embarcação</span>
                        <span className="font-medium">{vessel?.name || 'Não selecionada'}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-slate-500">Serviço</span>
                        <span className="font-medium">{formData.service_name || 'Personalizado'}</span>
                    </div>
                    {serviceObj && serviceObj.price && (
                        <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span className="text-slate-500">Valor Estimado</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(serviceObj.price)}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                        <span className="text-slate-500">Data</span>
                        <span className="font-medium">{formData.preferred_date || 'A combinar'}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-slate-500">Urgência</span>
                        <Badge
                            color={formData.urgency === 'Normal' ? 'blue' : formData.urgency === 'Urgente' ? 'yellow' : 'red'}
                        >
                            {formData.urgency}
                        </Badge>
                    </div>
                </div>
            </div>
        );
    };

    // --- Render ---

    return (
        <div className="flex flex-col h-full min-h-[500px]">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 px-2 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 -z-10 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-blue-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}></div>

                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2",
                            step >= s
                                ? "bg-blue-500 text-white border-blue-500"
                                : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700"
                        )}
                    >
                        {s}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto px-1 custom-scrollbar">
                {step === 1 && Step1Vessel()}
                {step === 2 && Step2Service()}
                {step === 3 && Step3DateUrgency()}
                {step === 4 && Step4Review()}
            </div>

            {/* Footer Actions */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                {step > 1 ? (
                    <Button variant="outline" onClick={handleBack}>
                        <ChevronLeft size={16} /> Voltar
                    </Button>
                ) : (
                    <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                )}

                {step < totalSteps ? (
                    <Button
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !formData.vessel_id) ||
                            (step === 2 && !formData.service_name && !formData.description) ||
                            (step === 3 && !formData.preferred_date)
                        }
                    >
                        Próximo <ChevronRight size={16} />
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
                        {loading ? 'Enviando...' : 'Confirmar Solicitação'}
                    </Button>
                )}
            </div>
        </div>
    );
};
