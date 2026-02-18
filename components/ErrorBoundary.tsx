import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, Button } from './ui';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                    <Card className="max-w-md w-full p-8 text-center border-t-4 border-red-500 shadow-xl">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Algo deu errado
                        </h1>

                        <p className="text-slate-500 dark:text-slate-400 mb-6">
                            Ocorreu um erro inesperado na aplicação. Tente recarregar a página.
                        </p>

                        {this.state.error && (
                            <div className="bg-slate-100 dark:bg-slate-900 p-3 rounded text-left text-xs font-mono text-red-600 mb-6 overflow-auto max-h-32">
                                {this.state.error.toString()}
                            </div>
                        )}

                        <div className="flex gap-3 justify-center">
                            <Button
                                onClick={() => window.location.reload()}
                                className="bg-slate-900 hover:bg-slate-800 text-white"
                            >
                                <RefreshCcw className="mr-2 h-4 w-4" />
                                Recarregar Página
                            </Button>
                        </div>
                    </Card>
                </div>
            );
        }

        return (this.props as any).children;
    }
}
