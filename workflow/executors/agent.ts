import type { Node } from '@xyflow/react';
import type { WorkflowRuntime } from '../runtime';
import { runAgentTurn } from '../../lib/providers';
import { WORKSHOP_TOOLS } from '../../lib/tools/registry';

export async function executeAgentNode(node: Node, runtime: WorkflowRuntime): Promise<void> {
    const data = node.data || {};
    const agentName = String(data.name || data.label || 'Autonomous Agent');
    const systemPrompt = String(data.systemPrompt || data.prompt || 'You are an autonomous AI agent capable of using tools dynamically to complete user goals.');
    const userPrompt = String(data.inputPrompt || runtime.variables['input'] || runtime.variables['user_input'] || 'Help me analyze and solve this request.');
    const provider = (data.provider as any) || 'gemini';
    const apiKey = (data.apiKey as string) || '';
    const model = (data.model as string) || 'gemini-2.5-flash';

    runtime.logs.push(`[Agent] Initializing Autonomous ReAct Agent "${agentName}"...`);

    // Available tools for agent node
    const availableToolsList = Object.values(WORKSHOP_TOOLS).map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
    }));

    try {
        let turn = 0;
        let currentPrompt = userPrompt;
        let finalAnswer = "";

        while (turn < 3) {
            turn++;
            runtime.logs.push(`[Agent] Reason Step ${turn}: Evaluating query and tool options...`);

            const stepResult = await runAgentTurn({
                provider,
                apiKey,
                model,
                systemInstruction: systemPrompt,
                userPrompt: currentPrompt,
                availableTools: availableToolsList,
            });

            if (stepResult.error) {
                runtime.logs.push(`[Agent Error] ${stepResult.error}`);
                runtime.variables[`${node.id}_error`] = stepResult.error;
                break;
            }

            if (stepResult.toolCalls && stepResult.toolCalls.length > 0) {
                const call = stepResult.toolCalls[0];
                runtime.logs.push(`[Agent Action] Decided to call tool: "${call.name}" with args: ${JSON.stringify(call.arguments)}`);

                const toolImpl = WORKSHOP_TOOLS[call.name] || Object.values(WORKSHOP_TOOLS).find((t) => t.name === call.name);
                if (toolImpl) {
                    const execRes = await toolImpl.execute(call.arguments, {
                        memory: runtime.variables,
                    });
                    runtime.logs.push(`[Agent Observation] Tool "${call.name}" returned: ${execRes.result.substring(0, 150)}...`);
                    currentPrompt += `\n\nTool ${call.name} output: ${execRes.result}`;
                } else {
                    runtime.logs.push(`[Agent Warning] Tool "${call.name}" not found.`);
                    break;
                }
            } else {
                finalAnswer = stepResult.text || "Task complete.";
                runtime.logs.push(`[Agent Response] Final answer generated: "${finalAnswer.substring(0, 120)}..."`);
                break;
            }
        }

        const outputVar = String(data.outputVariable || 'agent_output');
        runtime.variables[outputVar] = finalAnswer;
        runtime.variables[`${node.id}_result`] = finalAnswer;
        runtime.variables['final_output'] = finalAnswer;
        runtime.logs.push(`[Agent] Output saved to variable "${outputVar}".`);
    } catch (err) {
        runtime.logs.push(`[Agent Failure] ${(err as Error).message}`);
    }
}
