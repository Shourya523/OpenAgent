"use client"
import React, { useCallback, useRef, useEffect, useState } from 'react';
import {
    ReactFlow,
    ReactFlowProvider,
    addEdge,
    useNodesState,
    useEdgesState,
    Controls,
    useReactFlow,
    Background,
    Handle,
    Position,
    type Connection,
    type Node,
    type Edge
} from '@xyflow/react';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
import { executeWorkflow } from '../workflow/executeWorkFlows';
import { Play, Terminal as TerminalIcon, Trash2, Save, RotateCcw, X, Settings, Activity, Sparkles, Cpu, Database, GitFork, Download, Link2 } from "lucide-react";
import "@xyflow/react/dist/style.css";

const STORAGE_KEY = 'openagent-flow-state';

let id = 0;
const getId = () => `dndnode_${id++}`;

const initialNodes: Node[] = [
    { id: 'n1', position: { x: 320, y: 120 }, data: { label: 'Start' } },
    { id: 'n2', position: { x: 320, y: 300 }, data: { label: 'Finish' } },
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
    method: [
        { value: "GET", label: "GET" },
        { value: "POST", label: "POST" },
        { value: "PUT", label: "PUT" },
        { value: "DELETE", label: "DELETE" },
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
        { key: "apiKey", label: "Custom Gemini API Key" },
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

    api: [
        { key: "name", label: "Node Name" },
        { key: "method", label: "HTTP Method" },
        { key: "url", label: "API Endpoint URL (e.g. https://api.example.com/{{var}})" },
        { key: "headers", label: "Headers JSON (e.g. {\"Authorization\": \"Bearer {{var}}\"})" },
        { key: "payload", label: "Payload JSON (optional)" },
        { key: "outputVariable", label: "Output Variable Name" },
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
    if (label.includes('api')) return 'api';

    return typeof node?.type === 'string' ? node.type : 'default';
};

// ── Custom Node Components for React Flow (Glow & Glassmorphic Aesthetic) ────────────────
const CustomInputNode = ({ data, selected }: { data: any; selected?: boolean }) => {
    return (
        <div className={`px-4.5 py-3 rounded-2xl bg-zinc-950/85 border text-left min-w-[170px] transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
            selected 
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-102' 
                : 'border-zinc-900 hover:border-emerald-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
        }`}>
            {/* Thematic Background Spotlight */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/5 blur-xl rounded-full pointer-events-none z-0" />
            {/* Left indicator accent strip */}
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-emerald-500 rounded-r-md z-10" />

            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-zinc-900/60 select-none relative z-10">
                <Play className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                <span className="text-[9px] font-mono font-black text-emerald-400 tracking-widest uppercase">INPUT</span>
            </div>
            <div className="text-xs font-bold text-zinc-200 truncate relative z-10">{data.label}</div>
            
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className="!w-2.5 !h-2.5 !bg-emerald-500 !border-2 !border-zinc-950 !rounded-full !bottom-[-5px] !shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
            />
        </div>
    );
};

const CustomDefaultNode = ({ data, selected }: { data: any; selected?: boolean }) => {
    const nodeType = typeof data.nodeType === 'string' ? data.nodeType : 'default';

    let colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-sky-500/40";
    let activeColorClass = "border-sky-500 ring-2 ring-sky-500/20 shadow-[0_0_20px_rgba(14,165,233,0.3)] scale-102";
    let label = "PROMPT";
    let Icon = TerminalIcon;
    let labelColor = "text-sky-400";
    let handleColor = "!bg-sky-500";
    let indicatorBg = "bg-sky-500";
    let glowBg = "bg-sky-500/5";
    let handleShadow = "!shadow-[0_0_8px_rgba(14,165,233,0.6)]";

    if (nodeType === 'llm') {
        colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-purple-500/40";
        activeColorClass = "border-purple-500 ring-2 ring-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-102";
        label = "GEMINI LLM";
        Icon = Sparkles;
        labelColor = "text-purple-400";
        handleColor = "!bg-purple-500";
        indicatorBg = "bg-purple-500";
        glowBg = "bg-purple-500/5";
        handleShadow = "!shadow-[0_0_8px_rgba(168,85,247,0.6)]";
    } else if (nodeType === 'tool') {
        colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-amber-500/40";
        activeColorClass = "border-amber-500 ring-2 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.3)] scale-102";
        label = "TOOL CALL";
        Icon = Cpu;
        labelColor = "text-amber-400";
        handleColor = "!bg-amber-500";
        indicatorBg = "bg-amber-500";
        glowBg = "bg-amber-500/5";
        handleShadow = "!shadow-[0_0_8px_rgba(245,158,11,0.6)]";
    } else if (nodeType === 'memory') {
        colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-teal-500/40";
        activeColorClass = "border-teal-500 ring-2 ring-teal-500/20 shadow-[0_0_20px_rgba(13,148,136,0.3)] scale-102";
        label = "MEMORY";
        Icon = Database;
        labelColor = "text-teal-400";
        handleColor = "!bg-teal-500";
        indicatorBg = "bg-teal-500";
        glowBg = "bg-teal-500/5";
        handleShadow = "!shadow-[0_0_8px_rgba(13,148,136,0.6)]";
    } else if (nodeType === 'condition') {
        colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-rose-500/40";
        activeColorClass = "border-rose-500 ring-2 ring-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.3)] scale-102";
        label = "CONDITION";
        Icon = GitFork;
        labelColor = "text-rose-400";
        handleColor = "!bg-rose-500";
        indicatorBg = "bg-rose-500";
        glowBg = "bg-rose-500/5";
        handleShadow = "!shadow-[0_0_8px_rgba(244,63,94,0.6)]";
    } else if (nodeType === 'api') {
        colorClass = "border-zinc-900 shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:border-orange-500/40";
        activeColorClass = "border-orange-500 ring-2 ring-orange-500/20 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-102";
        label = "API CONNECTOR";
        Icon = Link2;
        labelColor = "text-orange-400";
        handleColor = "!bg-orange-500";
        indicatorBg = "bg-orange-500";
        glowBg = "bg-orange-500/5";
        handleShadow = "!shadow-[0_0_8px_rgba(249,115,22,0.6)]";
    }

    return (
        <div className={`px-4.5 py-3 rounded-2xl bg-zinc-950/85 border text-left min-w-[170px] transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
            selected ? activeColorClass : colorClass
        }`}>
            {/* Thematic Background Spotlight */}
            <div className={`absolute top-0 right-0 w-12 h-12 blur-xl rounded-full pointer-events-none z-0 ${glowBg}`} />
            {/* Left indicator accent strip */}
            <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-r-md z-10 ${indicatorBg}`} />

            <Handle 
                type="target" 
                position={Position.Top} 
                className={`!w-2.5 !h-2.5 !border-2 !border-zinc-950 !rounded-full !top-[-5px] ${handleColor} ${handleShadow}`} 
            />
            
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-zinc-900/60 select-none relative z-10">
                <Icon className={`w-3.5 h-3.5 ${labelColor}`} />
                <span className={`text-[9px] font-mono font-black ${labelColor} tracking-widest uppercase`}>{label}</span>
            </div>
            <div className="text-xs font-bold text-zinc-200 truncate relative z-10">{data.label}</div>
            
            <Handle 
                type="source" 
                position={Position.Bottom} 
                className={`!w-2.5 !h-2.5 !border-2 !border-zinc-950 !rounded-full !bottom-[-5px] ${handleColor} ${handleShadow}`} 
            />
        </div>
    );
};

const CustomOutputNode = ({ data, selected }: { data: any; selected?: boolean }) => {
    return (
        <div className={`px-4.5 py-3 rounded-2xl bg-zinc-950/85 border text-left min-w-[170px] transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
            selected 
                ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] scale-102' 
                : 'border-zinc-900 hover:border-indigo-500/40 shadow-[0_4px_12px_rgba(0,0,0,0.5)]'
        }`}>
            {/* Thematic Background Spotlight */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-500/5 blur-xl rounded-full pointer-events-none z-0" />
            {/* Left indicator accent strip */}
            <div className="absolute left-0 top-3 bottom-3 w-[3px] bg-indigo-500 rounded-r-md z-10" />

            <Handle 
                type="target" 
                position={Position.Top} 
                className="!w-2.5 !h-2.5 !bg-indigo-500 !border-2 !border-zinc-950 !rounded-full !top-[-5px] !shadow-[0_0_8px_rgba(99,102,241,0.6)]" 
            />
            <div className="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-zinc-900/60 select-none relative z-10">
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[9px] font-mono font-black text-indigo-400 tracking-widest uppercase">OUTPUT</span>
            </div>
            <div className="text-xs font-bold text-zinc-200 truncate relative z-10">{data.label}</div>
        </div>
    );
};

function DnDFlow() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const nodeTypes = React.useMemo(() => ({
        input: CustomInputNode,
        default: CustomDefaultNode,
        output: CustomOutputNode,
    }), []);
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
    const editingNode = (nodes.find((node) => node.id === editingNodeId) as
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
        setEditingNodeId(node.id);
        setIsModalOpen(true);
    }, []);

    const updateEditingNodeData = useCallback((key: string, value: string) => {
        if (!editingNodeId) return;
        setNodes((nds) =>
            nds.map((node) =>
                node.id === editingNodeId
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            [key]: value,
                        },
                    }
                    : node
            )
        );
    }, [editingNodeId, setNodes]);

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
        <div className="w-full h-[64vh] min-h-[500px] border border-zinc-900 rounded-2xl overflow-hidden bg-zinc-950 relative shadow-2xl">
            <Sidebar />
            <div className="w-full h-full relative" ref={reactFlowWrapper}>
                {/* Control Action Bar */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap items-center gap-2 bg-zinc-950/85 backdrop-blur-md border border-zinc-900/80 rounded-xl p-1.5 shadow-2xl select-none">
                    <button
                        onClick={runWorkflow}
                        disabled={isRunning}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer ${isRunning
                            ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30 cursor-not-allowed animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                            : 'bg-emerald-950/30 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 hover:text-white shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                            }`}
                    >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        {isRunning ? 'Running...' : 'Run Flow'}
                    </button>

                    <button
                        onClick={() => setShowLogs((prev) => !prev)}
                        className={`px-3.5 py-1.5 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${showLogs
                            ? 'bg-zinc-800 border-zinc-700 text-white shadow-inner shadow-black/45'
                            : 'bg-zinc-950/60 hover:bg-zinc-900 border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        <TerminalIcon className="w-3.5 h-3.5" />
                        {showLogs ? 'Hide Logs' : 'Console'}
                    </button>

                    {selectedNode && (
                        <div className="flex items-center gap-1.5 bg-zinc-900/40 border border-zinc-900 px-2.5 py-1 rounded-lg">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Rename:</span>
                            <input
                                type="text"
                                value={(selectedNode.data?.label as string) || ''}
                                onChange={handleLabelChange}
                                className="bg-zinc-900 text-zinc-150 text-xs px-2 py-0.5 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 w-28 font-medium"
                                placeholder="Node Label"
                            />
                        </div>
                    )}

                    {hasSelection && (
                        <button
                            onClick={handleDeleteSelection}
                            className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-650 border border-red-900/45 hover:border-red-500/50 text-red-400 hover:text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Delete selected nodes/edges"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete ({selectedNodes.length + selectedEdges.length})
                        </button>
                    )}

                    <div className="w-px h-6 bg-zinc-900 mx-1" />

                    <button
                        onClick={handleSave}
                        className="px-3.5 py-1.5 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-lg border border-zinc-900 hover:border-zinc-800 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <Save className="w-3.5 h-3.5" />
                        Save
                    </button>
                    <button
                        onClick={handleRestore}
                        className="px-3.5 py-1.5 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-bold rounded-lg border border-zinc-900 hover:border-zinc-800 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
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
                    nodeTypes={nodeTypes}
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>

            {isSidebarOpen && selectedNodeData && (
                <aside className="absolute top-4 right-4 bottom-4 z-20 w-72 p-5 bg-zinc-950/85 backdrop-blur-md border border-zinc-900/80 rounded-xl text-zinc-150 flex flex-col gap-4 select-none shadow-2xl overflow-y-auto scrollbar-thin text-left">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-sm cursor-pointer transition-colors p-1 hover:bg-zinc-900 rounded-md"
                        aria-label="Close sidebar"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-900 mt-2">
                        <Settings className="w-4 h-4 text-zinc-400" />
                        <h3 className="text-sm font-bold text-zinc-100 truncate pr-6">
                            {String(selectedNodeData.data?.label ?? 'Node Settings')}
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3.5">
                        {(sidebarFieldsByType[getNodeConfigType(selectedNodeData)] || []).map((field) => (
                            <div key={field.key} className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{field.label}</label>
                                {fieldOptions[field.key] ? (
                                    <select
                                        className="w-full rounded-xl bg-zinc-900/60 px-3 py-2 text-zinc-200 text-xs border border-zinc-850 hover:border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
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
                                            <option key={opt.value} value={opt.value} className="bg-zinc-950 text-zinc-300">
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        className="w-full rounded-xl bg-zinc-900/60 px-3 py-2 text-zinc-200 text-xs border border-zinc-850 hover:border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors font-medium"
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
                    </div>
                </aside>
            )}

            {/* Glassmorphic Settings Modal Popup Triggered on Double Click */}
            {isModalOpen && editingNode && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
                    <div className="bg-zinc-950 border border-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative flex flex-col gap-4 text-left animate-in zoom-in-95 duration-200">
                        {/* Close button */}
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-200 text-sm cursor-pointer transition-colors p-1 hover:bg-zinc-900 rounded-md"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-2 pb-2 border-b border-zinc-900">
                            <Settings className="w-4 h-4 text-cyan-400" />
                            <h3 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">
                                {String(editingNode.data?.label ?? 'Node Settings')}
                            </h3>
                        </div>

                        <div className="flex flex-col gap-4 overflow-y-auto max-h-[50vh] pr-1 py-1">
                            {(sidebarFieldsByType[getNodeConfigType(editingNode)] || []).map((field) => (
                                <div key={field.key} className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{field.label}</label>
                                    {fieldOptions[field.key] ? (
                                        <select
                                            className="w-full rounded-xl bg-zinc-900/60 px-3 py-2.5 text-zinc-200 text-xs border border-zinc-850 hover:border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors cursor-pointer"
                                            value={String(editingNode.data?.[field.key] ?? fieldOptions[field.key][0].value)}
                                            onChange={(e) => updateEditingNodeData(field.key, e.target.value)}
                                        >
                                            {fieldOptions[field.key].map((opt) => (
                                                <option key={opt.value} value={opt.value} className="bg-zinc-950 text-zinc-300">
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.key === 'apiKey' ? (
                                        <input
                                            type="password"
                                            className="w-full rounded-xl bg-zinc-900/60 px-3 py-2.5 text-zinc-200 text-xs border border-zinc-850 hover:border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors font-medium font-mono"
                                            placeholder="Enter Gemini API Key (Optional)"
                                            value={String(editingNode.data?.[field.key] ?? '')}
                                            onChange={(e) => updateEditingNodeData(field.key, e.target.value)}
                                        />
                                    ) : (
                                        <input
                                            className="w-full rounded-xl bg-zinc-900/60 px-3 py-2.5 text-zinc-200 text-xs border border-zinc-850 hover:border-zinc-800 focus:outline-none focus:border-zinc-700 transition-colors font-medium"
                                            value={String(editingNode.data?.[field.key] ?? '')}
                                            onChange={(e) => updateEditingNodeData(field.key, e.target.value)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end pt-2 border-t border-zinc-900 mt-1">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-550 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                            >
                                Apply Changes
                            </button>
                        </div>
                    </div>
                </div>
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
