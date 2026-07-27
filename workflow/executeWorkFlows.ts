import type { Edge, Node } from '@xyflow/react';
import { createRuntime } from './runtime';
import { executeNode, getNodeConfigType } from './executeNode';

export interface WorkflowExecutionOptions {
    nodes: Node[];
    edges: Edge[];
    setNodes: (updater: (currentNodes: Node[]) => Node[]) => void;
    setEdges: (updater: (currentEdges: Edge[]) => Edge[]) => void;
    setIsRunning: (value: boolean) => void;
    setShowLogs: (value: boolean) => void;
    addLog: (message: string) => void;
    showToast: (message: string) => void;
    setVariables?: (variables: Record<string, any>) => void;
}

export async function executeWorkflow({
    nodes,
    edges,
    setNodes,
    setEdges,
    setIsRunning,
    setShowLogs,
    addLog,
    showToast,
    setVariables,
}: WorkflowExecutionOptions) {
    const runtime = createRuntime();
    setIsRunning(true);
    setShowLogs(true);
    addLog('Starting workflow execution...');

    if (setVariables) {
        setVariables({});
    }

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
        if (!currentNode) continue;

        const nodeLabel = (currentNode.data?.label as string) || currentNodeId;

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

        await new Promise((resolve) => setTimeout(resolve, 1000));

        setNodes((nds) =>
            nds.map((n) =>
                n.id === currentNodeId
                    ? { ...n, className: '!border-emerald-500 !shadow-[0_0_15px_rgba(16,185,129,0.6)]' }
                    : n
            )
        );

        // Execute node logic
        const logsBefore = runtime.logs.length;
        await executeNode(currentNode, runtime);

        // Propagate any new runtime logs from the executors to the UI logs
        if (runtime.logs.length > logsBefore) {
            for (let i = logsBefore; i < runtime.logs.length; i++) {
                addLog(runtime.logs[i]);
            }
        }

        // Update real-time variables in the frontend
        if (setVariables) {
            setVariables({ ...runtime.variables });
        }

        addLog(`Completed node: "${nodeLabel}"`);

        const configType = getNodeConfigType(currentNode);
        const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

        if (configType === "condition") {
            const conditionResult = !!runtime.variables[`${currentNodeId}_result`];
            const targetLabel = conditionResult ? "true" : "false";

            // Find edges matching the label (case insensitive)
            const matchingEdges = outgoingEdges.filter((e) => {
                const label = String(e.label ?? "").toLowerCase().trim();
                return (
                    label === targetLabel ||
                    (conditionResult && label === "yes") ||
                    (!conditionResult && label === "no")
                );
            });

            // Fallback to all outgoing if no specific true/false branch is configured
            const edgesToFollow = matchingEdges.length > 0 ? matchingEdges : outgoingEdges;
            for (const edge of edgesToFollow) {
                queue.push(edge.target);
            }

            // Update edge animations to show the followed branch path visually
            const followedTargetIds = new Set(edgesToFollow.map((e) => e.target));
            setEdges((eds) =>
                eds.map((e) =>
                    e.source === currentNodeId
                        ? { ...e, animated: followedTargetIds.has(e.target) }
                        : e
                )
            );
        } else {
            for (const edge of outgoingEdges) {
                queue.push(edge.target);
            }
        }
    }

    setIsRunning(false);
    addLog('Workflow execution finished successfully.');
    
    const finalOutput = runtime.variables["final_output"];
    if (finalOutput !== undefined) {
        addLog(`Final output variable matches: "${finalOutput}"`);
    }

    showToast('Workflow execution completed!');
}
