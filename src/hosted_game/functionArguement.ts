import { v4 as uuidv4 } from "uuid";

export interface FunctionArgument {
    name: string;
    description: string;
    type: string;
    id?: string;
}

export class FunctionArgumentImpl implements FunctionArgument {
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