import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Label, Select, Dialog, Badge, cn } from './ui';
import { Service, ServiceCategory, ServiceCategoryName } from '../types';
import { Plus, Search, Trash2, Edit2, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// Icons mapping for visual representation
import * as Icons from 'lucide-react';

interface ServiceCatalogProps {
    onSelectService?: (service: Service) => void;
    isAdmin?: boolean;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({ onSelectService, isAdmin = true }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

    // New Service Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newService, setNewService] = useState<Partial<Service>>({
        name: '',
        description: '',
        estimated_time: '',
        category_id: '',
        is_active: true
    });

    useEffect(() => {
        fetchCatalog();
    }, []);

    const fetchCatalog = async () => {
        setLoading(true);
        try {
            const { data: cats } = await supabase.from('service_categories').select('*');
            const { data: servs } = await supabase.from('services').select('*');

            if (cats) setCategories(cats);
            if (servs) setServices(servs);
        } catch (error) {
            console.error('Error fetching catalog:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateService = async () => {
        try {
            const { data, error } = await supabase.from('services').insert([newService]).select();
            if (error) throw error;
            if (data) {
                setServices([...services, data[0]]);
                setIsDialogOpen(false);
                setNewService({ name: '', description: '', estimated_time: '', category_id: '', is_active: true });
                alert('Serviço criado com sucesso!');
            }
        } catch (error: any) {
            alert('Erro ao criar serviço: ' + error.message);
        }
    };

    const filteredServices = services.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
        const serviceCategory = categories.find(c => c.id === s.category_id);
        const matchesCategory = selectedCategory === 'Todos' || serviceCategory?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Buscar serviços..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                {isAdmin && (
                    <Button onClick={() => setIsDialogOpen(true)} className="w-full md:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Novo Serviço
                    </Button>
                )}
            </div>

            {/* Categories Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                    variant={selectedCategory === 'Todos' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('Todos')}
                >
                    Todos
                </Button>
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={selectedCategory === cat.name ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(cat.name)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredServices.map(service => {
                    // Dynamic Icon rendering
                    const IconComponent = (Icons as any)[service.icon] || Icons.Settings;
                    const category = categories.find(c => c.id === service.category_id);

                    return (
                        <Card
                            key={service.id}
                            className={cn(
                                "p-4 cursor-pointer hover:border-blue-500 transition-colors",
                                onSelectService ? "active:scale-95" : ""
                            )}
                            onClick={() => onSelectService?.(service)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                {category && <Badge variant="secondary">{category.name}</Badge>}
                            </div>

                            <h3 className="mt-3 font-semibold text-lg">{service.name}</h3>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{service.description}</p>

                            <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Icons.Clock className="h-3 w-3" /> {service.estimated_time || 'N/A'}
                                </span>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Create Service Dialog */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md p-6 relative bg-white dark:bg-slate-900">
                        <h2 className="text-xl font-bold mb-4">Novo Serviço</h2>

                        <div className="space-y-4">
                            <div>
                                <Label>Nome do Serviço</Label>
                                <Input
                                    value={newService.name}
                                    onChange={e => setNewService({ ...newService, name: e.target.value })}
                                    placeholder="Ex: Polimento Completo"
                                />
                            </div>

                            <div>
                                <Label>Categoria</Label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                                    value={newService.category_id}
                                    onChange={e => setNewService({ ...newService, category_id: e.target.value })}
                                >
                                    <option value="">Selecione...</option>
                                    {categories.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Label>Descrição</Label>
                                <Input
                                    value={newService.description}
                                    onChange={e => setNewService({ ...newService, description: e.target.value })}
                                    placeholder="O que será feito..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Tempo Estimado</Label>
                                    <Input
                                        value={newService.estimated_time}
                                        onChange={e => setNewService({ ...newService, estimated_time: e.target.value })}
                                        placeholder="Ex: 2 horas"
                                    />
                                </div>
                                <div>
                                    <Label>Ícone (Nome Lucide)</Label>
                                    <Input
                                        value={newService.icon || 'Settings'}
                                        onChange={e => setNewService({ ...newService, icon: e.target.value })}
                                        placeholder="Wrench, Anchor..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button onClick={handleCreateService}>Criar Serviço</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
