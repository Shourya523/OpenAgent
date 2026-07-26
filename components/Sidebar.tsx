"use client";

import React from 'react';
import { useDnD } from './DnDContext';

const NODE_TYPES = [
    { type: 'input', label: 'Input Node', color: 'bg-emerald-400' },
    { type: 'default', label: 'Prompt', color: 'bg-sky-400' },
    { type: 'default', label: 'LLM', color: 'bg-purple-400' },
    { type: 'default', label: 'Tool', color: 'bg-amber-400' },
    { type: 'default', label: 'Memory', color: 'bg-teal-400' },
    { type: 'default', label: 'Condition', color: 'bg-rose-400' },
    { type: 'output', label: 'Output Node', color: 'bg-indigo-400' },
];

export default function Sidebar() {
    const [_, setDndItem] = useDnD();

    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, label: string) => {
        setDndItem({ type: nodeType, label });
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-56 p-4 bg-zinc-950 border-r border-zinc-800/80 text-zinc-100 flex flex-col gap-4 select-none">
            <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                Nodes
            </div>
            <div className="flex flex-col gap-1.5">
                {NODE_TYPES.map((node) => (
                    <div
                        key={node.label}
                        className="px-3 py-2 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 rounded-md cursor-grab active:cursor-grabbing transition-all text-xs font-medium text-zinc-300 hover:text-zinc-100 flex items-center gap-2.5"
                        onDragStart={(event) => onDragStart(event, node.type, node.label)}
                        draggable
                    >
                        <span className={`w-1.5 h-1.5 rounded-full ${node.color}`}></span>
                        <span>{node.label}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
}
