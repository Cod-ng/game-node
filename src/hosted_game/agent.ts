
// File: Agent.ts
import GameClient from "../plugins/game/gameClient";
import { Function } from "./function";

interface IHostedGameAgent {
    name: string;
    goal: string;
    description: string;
    // workerId: string;
    worldInfo: string;
    functions: string[];
    customFunctions: any[];
    mainHeartbeat: number;
    reactionHeartbeat: number;
    // workers: GameWorker[];
    // getAgentState?: () => Promise<Record<string, any>>;
}


class HostedGameAgent implements IHostedGameAgent {

    public name: string;
    public goal: string;
    public description: string;
    public worldInfo: string = "";
    public functions: string[] = [];
    public customFunctions: any[] = [];
    public mainHeartbeat: number = 15;
    public reactionHeartbeat: number = 5;
    public gameClient: GameClient;

    constructor(apiKey: string, options: IHostedGameAgent) {
        this.gameClient = new GameClient(apiKey);
        // this.workerId = options.workers[0].id;

        this.name = options.name;
        this.goal = options.goal;
        this.description = options.description;
        // this.workers = options.workers;
        // this.getAgentState = options.getAgentState;
    }

    async init() {
        // const map = await this.gameClient.createMap(this.workers);
        // const agent = await this.gameClient.createAgent(
        //     this.name,
        //     this.goal,
        //     this.description
        // );

        // this.workers.forEach((worker) => {
        //     worker.setAgentId(agent.id);
        //     worker.setLogger(this.log.bind(this));
        //     worker.setGameClient(this.gameClient);
        // });

        // this.mapId = map.id;
        // this.agentId = agent.id;
    }

    // private enabledFunctions: string[] = [];
    // private customFunctions: Function[] = [];
    // private gameSdk: GameClient;
    // constructor(
    //     private apiKey: string,
    //     private worldInfo: string = "",
    //     private mainHeartbeat: number = 15,
    //     private reactionHeartbeat: number = 5
    // ) {
    //     this.gameSdk = new GameClient(apiKey);
    // }

    setGoal(goal: string): void {
        this.goal = goal;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    /**
     * List all of the default functions (currently default functions are only available for Twitter/X platform)
     * @returns 
     */
    async listAvailableDefaultTwitterFunctions(): Promise<Record<string, string>> {
        return await this.gameClient.getFunctions();
    }

    /**
     * Enable built-in functions by default
     * @param functions 
     */
    useDefaultTwitterFunctions(functions: string[]): void {
        this.functions = functions;
    }

    /**
     * Add a custom function to the agent
     * Custom functions are automatically added and enabled
     * @param customFunction 
     */
    addCustomFunction(customFunction: Function): void {
        this.customFunctions.push(customFunction);
    }

    /**
     * Simulate the agent configuration for Twitter
     * @param sessionId 
     * @returns 
     */
    simulateTwitter(sessionId: string): any {
        return this.gameClient.simulate({
            sessionId: sessionId,
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.functions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
        });
    }

    /**
     * React to a tweet
     * @param sessionId 
     * @param platform 
     * @param tweetId 
     * @param event 
     * @param task 
     * @returns 
     */
    react(
        sessionId: string,
        platform: string,
        tweetId: string | undefined = undefined,
        event: string | undefined = undefined,
        task: string | undefined = undefined
    ): any {
        return this.gameClient.react({
            sessionId: sessionId,
            platform: platform,
            event: event,
            task: task,
            tweetId: tweetId,
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.functions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
        });
    }

    /**
    * Deploy the agent configuration for Twitter.
    */
    deployTwitter(): any {
        return this.gameClient.deploy({
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.functions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
            mainHeartbeat: this.mainHeartbeat,
            reactionHeartbeat: this.reactionHeartbeat,
        });
    }
}

export default HostedGameAgent;