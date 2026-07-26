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
    type Connection,
    type Node,
    type Edge
} from '@xyflow/react';

import Sidebar from './Sidebar';
import { DnDProvider, useDnD } from './DnDContext';
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

    const showToast = (msg: string) => {
        setToast(msg);
        setTimeout(() => setToast(null), 2500);
    };

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    const runWorkflow = async () => {
        if (isRunning || nodes.length === 0) return;

        setIsRunning(true);
        setShowLogs(true);
        setLogs([]);
        addLog("Starting workflow execution...");

        setNodes((nds) => nds.map((n) => ({ ...n, className: undefined })));
        setEdges((eds) => eds.map((e) => ({ ...e, animated: false })));

        const incomingTargets = new Set(edges.map((e) => e.target));
        let startNodes = nodes.filter((n) => !incomingTargets.has(n.id));
        if (startNodes.length === 0) startNodes = [nodes[0]];

        const queue = [...startNodes.map((n) => n.id)];
        const visited = new Set<string>();

        while (queue.length > 0) {
            const currentNodeId = queue.shift()!;
            if (visited.has(currentNodeId)) continue;
            visited.add(currentNodeId);

            const currentNode = nodes.find((n) => n.id === currentNodeId);
            const nodeLabel = (currentNode?.data?.label as string) || currentNodeId;

            addLog(`Running node: "${nodeLabel}"`);

            setNodes((nds) =>
                nds.map((n) =>
                    n.id === currentNodeId
                        ? { ...n, className: '!border-blue-500 !shadow-[0_0_15px_rgba(59,130,246,0.7)]' }
                        : n
                )
            );

            setEdges((eds) =>
                eds.map((e) => (e.source === currentNodeId ? { ...e, animated: true } : e))
            );

            await new Promise((resolve) => setTimeout(resolve, 1200));

            setNodes((nds) =>
                nds.map((n) =>
                    n.id === currentNodeId
                        ? { ...n, className: '!border-emerald-500 !shadow-[0_0_15px_rgba(16,185,129,0.6)]' }
                        : n
                )
            );

            addLog(`Completed node: "${nodeLabel}"`);

            const outgoingEdges = edges.filter((e) => e.source === currentNodeId);
            for (const edge of outgoingEdges) {
                queue.push(edge.target);
            }
        }

        setIsRunning(false);
        addLog("Workflow execution finished successfully.");
        showToast("Workflow execution completed!");
    };

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

            const newNode = {
                id: getId(),
                type: nodeType,
                position,
                data: { label: nodeLabel },
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
                        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer ${
                            isRunning
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
                    <div className="absolute bottom-4 left-4 z-20 w-80 max-h-48 bg-zinc-900/95 border border-zinc-800 rounded-lg p-3 shadow-2xl backdrop-blur overflow-y-auto text-xs font-mono text-zinc-300 flex flex-col gap-1">
                        <div className="flex justify-between items-center pb-1 mb-1 border-b border-zinc-800 font-semibold text-zinc-400">
                            <span>Execution Logs</span>
                            <button
                                onClick={() => setLogs([])}
                                className="text-[10px] text-zinc-500 hover:text-zinc-300"
                            >
                                Clear
                            </button>
                        </div>
                        {logs.length === 0 ? (
                            <span className="text-zinc-500 italic">No logs yet. Click "Run Workflow" to execute.</span>
                        ) : (
                            logs.map((log, idx) => <div key={idx}>{log}</div>)
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
                >
                    <Background />
                    <Controls />
                </ReactFlow>
            </div>
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
