
// File: Agent.ts
import GameClient from "../plugins/game/gameClient";
import { Function } from "./function";

export class Agent {
    private enabledFunctions: string[] = [];
    private customFunctions: Function[] = [];
    private gameSdk: GameClient;
    constructor(
        private apiKey: string,
        private goal: string = "",
        private description: string = "",
        private worldInfo: string = "",
        private mainHeartbeat: number = 15,
        private reactionHeartbeat: number = 5
    ) {
        this.gameSdk = new GameClient(apiKey);
    }

    setGoal(goal: string): void {
        this.goal = goal;
    }

    setDescription(description: string): void {
        this.description = description;
    }

    setWorldInfo(worldInfo: string): void {
        this.worldInfo = worldInfo;
    }

    setMainHeartbeat(mainHeartbeat: number): void {
        this.mainHeartbeat = mainHeartbeat;
    }

    setReactionHeartbeat(reactionHeartbeat: number): void {
        this.reactionHeartbeat = reactionHeartbeat;
    }

    getGoal(): string {
        return this.goal;
    }

    getDescription(): string {
        return this.description;
    }

    getWorldInfo(): string {
        return this.worldInfo;
    }

    async listAvailableDefaultTwitterFunctions(): Promise<Record<string, string>> {
        return await this.gameSdk.getFunctions();
    }

    useDefaultTwitterFunctions(functions: string[]): void {
        this.enabledFunctions = functions;
    }

    addCustomFunction(customFunction: Function): void {
        this.customFunctions.push(customFunction);
    }


    simulateTwitter(sessionId: string): any {
        return this.gameSdk.simulate({
            sessionId: sessionId,
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.enabledFunctions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
        });
    }

    react(
        sessionId: string,
        platform: string,
        tweetId: string | undefined = undefined,
        event: string | undefined = undefined,
        task: string | undefined = undefined
    ): any {
        return this.gameSdk.react({
            sessionId: sessionId,
            platform: platform,
            event: event,
            task: task,
            tweetId: tweetId,
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.enabledFunctions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
        });
    }


    /**
    * Deploy the agent configuration for Twitter.
    */
    deployTwitter(): any {
        return this.gameSdk.deploy({
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.enabledFunctions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
            mainHeartbeat: this.mainHeartbeat,
            reactionHeartbeat: this.reactionHeartbeat,
        });
    }

    export(): string {
        const exportData = {
            goal: this.goal,
            description: this.description,
            worldInfo: this.worldInfo,
            functions: this.enabledFunctions,
            customFunctions: this.customFunctions.map((func) => func.toJson()),
        };

        const exportJson = JSON.stringify(exportData, null, 4);
        return exportJson;
    }
}