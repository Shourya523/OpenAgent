export interface WorkflowRuntime {
  variables: Record<string, any>;
  logs: string[];
}

export function createRuntime(): WorkflowRuntime {
  return {
    variables: {},
    logs: [],
  };
}