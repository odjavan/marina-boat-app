import React from 'react';
import { Share, PlusSquare, MoreVertical, Smartphone, Chrome, Info } from 'lucide-react';
import { Dialog, Button } from './ui';

interface InstallGuideProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InstallGuide: React.FC<InstallGuideProps> = ({ isOpen, onClose }) => {
    return (
        <Dialog
            isOpen={isOpen}
            onClose={onClose}
            title="Instalar Aplicativo"
        >
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                        MB
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Marina Boat App</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Tenha acesso rápido direto da sua tela inicial.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    {/* iOS Section */}
                    <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-4">
                        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
                            <span className="text-lg">📱</span> iPhone / iPad (iOS)
                        </div>
                        <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                                <span>Toque no botão <strong>Compartilhar</strong> <Share size={14} className="inline mb-1" /> na barra inferior do Safari.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                                <span>Role para cima e selecione <strong>Adicionar à Tela de Início</strong> <PlusSquare size={14} className="inline mb-1" />.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
                                <span>Confirme clicando em <strong>Adicionar</strong> no canto superior direito.</span>
                            </li>
                        </ol>
                    </div>

                    {/* Android Section */}
                    <div className="p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 bg-blue-50/30 dark:bg-blue-900/10 space-y-4 ring-2 ring-blue-500/20">
                        <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300">
                            <span className="text-lg">🤖</span> Android (Chrome)
                        </div>
                        <ol className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                                <span>Toque no menu de três pontos <MoreVertical size={14} className="inline mb-1" /> no canto superior direito.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                                <span>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong> <PlusSquare size={14} className="inline mb-1" />.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
                                <span>Siga as instruções na tela para confirmar.</span>
                            </li>
                        </ol>
                    </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-800 dark:text-amber-300 text-xs">
                    <Info size={16} className="shrink-0" />
                    <p>Isso permite que você use o Marina Boat como um aplicativo nativo, sem a barra do navegador.</p>
                </div>

                <div className="flex justify-center pt-2">
                    <Button variant="ghost" onClick={onClose} className="text-blue-600 font-bold hover:bg-blue-50">
                        Entendi, fechar guia.
                    </Button>
                </div>
            </div>
        </Dialog>
    );
};
