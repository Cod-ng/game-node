import { apiRequest } from "../../util/api";
import { ExecutableGameFunction } from "../function";

// interface ExecutableGameFunction {
//     fn_name: string;
//     fn_description: string;
//     args: GameFunctionArg[];
//     config: FunctionConfig;
//     hint?: string;
//     id?: string;
// }

interface WebhookResponseDTO {
    chatId: string;
    text: string;
}

class TelegramClient {
    private baseURL: string;
    private methodsMap: Record<string, () => ExecutableGameFunction>;

    constructor(botToken: string) {
        this.baseURL = `https://api.telegram.org/bot${botToken}`;
        this.methodsMap = {
            sendMessage: this.sendMessage.bind(this),
            sendMedia: this.sendMedia.bind(this),
            createPoll: this.createPoll.bind(this),
            updatePinnedMessage: this.updatePinnedMessage.bind(this),
            deleteMessages: this.deleteMessages.bind(this),
        };
    }

    /**
     * Get all default functions.
     * @returns Promise resolving to a map of function names and descriptions.
     */
    getFunctions(): Record<string, string> {
        return {
            sendMessage: this.methodsMap["sendMessage"]().fn_description,
            sendMedia: this.methodsMap["sendMedia"]().fn_description,
            createPoll: this.methodsMap["createPoll"]().fn_description,
            updatePinnedMessage: this.methodsMap["updatePinnedMessage"]().fn_description,
            deleteMessages: this.methodsMap["deleteMessages"]().fn_description,
        };
    }


    getFunction(name: string): ExecutableGameFunction {
        if (name in this.methodsMap) {
            return this.methodsMap[name]();
        }
        throw new Error(`Function '${name}' not found
        `);
    }

    /**
     * Send a message to a chat or channel.
     * @param args Parameters for sending a message
     * @returns The API response with message details
     * @see https://core.telegram.org/bots/api#sendmessage
     */
    public sendMessage(): ExecutableGameFunction {
        const url = `${this.baseURL}/sendMessage`;
        return ({
            fn_name: "send_message",
            fn_description: "Send a text message that is contextually appropriate and adds value to the conversation. Consider chat type (private/group) and ongoing discussion context.",
            args: [
                {
                    name: "chat_id",
                    description: "Unique identifier for the target chat or username of the target channel",
                    type: "string",
                },
                {
                    name: "text",
                    description: "Message text to send. Should be contextually relevant and maintain conversation flow.",
                    type: "string"
                }
            ],
            config: {
                method: "post",
                url: url,
                platform: "telegram",
                headers: { "Content-Type": "application/json" },
                payload: {
                    "chat_id": "{{chat_id}}",
                    "text": "{{text}}",
                },
                success_feedback: "Message sent successfully. Message ID: {{response.result.message_id}}",
                error_feedback: "Failed to send message: {{response.description}}"
            }
        });
    }

    /**
     * Send a media message to a chat.
     * @param args Parameters for sending media
     * @returns The API response with message details
     */
    public sendMedia(): ExecutableGameFunction {
        const url = `${this.baseURL}/send{{media_type}}`;
        return ({
            fn_name: "send_media",
            fn_description: "Send a media message (photo, document, video, etc.) with optional caption. Use when visual or document content adds value to the conversation.",
            args: [
                {
                    name: "chat_id",
                    description: "Target chat identifier where media will be sent",
                    type: "string"
                },
                {
                    name: "media_type",
                    description: "Type of media to send: 'photo', 'document', 'video', 'audio'. Choose appropriate type for content.",
                    type: "string"
                },
                {
                    name: "media",
                    description: "File ID or URL of the media to send. Ensure content is appropriate and relevant.",
                    type: "string"
                },
                {
                    name: "caption",
                    description: "Optional text caption accompanying the media. Should provide context or explanation when needed, or follows up the conversation.",
                    type: "string"
                }
            ],
            config: {
                method: "post",
                url: url,
                platform: "telegram",
                headers: { "Content-Type": "application/json" },
                payload: {
                    "chat_id": "{{chat_id}}",
                    "{{media_type}}": "{{media}}",
                    "caption": "{{caption}}"
                },
                success_feedback: "Media sent successfully. Type: {{media_type}}, Message ID: {{response.result.message_id}}",
                error_feedback: "Failed to send media: {{response.description}}"
            }
        });
    }

