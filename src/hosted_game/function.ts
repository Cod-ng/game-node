
// File: Function.ts
import axios, { AxiosRequestConfig } from "axios";
import { v4 as uuidv4 } from "uuid";

export interface FunctionConfig {
    method?: string;
    url?: string;
    headers?: Record<string, any>;
    payload?: Record<string, any>;
    success_feedback?: string;
    error_feedback?: string;
    isMainLoop?: boolean;
    isReaction?: boolean;
    headersString?: string;
    payloadString?: string;
    platform?: string;
}

export class FunctionConfigImpl implements FunctionConfig {
    headers: Record<string, any>;
    payload: Record<string, any>;
    headersString: string;
    payloadString: string;

    constructor(
        public method: string = "GET",
        public url: string = "",
        headers: Record<string, any> = {},
        payload: Record<string, any> = {},
        public successFeedback: string = "",
        public errorFeedback: string = "",
        public isMainLoop: boolean = false,
        public isReaction: boolean = false,
        public platform?: string
    ) {
        this.headers = headers;
        this.payload = payload;
        this.headersString = JSON.stringify(headers, null, 4);
        this.payloadString = JSON.stringify(payload, null, 4);
    }
}

export interface GameFunctionArg {
    name: string;
    description: string;
    type: string;
    id?: string;
}

export class GameFunctionArgImpl implements GameFunctionArg {
    id: string;

    constructor(
        public name: string,
        public description: string,
        public type: string,
        id?: string
    ) {
        this.id = id || uuidv4();
    }
}

export type ExecutableGameFunction = {
    fn_name: string;
    fn_description: string;
    args: GameFunctionArg[];
    config: FunctionConfig;
    hint?: string;
    id?: string;
    // toJson(): Record<string, any>;
}

// export type GameFunctionBase = {
//   name: string;
//   description: string;
//   args: GameFunctionArg[];
//   executable: (
//     args: Record<string, string>,
//     logger: (msg: string) => void
//   ) => Promise<ExecutableGameFunctionResponse>;
//   hint?: string;
//   execute: (
//     args: Record<string, { value: string }>,
//     logger: (msg: string) => void
//   ) => Promise<ExecutableGameFunctionResponse>;
//   toJSON(): Object;
// };

export class ExecutableGameFunctionImpl implements ExecutableGameFunction {
    id: string;

    constructor(
        public fn_name: string,
        public fn_description: string,
        public args: GameFunctionArg[],
        public config: FunctionConfig,
        public hint: string = "",
        id?: string
    ) {
        this.id = id || uuidv4();
    }

    toJson(): Record<string, any> {
        return {
            id: this.id,
            fn_name: this.fn_name,
            fn_description: this.fn_description,
            args: this.args,
            hint: this.hint,
            config: this.config,
        };
    }

    private validateArgs(args: any[]): Record<string, any> {
        if (args.length !== this.args.length) {
            throw new Error(`Expected ${this.args.length} arguments, got ${args.length}`);
        }

        const argDict: Record<string, any> = {};
        this.args.forEach((argDef, index) => {
            const value = args[index];

            if (argDef.type === "string" && typeof value !== "string") {
                throw new TypeError(`Argument ${argDef.name} must be a string`);
            } else if (argDef.type === "array" && !Array.isArray(value)) {
                throw new TypeError(`Argument ${argDef.name} must be an array`);
            }

            argDict[argDef.name] = value;
        });

        return argDict;
    }

    private interpolateTemplate(templateStr: string, values: Record<string, any>): string {
        return templateStr.replace(/\{\{(.*?)\}\}/g, (_, key) => values[key.trim()] || "");
    }

    private prepareRequest(argDict: Record<string, any>): AxiosRequestConfig {
        const { method, url, headers, payload } = this.config;
        const interpolatedUrl = this.interpolateTemplate(url || "", argDict);

        const interpolatedPayload: Record<string, any> = {};
        Object.entries(payload || {}).forEach(([key, value]) => {
            if (typeof value === "string") {
                interpolatedPayload[key] = this.interpolateTemplate(value, argDict);
            } else {
                interpolatedPayload[key] = value;
            }
        });

        return {
            method: method || "get",
            url: interpolatedUrl,
            headers,
            data: interpolatedPayload,
        };
    }

    async excute(...args: any[]): Promise<any> {
        const argDict = this.validateArgs(args);
        const requestConfig = this.prepareRequest(argDict);

        try {
            const response = await axios(requestConfig);
            if (response.status >= 200 && response.status < 300) {
                if (this.config.success_feedback) {
                    console.log(this.interpolateTemplate(this.config.success_feedback, { ...argDict, response: response.data }));
                }
                return response.data;
            }
        } catch (error: any) {
            const errorMsg = error.response?.data || error.message;
            if (this.config.error_feedback) {
                console.log(this.interpolateTemplate(this.config.error_feedback, { ...argDict, response: errorMsg }));
            }
            throw new Error(`Request failed: ${JSON.stringify(errorMsg)}`);
        }
    }
}
