import { apiRequest } from "../../util/api";
import { DeployArgs, ReactArgs, SimulateArgs } from "./request";

class GameClient {
    private apiUrl: string = "https://game-api.virtuals.io/api";
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * Get all default functions.
     * @returns Promise resolving to a map of function names and descriptions.
     */
    async getFunctions(): Promise<{ [key: string]: string }> {
        const url = `${this.apiUrl}/functions`;
        try {
            const response: any = await apiRequest({
                method: "GET",
                url,
                headers: { "x-api-key": this.apiKey },
            });

            const functions: { [key: string]: string } = {};
            response.data.data.forEach((fn: { fn_name: string; fn_description: string }) => {
                functions[fn.fn_name] = fn.fn_description;
            });

            return functions;
        } catch (error: any) {
            console.error("Failed to fetch functions:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Simulate the agent configuration.
     * @param args Simulation parameters
     * @returns Promise resolving to simulation result data.
     */
    async simulate(args: SimulateArgs): Promise<any> {
        const url = `${this.apiUrl}/simulate`;
        try {
            const response: any = await apiRequest({
                method: "POST",
                url,
                headers: { "x-api-key": this.apiKey },
                data: {
                    data: {
                        sessionId: args.sessionId,
                        goal: args.goal,
                        description: args.description,
                        worldInfo: args.worldInfo,
                        functions: args.functions,
                        customFunctions: args.customFunctions.map((fn) => fn.toJson()),
                    },
                },
            });

            return response.data.data;
        } catch (error: any) {
            console.error("Failed to simulate configuration:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * React to an event in a platform.
     * @param args Reaction parameters
     * @returns Promise resolving to reaction result data.
     */
    async react(args: ReactArgs): Promise<any> {
        const url = `${this.apiUrl}/react/${args.platform}`;
        const payload: any = {
            sessionId: args.sessionId,
            goal: args.goal,
            description: args.description,
            worldInfo: args.worldInfo,
            functions: args.functions,
            customFunctions: args.customFunctions.map((fn) => fn.toJson()),
        };

        if (args.event) {
            payload.event = args.event;
        }
        if (args.task) {
            payload.task = args.task;
        }
        if (args.tweetId) {
            payload.tweetId = args.tweetId;
        }

        try {
            const response: any = await apiRequest({
                method: "POST",
                url,
                headers: { "x-api-key": this.apiKey },
                data: { data: payload },
            });

            return response.data.data;
        } catch (error: any) {
            console.error("Failed to react:", error.response?.data || error.message);
            throw error;
        }
    }

    /**
     * Deploy an agent configuration.
     * @param args Deployment parameters
     * @returns Promise resolving to deployment result data.
     */
    async deploy(args: DeployArgs): Promise<any> {
        const url = `${this.apiUrl}/deploy`;
        try {
            const response: any = await apiRequest({
                method: "POST",
                url,
                headers: { "x-api-key": this.apiKey },
                data: {
                    data: {
                        goal: args.goal,
                        description: args.description,
                        worldInfo: args.worldInfo,
                        functions: args.functions,
                        customFunctions: args.customFunctions,
                        gameState: {
                            mainHeartbeat: args.mainHeartbeat,
                            reactionHeartbeat: args.reactionHeartbeat,
                        },
                    },
                },
            });

            return response.data.data;
        } catch (error: any) {
            console.error("Failed to deploy configuration:", error.response?.data || error.message);
            throw error;
        }
    }
}

export default GameClient;