    /**
     * Create a poll in a chat or channel.
     * @param args Parameters for creating a poll
     * @returns The API response with poll details
     * @see https://core.telegram.org/bots/api#sendpoll
     */
    public createPoll(): ExecutableGameFunction {
        const url = `${this.baseURL}/sendPoll`;
        return ({
            fn_name: "create_poll",
            fn_description: "Create an interactive poll to gather user opinions or make group decisions. Useful for engagement and collecting feedback.",
            args: [
                {
                    name: "chat_id",
                    description: "Chat where the poll will be created",
                    type: "string"
                },
                {
                    name: "question",
                    description: "Main poll question. Should be clear and specific.",
                    type: "string"
                },
                {
                    name: "options",
                    description: "List of answer options. Make options clear and mutually exclusive.",
                    type: "array"
                },
                {
                    name: "is_anonymous",
                    description: "Whether poll responses are anonymous. Consider privacy and group dynamics.",
                    type: "boolean"
                }
            ],
            config: {
                method: "post",
                url: url,
                platform: "telegram",
                headers: { "Content-Type": "application/json" },
                payload: {
                    "chat_id": "{{chat_id}}",
                    "question": "{{question}}",
                    "options": "{{options}}",
                    "is_anonymous": "{{is_anonymous}}"
                },
                success_feedback: "Poll created successfully. Poll ID: {{response.result.poll.id}}",
                error_feedback: "Failed to create poll: {{response.description}}"
            }
        });
    }

    /**
     * Update the pinned message in a chat.
     * @param args Parameters for updating the pinned message
     * @returns The API response indicating success or failure
     * @see https://core.telegram.org/bots/api#pinchatmessage
     */
    public updatePinnedMessage(): ExecutableGameFunction {
        const url = `${this.baseURL}/pinChatMessage`;
        return ({
            fn_name: "update_pinned_message",
            fn_description: "Pin an important message in a chat. Use for announcements, important information, or group rules.",
            args: [
                {
                    name: "chat_id",
                    description: "Chat where the message will be pinned",
                    type: "string"
                },
                {
                    name: "message_id",
                    description: "ID of the message to pin. Ensure message contains valuable information worth pinning.",
                    type: "string"
                },
                {
                    name: "disable_notification",
                    description: "Whether to send notification about pinned message. Consider group size and message importance.",
                    type: "boolean"
                }
            ],
            config: {
                method: "post",
                url: url,
                platform: "telegram",
                headers: { "Content-Type": "application/json" },
                payload: {
                    "chat_id": "{{chat_id}}",
                    "message_id": "{{message_id}}",
                    "disable_notification": "{{disable_notification}}"
                },
                success_feedback: "Message pinned successfully",
                error_feedback: "Failed to pin message: {{response.description}}"
            }
        })
    }

    /**
     * Delete multiple messages from a chat.
     * @param args Parameters for deleting messages
     * @returns API response indicating success or failure
     */
    public deleteMessages(): ExecutableGameFunction {
        const url = `${this.baseURL}/deleteMessage`;
        // const results: { [messageId: number]: boolean } = {};
        return ({
            fn_name: "delete_messages",
            fn_description: "Delete multiple messages from a chat. Use for moderation or cleaning up outdated information.",
            args: [
                {
                    name: "chat_id",
                    description: "Chat containing the messages to delete",
                    type: "string"
                },
                {
                    name: "message_id",
                    description: "IDs of the messages to delete. Consider impact before deletion.",
                    type: "string"
                }
            ],
            config: {
                method: "post",
                url: url,
                platform: "telegram",
                headers: { "Content-Type": "application/json" },
                payload: {
                    "chat_id": "{{chat_id}}",
                    "message_id": "{{message_id}}"
                },
                success_feedback: "Message deleted successfully",
                error_feedback: "Failed to delete message: {{response.description}}"
            }
        });
    }


    public webhook(request: any): WebhookResponseDTO {
        const message = request.message;
        console.log("Received webhook message:", message);
        if (message && message.text) {
            // Sending a reply back to the user
            const chatId = message.chat.id;
            const reply = message.text;
            return {
                chatId,
                text: reply
            };
        }
        throw new Error('Invalid message structure or missing text');
    }


    public async setWebhook(webhookUrl: string): Promise<void> {
        const url = `${this.baseURL}/setWebhook`;
        try {
            const response: any = await apiRequest({
                method: "post",
                url,
                data: {
                    url: webhookUrl
                },
            });
            console.log("Response:", response);
            if (response.ok) {
                console.log('Webhook set successfully:', response.data);
            } else {
                console.error('Failed to set webhook:', response.data.description);
            }
        } catch (error: any) {
            console.error('Error setting webhook:', error.message);
        }
    }
}

export default TelegramClient;