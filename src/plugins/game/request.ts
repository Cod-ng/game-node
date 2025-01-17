// Interface for the function fetching response
export interface FunctionData {
    fn_name: string;
    fn_description: string;
}

// Interface for the `simulate` method parameters
export interface SimulateArgs {
    sessionId: string;
    goal: string;
    description: string;
    worldInfo: string;
    functions: string[];
    customFunctions: any[];
}

// Interface for the `react` method parameters
export interface ReactArgs {
    sessionId: string;
    platform: string;
    goal: string;
    description: string;
    worldInfo: string;
    functions: string[];
    customFunctions: any[];
    event?: string;
    task?: string;
    tweetId?: string;
}

// Interface for the `deploy` method parameters
export interface DeployArgs {
    goal: string;
    description: string;
    worldInfo: string;
    functions: string[];
    customFunctions: any[];
    mainHeartbeat: number;
    reactionHeartbeat: number;
}
