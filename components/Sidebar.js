import React from 'react';
import { useDnD } from './DnDContext';

export default function Sidebar() {
    const [_, setType] = useDnD();

    const onDragStart = (event, nodeType) => {
        setType(nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 p-4 bg-zinc-900 border-r border-zinc-800 text-zinc-100 flex flex-col gap-4 select-none">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Components
            </div>
            <div className="text-xs text-zinc-500">
                Drag nodes onto the workflow canvas:
            </div>
            <div className="flex flex-col gap-2">
                <div
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-700/80 active:cursor-grabbing transition-colors text-sm font-medium flex items-center gap-2"
                    onDragStart={(event) => onDragStart(event, 'input')}
                    draggable
                >
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    Input Node
                </div>
                <div
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-700/80 active:cursor-grabbing transition-colors text-sm font-medium flex items-center gap-2"
                    onDragStart={(event) => onDragStart(event, 'default')}
                    draggable
                >
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Default Node
                </div>
                <div
                    className="p-3 bg-zinc-800 border border-zinc-700 rounded-lg cursor-grab hover:bg-zinc-700/80 active:cursor-grabbing transition-colors text-sm font-medium flex items-center gap-2"
                    onDragStart={(event) => onDragStart(event, 'output')}
                    draggable
                >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    Output Node
                </div>
            </div>
        </aside>
    );
}
