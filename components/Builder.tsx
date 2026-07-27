"use client"
import React, { useCallback, useRef, useEffect, useState, ReactNode } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
    type Connection,
    type Node,
    type Edge
} from '@xyflow/react';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import { executeWorkflow } from '../workflow/executeWorkFlows';
import "@xyflow/react/dist/style.css";

const STORAGE_KEY = 'openagent-flow-state';

let id = 0;
const getId = () => `dndnode_${id++}`;

const initialNodes: Node[] = [
    { id: 'n1', position: { x: 250, y: 100 }, data: { label: 'Start' } },
    { id: 'n2', position: { x: 250, y: 250 }, data: { label: 'Finish' } },
];

const initialEdges: Edge[] = [
    { id: 'n1-n2', source: 'n1', target: 'n2', label: "somewhere in between" }
];

const fieldOptions: Record<string, Array<{ value: string, label: string }>> = {
    provider: [
        { value: "google", label: "Google Gemini" },
    ],
    model: [
        { value: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite (Default)" },
        { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash" },
        { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro" },
        { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash" },
    ],
    tool: [
        { value: "web_search", label: "Web Search (DDG)" },
        { value: "calculator", label: "Math Calculator" },
        { value: "fetch_url", label: "URL Content Scraper" },
        { value: "generate_image", label: "Image Generation" },
    ],
    operation: [
        { value: "load", label: "Load from Memory" },
        { value: "save", label: "Save to Memory" },
        { value: "clear", label: "Clear Memory" },
    ],
    operator: [
        { value: "==", label: "Equals" },
        { value: "!=", label: "Not Equals" },
        { value: "contains", label: "Contains" },
        { value: ">", label: "Greater Than" },
        { value: "<", label: "Less Than" },
    ],
    format: [
        { value: "text", label: "Plain Text" },
        { value: "markdown", label: "Markdown" },
        { value: "json", label: "JSON" },
    ],
};

const sidebarFieldsByType: Record<string, Array<{ key: string, label: string }>> = {
    prompt: [
        { key: "name", label: "Node Name" },
        { key: "prompt", label: "Prompt Template" },
        { key: "outputVariable", label: "Output Variable Name" },
    ],

    llm: [
        { key: "name", label: "Node Name" },
        { key: "provider", label: "Provider" },
        { key: "model", label: "Model" },
        { key: "inputVariable", label: "Input Variable" },
        { key: "systemPrompt", label: "System Prompt" },
        { key: "temperature", label: "Temperature" },
        { key: "maxTokens", label: "Max Tokens" },
        { key: "outputVariable", label: "Output Variable" },
    ],

    tool: [
        { key: "name", label: "Node Name" },
        { key: "tool", label: "Tool Type" },
        { key: "arguments", label: "Arguments (e.g. {{my_var}})" },
        { key: "outputVariable", label: "Output Variable" },
    ],

    memory: [
        { key: "name", label: "Node Name" },
        { key: "operation", label: "Operation" },
        { key: "variable", label: "Variable Name" },
    ],

    condition: [
        { key: "name", label: "Node Name" },
        { key: "leftOperand", label: "Left Operand (e.g. {{my_var}})" },
        { key: "operator", label: "Operator" },
        { key: "rightOperand", label: "Right Operand (e.g. yes)" },
    ],

    input: [
        { key: "name", label: "Node Name" },
        { key: "variable", label: "Variable Name" },
        { key: "defaultValue", label: "Default Value" },
        { key: "placeholder", label: "Placeholder Alert" },
    ],

    output: [
        { key: "name", label: "Node Name" },
        { key: "variable", label: "Variable to Output" },
        { key: "format", label: "Output Format" },
    ],
};

const getNodeConfigType = (node: Node | null | undefined) => {
    const explicitType = typeof node?.data?.nodeType === 'string' ? node.data.nodeType : undefined;
    if (explicitType) return explicitType;

    const label = String(node?.data?.label ?? '').toLowerCase();
    if (label.includes('prompt')) return 'prompt';
    if (label.includes('llm')) return 'llm';
    if (label.includes('tool')) return 'tool';
    if (label.includes('memory')) return 'memory';
    if (label.includes('condition')) return 'condition';
    if (label.includes('input')) return 'input';
    if (label.includes('output')) return 'output';

    return typeof node?.type === 'string' ? node.type : 'default';
};

function DnDFlow() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const { screenToFlowPosition, deleteElements, toObject, setViewport } = useReactFlow();
    const [dndItem] = useDnD();
        const [toast, setToast] = useState<string | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [showLogs, setShowLogs] = useState(false);
    const [variables, setVariables] = useState<Record<string, any>>({});
    const [activeTab, setActiveTab] = useState<'logs' | 'variables'>('logs');

    const showToast = useCallback((msg: string) => {
        setToast(msg);
        window.setTimeout(() => setToast(null), 2500);
    }, []);

    const addLog = useCallback((msg: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    }, []);

    const runWorkflow = useCallback(async () => {
        if (isRunning || nodes.length === 0) return;

        // Reset variables and logs on restart
        setVariables({});
        setLogs([]);

        await executeWorkflow({
            nodes,
            edges,
            setNodes,
            setEdges,
            setIsRunning,
            setShowLogs,
            addLog,
            showToast,
            setVariables,
        });
    }, [addLog, edges, isRunning, nodes, setEdges, setNodes, setShowLogs, showToast]);

    const handleSave = useCallback(() => {
        const flow = toObject();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(flow));
        showToast('Workflow saved to LocalStorage!');
    }, [toObject]);

    const handleRestore = useCallback(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const flow = JSON.parse(saved);
                if (flow) {
                    setNodes(flow.nodes || []);
                    setEdges(flow.edges || []);
                    if (flow.viewport) {
                        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                        setViewport({ x, y, zoom });
                    }
                    showToast('Workflow restored!');
                }
            } catch (err) {
                console.error("Failed to parse saved workflow", err);
            }
        } else {
            showToast('No saved workflow found.');
        }
    }, [setNodes, setEdges, setViewport]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const flow = JSON.parse(saved);
                if (flow.nodes && flow.nodes.length > 0) {
                    setNodes(flow.nodes);
                    if (flow.edges) setEdges(flow.edges);
                }
            } catch (err) {
                console.error("Error auto-loading flow state", err);
            }
        }
    }, [setNodes, setEdges]);

    const selectedNodes = nodes.filter((node) => Boolean(node.selected));
    const selectedEdges = edges.filter((edge) => Boolean(edge.selected));
    const selectedNode = selectedNodes.length === 1 ? selectedNodes[0] : null;
    const hasSelection = selectedNodes.length > 0 || selectedEdges.length > 0;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const selectedNodeData = (nodes.find((node) => node.id === selectedNodeId) as
        | Node<{ label?: string; [key: string]: unknown }>
        | undefined) ?? null;

    const handleLabelChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newLabel = event.target.value;
        if (!selectedNode) return;
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: newLabel,
                        },
                    };
                }
                return node;
            })
        );
    }, [selectedNode, setNodes]);

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
        setIsSidebarOpen(true);
    }, []);

    const onNodeDoubleClick = useCallback((_: React.MouseEvent, node: Node) => {
        const currentLabel = (node.data?.label as string) || '';
        const newLabel = prompt('Edit node label:', currentLabel);
        if (newLabel !== null && newLabel.trim() !== '') {
            setNodes((nds) =>
                nds.map((n) => {
                    if (n.id === node.id) {
                        return {
                            ...n,
                            data: {
                                ...n.data,
                                label: newLabel,
                            },
                        };
                    }
                    return n;
                })
            );
        }
    }, [setNodes]);

    const handleDeleteSelection = useCallback(() => {
        deleteElements({
            nodes: selectedNodes,
            edges: selectedEdges,
        });
    }, [deleteElements, selectedNodes, selectedEdges]);

    const onConnect = useCallback(
        (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const nodeType = dndItem?.type || event.dataTransfer.getData('application/reactflow/type') || event.dataTransfer.getData('application/reactflow');
            const nodeLabel = dndItem?.label || event.dataTransfer.getData('application/reactflow/label') || (nodeType ? `${nodeType} node` : 'Node');

            if (!nodeType) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const nodeConfigType = nodeType === 'default' ? getNodeConfigType({
                id: getId(),
                type: nodeType,
                position,
                data: { label: nodeLabel },
            }) : nodeType;

            const newNode = {
                id: getId(),
                type: nodeType,
                position,
                data: { label: nodeLabel, nodeType: nodeConfigType },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [screenToFlowPosition, dndItem, setNodes]
    );

    return (
        <div className="flex w-full h-[80vh] min-h-[650px] border border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 relative">
            <Sidebar />
            <div className="flex-grow h-full relative" ref={reactFlowWrapper}>
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                    <button
                        onClick={runWorkflow}
                        disabled={isRunning}
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer ${isRunning
                            ? 'bg-amber-600/60 text-amber-100 cursor-not-allowed animate-pulse'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                    >
                        {isRunning ? 'Running...' : 'Run Workflow'}
                    </button>
                    <button
                        onClick={() => setShowLogs((prev) => !prev)}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded-lg border border-zinc-700 shadow-md backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        {showLogs ? 'Hide Logs' : 'Logs'}
                    </button>
                    {selectedNode && (
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg shadow-md">
                            <span className="text-xs font-semibold text-zinc-400">Label:</span>
                            <input
                                type="text"
                                value={(selectedNode.data?.label as string) || ''}
                                onChange={handleLabelChange}
                                className="bg-zinc-800 text-zinc-100 text-xs px-2 py-1 rounded border border-zinc-600 focus:outline-none focus:border-blue-500 w-36"
                                placeholder="Node Label"
                            />
                        </div>
                    )}
                    {hasSelection && (
                        <button
                            onClick={handleDeleteSelection}
                            className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold rounded-lg shadow-lg backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Delete selected nodes/edges"
                        >
                            Delete ({selectedNodes.length + selectedEdges.length})
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded-lg border border-zinc-700 shadow-md backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        Save
                    </button>
                    <button
                        onClick={handleRestore}
                        className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-semibold rounded-lg border border-zinc-700 shadow-md backdrop-blur flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        Restore
                    </button>
                </div>

                                {showLogs && (
                    <div className="absolute bottom-4 left-4 z-20 w-[420px] max-h-72 bg-zinc-900/95 border border-zinc-800 rounded-lg p-3 shadow-2xl backdrop-blur overflow-y-auto text-xs font-mono text-zinc-300 flex flex-col gap-2">
                        <div className="flex justify-between items-center pb-1 border-b border-zinc-800 font-semibold text-zinc-400">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('logs')}
                                    className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'logs' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Logs
                                </button>
                                <button
                                    onClick={() => setActiveTab('variables')}
                                    className={`px-2 py-0.5 rounded transition-colors ${activeTab === 'variables' ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    Outputs ({Object.keys(variables).filter(k => k !== 'final_output_format' && !k.endsWith('_result')).length})
                                </button>
                            </div>
                            <button
                                onClick={() => {
                                    if (activeTab === 'logs') {
                                        setLogs([]);
                                    } else {
                                        setVariables({});
                                    }
                                }}
                                className="text-[10px] text-zinc-500 hover:text-zinc-300 px-1 py-0.5"
                            >
                                Clear
                            </button>
                        </div>
                        {activeTab === 'logs' ? (
                            <div className="flex flex-col gap-1 overflow-y-auto max-h-56">
                                {logs.length === 0 ? (
                                    <span className="text-zinc-500 italic">No logs yet. Click "Run Workflow" to execute.</span>
                                ) : (
                                    logs.map((log, idx) => <div key={idx}>{log}</div>)
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 overflow-y-auto max-h-56 select-text">
                                {Object.keys(variables).length === 0 ? (
                                    <span className="text-zinc-500 italic">No variables computed yet.</span>
                                ) : (
                                    <div className="flex flex-col gap-2 w-full">
                                        {variables.final_output !== undefined && (
                                            <div className="bg-emerald-950/40 border border-emerald-900/60 p-2 rounded text-emerald-200 w-full text-left">
                                                <div className="font-bold text-[10px] text-emerald-400 uppercase tracking-wide mb-1">Final Output</div>
                                                <div className="whitespace-pre-wrap font-sans text-xs break-all">{String(variables.final_output)}</div>
                                            </div>
                                        )}
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 text-left">Variables Store</div>
                                        <table className="w-full text-left text-[11px] border-collapse">
                                            <thead>
                                                <tr className="border-b border-zinc-800 text-zinc-500">
                                                    <th className="pb-1 font-semibold pr-2 w-1/3">Variable</th>
                                                    <th className="pb-1 font-semibold">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(variables)
                                                    .filter(([k]) => k !== 'final_output' && k !== 'final_output_format' && !k.endsWith('_result'))
                                                    .map(([k, v]) => (
                                                        <tr key={k} className="border-b border-zinc-800/40 hover:bg-zinc-800/20">
                                                            <td className="py-1.5 font-semibold text-sky-400 align-top pr-2 break-all">{k}</td>
                                                            <td className="py-1.5 text-zinc-300 whitespace-pre-wrap break-all">{String(v)}</td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {toast && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-zinc-900 border border-zinc-700 text-zinc-100 text-xs font-semibold rounded-lg shadow-xl">
                        {toast}
                    </div>
                )}

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeDoubleClick={onNodeDoubleClick}
                    deleteKeyCode={['Backspace', 'Delete']}
                    fitView
                    onNodeClick={onNodeClick}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>

            {isSidebarOpen && selectedNodeData && (
                <aside className="w-72 border-l border-zinc-800 bg-zinc-900 p-4 relative">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-100 text-sm"
                        aria-label="Close sidebar"
                    >
                        ✕
                    </button>
                    <h3 className="text-sm font-semibold mb-3 pr-6">
                        {String(selectedNodeData.data?.label ?? 'Node')}
                    </h3>

                    {(sidebarFieldsByType[getNodeConfigType(selectedNodeData)] || []).map((field) => (
                        <div key={field.key} className="mb-3 text-left">
                            <label className="block text-xs text-zinc-400 mb-1">{field.label}</label>
                            {fieldOptions[field.key] ? (
                                <select
                                    className="w-full rounded bg-zinc-800 px-2 py-1.5 text-white text-sm border border-zinc-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                                    value={String(selectedNodeData.data?.[field.key] ?? fieldOptions[field.key][0].value)}
                                    onChange={(e) => {
                                        setNodes((nds) =>
                                            nds.map((node) =>
                                                node.id === selectedNodeId
                                                    ? {
                                                        ...node,
                                                        data: {
                                                            ...node.data,
                                                            [field.key]: e.target.value,
                                                        },
                                                    }
                                                    : node
                                            )
                                        );
                                    }}
                                >
                                    {fieldOptions[field.key].map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    className="w-full rounded bg-zinc-800 px-2.5 py-1.5 text-white text-sm border border-zinc-750 focus:outline-none focus:border-blue-500"
                                    value={String(selectedNodeData.data?.[field.key] ?? '')}
                                    onChange={(e) => {
                                        setNodes((nds) =>
                                            nds.map((node) =>
                                                node.id === selectedNodeId
                                                    ? {
                                                        ...node,
                                                        data: {
                                                            ...node.data,
                                                            [field.key]: e.target.value,
                                                        },
                                                    }
                                                    : node
                                            )
                                        );
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </aside>
            )}
        </div>
    );
}

export default function Builder() {
    return (
        <ReactFlowProvider>
            <DnDProvider>
                <DnDFlow />
            </DnDProvider>
        </ReactFlowProvider>
    );
}
