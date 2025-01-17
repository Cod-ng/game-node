"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../../util/api");
class GameClient {
    constructor(apiKey) {
        this.apiUrl = "https://game-api.virtuals.io/api";
        this.apiKey = apiKey;
    }
    /**
     * Get all default functions.
     * @returns Promise resolving to a map of function names and descriptions.
     */
    getFunctions() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${this.apiUrl}/functions`;
            try {
                const response = yield (0, api_1.apiRequest)({
                    method: "GET",
                    url,
                    headers: { "x-api-key": this.apiKey },
                });
                const functions = {};
                response.data.data.forEach((fn) => {
                    functions[fn.fn_name] = fn.fn_description;
                });
                return functions;
            }
            catch (error) {
                console.error("Failed to fetch functions:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw error;
            }
        });
    }
    /**
     * Simulate the agent configuration.
     * @param args Simulation parameters
     * @returns Promise resolving to simulation result data.
     */
    simulate(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${this.apiUrl}/simulate`;
            try {
                const response = yield (0, api_1.apiRequest)({
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
            }
            catch (error) {
                console.error("Failed to simulate configuration:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw error;
            }
        });
    }
    /**
     * React to an event in a platform.
     * @param args Reaction parameters
     * @returns Promise resolving to reaction result data.
     */
    react(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${this.apiUrl}/react/${args.platform}`;
            const payload = {
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
                const response = yield (0, api_1.apiRequest)({
                    method: "POST",
                    url,
                    headers: { "x-api-key": this.apiKey },
                    data: { data: payload },
                });
                return response.data.data;
            }
            catch (error) {
                console.error("Failed to react:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw error;
            }
        });
    }
    /**
     * Deploy an agent configuration.
     * @param args Deployment parameters
     * @returns Promise resolving to deployment result data.
     */
    deploy(args) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${this.apiUrl}/deploy`;
            try {
                const response = yield (0, api_1.apiRequest)({
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
            }
            catch (error) {
                console.error("Failed to deploy configuration:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                throw error;
            }
        });
    }
}
exports.default = GameClient;
