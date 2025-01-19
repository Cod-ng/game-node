
// File: Function.ts
import axios, { AxiosRequestConfig } from "axios";
import { FunctionConfig } from "./functionConfig";
import { v4 as uuidv4 } from "uuid";


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

export interface Function {
    fnName: string;
    fnDescription: string;
    args: GameFunctionArg[];
    config: FunctionConfig;
    hint?: string;
    id?: string;
    toJson(): Record<string, any>;
}

export class FunctionImpl implements Function {
    id: string;

    constructor(
        public fnName: string,
        public fnDescription: string,
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
            fn_name: this.fnName,
            fn_description: this.fnDescription,
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
                if (this.config.successFeedback) {
                    console.log(this.interpolateTemplate(this.config.successFeedback, { ...argDict, response: response.data }));
                }
                return response.data;
            }
        } catch (error: any) {
            const errorMsg = error.response?.data || error.message;
            if (this.config.errorFeedback) {
                console.log(this.interpolateTemplate(this.config.errorFeedback, { ...argDict, response: errorMsg }));
            }
            throw new Error(`Request failed: ${JSON.stringify(errorMsg)}`);
        }
    }
}


class GameFunction<T extends GameFunctionArg[]> implements IGameFunction<T> {
    public name: string;
    public description: string;
    public args: T;
    public executable: (
      args: Partial<ExecutableArgs<T>>,
      logger: (msg: string) => void
    ) => Promise<ExecutableGameFunctionResponse>;
    public hint?: string;
  
    constructor(options: IGameFunction<T>) {
      this.name = options.name;
      this.description = options.description;
      this.args = options.args;
      this.executable = options.executable;
      this.hint = options.hint;
    }
  
    toJSON() {
      return {
        fn_name: this.name,
        fn_description: this.description,
        args: this.args,
        hint: this.hint,
      };
    }
  
    async execute(
      args: {
        [key in GameFunctionArg["name"]]: { value: string };
      },
      logger: (msg: string) => void
    ) {
      const argValues: ExecutableArgs<T> = Object.keys(args).reduce(
        (acc, key) => {
          acc[key as keyof ExecutableArgs<T>] = args[key]?.value;
          return acc;
        },
        {} as ExecutableArgs<T>
      );
  
      return await this.executable(argValues, logger);
    }
  }