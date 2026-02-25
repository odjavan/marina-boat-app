import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="text-green-400" size={20} />,
        error: <XCircle className="text-red-400" size={20} />,
        info: <Info className="text-blue-400" size={20} />
    };

    const colors = {
        success: 'border-green-500/30 bg-green-500/10 text-green-50',
        error: 'border-red-500/30 bg-red-500/10 text-red-50',
        info: 'border-blue-500/30 bg-blue-500/10 text-blue-50'
    };

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 ${colors[type]}`}>
            {icons[type]}
            <p className="text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
                <X size={14} />
            </button>
        </div>
    );
};
