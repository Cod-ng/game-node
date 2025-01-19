import { ExecutableGameFunction } from "../function";

// interface ExecutableGameFunction {
//     fn_name: string;
//     fn_description: string;
//     args: GameFunctionArg[];
//     config: FunctionConfig;
//     hint?: string;
//     id?: string;
// }

class DiscordClient {
    private botToken: string;
    private baseURL: string;
    private methodsMap: Record<string, () => ExecutableGameFunction>;

    constructor(botToken: string) {
        this.botToken = botToken;
        this.baseURL = "https://discord.com/api/v10";
        this.methodsMap = {
            sendMessage: this.sendMessage.bind(this),
            addReaction: this.addReaction.bind(this),
            pinMessage: this.pinMessage.bind(this),
            deleteMessage: this.deleteMessage.bind(this),
        };
    }

    /**
     * Get all default functions.
     * @returns Promise resolving to a map of function names and descriptions.
     */
    async getFunctions(): Promise<Record<string, string>> {
        return {
            sendMessage: this.methodsMap["sendMessage"]().fn_description,
            addReaction: this.methodsMap["addReaction"]().fn_description,
            pinMessage: this.methodsMap["pinMessage"]().fn_description,
            deleteMessage: this.methodsMap["deleteMessage"]().fn_description,
        };
    }

    /**
     * Send a message to a specific channel.
     * @param args Parameters for the message
     * @returns Promise resolving to true if successful
     */
    sendMessage(): ExecutableGameFunction {
        const url = `${this.baseURL}/channels/{{channel_id}}/messages`;

        return ({
            fn_name: "sendMessage",
            fn_description: "Send a text message to a Discord channel.",
            args: [
                {
                    name: "channel_id",
                    description: "ID of the Discord channel to send the message to.",
                    type: "string",
                },
                {
                    name: "content",
                    description: "Content of the message to send.",
                    type: "string",
                },
            ],
            config: {
                method: "post",
                url,
                platform: "discord",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bot ${this.botToken
                        }`,
                },
                payload: {
                    content: "{{content}}",
                },
                success_feedback: "Message sent successfully.",
                error_feedback: "Failed to send message: {{response.message}}",
            }
        })
    }


    /**
     * Add a reaction to a message.
     * @param args Parameters for adding the reaction
     * @returns Promise resolving to true if successful
     */
    addReaction(): ExecutableGameFunction {
        const url = `${this.baseURL} /channels/{ { channel_id } } /messages/{ { message_id } } /reactions/{ { enoji } }/@me`;
        return ({
            fn_name: "add_reaction",
            fn_description: "Add a reaction emoji to a message.",
            args: [
                {
                    name: "channel_id",
                    description: "ID of the Discord channel containing the message.",
                    type: "string",
                },
                {
                    name: "message_id",
                    description: "ID of the message to add a reaction to.",
                    type: "string",
                },
                {
                    name: "emoji",
                    description: "Emoji to add as a reaction (Unicode or custom emoji).",
                    type: "string",
                },
            ],
            config: {
                method: "put",
                url,
                platform: "discord",
                headers: {
                    "Authorization": `Bot ${this.botToken}`,
                },
                success_feedback: "Reaction added successfully.",
                error_feedback: "Failed to add reaction: {{response.message}}",
            }
        });
    }

    /**
     * Pin a message in a channel.
     * @param args Parameters for pinning the message
     * @returns Promise resolving to true if successful
     */
    pinMessage(): ExecutableGameFunction {
        const url = `${this.baseURL}/channels/{{channel_id}}/pins/{{message_id}}`;
        return ({
            fn_name: "pin_message",
            fn_description: "Pin a message in a Discord channel.",
            args: [
                {
                    name: "channel_id",
                    description: "ID of the Discord channel containing the message.",
                    type: "string",
                },
                {
                    name: "message_id",
                    description: "ID of the message to pin.",
                    type: "string",
                },
            ],
            config: {
                method: "put",
                url,
                platform: "discord",
                headers: {
                    "Authorization": `Bot ${this.botToken}`,
                },
                success_feedback: "Message pinned successfully.",
                error_feedback: "Failed to pin message: {{response.message}}",
            }
        });
    }

    /**
     * Delete a specific message.
     * @param args Parameters for deleting the message
     * @returns Promise resolving to true if successful
     */
    deleteMessage(): ExecutableGameFunction {
        const url = `${this.baseURL}/channels/{{channel_id}}/messages/{{message_id}}`;
        return ({
            fn_name: "delete_message",
            fn_description: "Delete a message from a Discord channel.",
            args: [
                {
                    name: "channel_id",
                    description: "ID of the Discord channel containing the message.",
                    type: "string",
                },
                {
                    name: "message_id",
                    description: "ID of the message to delete.",
                    type: "string",
                },
            ],
            config: {
                method: "delete",
                url,
                platform: "discord",
                headers: {
                    "Authorization": `Bot ${this.botToken}`,
                },
                success_feedback: "Message deleted successfully.",
                error_feedback: "Failed to delete message: {{response.message}}",
            }
        });
    }
}

export default DiscordClient;