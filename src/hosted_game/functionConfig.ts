export interface FunctionConfig {
    method?: string;
    url?: string;
    headers?: Record<string, any>;
    payload?: Record<string, any>;
    successFeedback?: string;
    errorFeedback?: string;
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