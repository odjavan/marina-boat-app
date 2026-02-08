import React, { useState } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    position?: 'top' | 'right' | 'bottom' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    position = 'right'
}) => {
    const [show, setShow] = useState(false);

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-3',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-3',
    };

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900 dark:border-t-slate-700',
        right: 'right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-slate-900 dark:border-r-slate-700',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-slate-900 dark:border-b-slate-700',
        left: 'left-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-l-slate-900 dark:border-l-slate-700',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {children}
            {show && (
                <div className={`absolute ${positions[position]} px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl`}>
                    {content}
                    <div className={`absolute ${arrows[position]}`} />
                </div>
            )}
        </div>
    );
};
