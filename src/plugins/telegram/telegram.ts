import { apiRequest } from "../../util/api";


interface SendMessageArgs {
    chat_id: string;
    text: string;
    parse_mode?: "Markdown" | "HTML";
    disable_web_page_preview?: boolean;
    disable_notification?: boolean;
    reply_to_message_id?: number;
}

interface SendMessageResponse {
    ok: boolean;
    result: {
        message_id: number;
        chat: {
            id: number;
            type: string;
            title?: string;
            username?: string;
        };
        date: number;
        text: string;
    };
}

interface SendMediaArgs {
    chat_id: string;
    media_type: "photo" | "video" | "document" | "audio";
    media: string; // File ID or URL
    caption?: string; // Optional caption
    parse_mode?: "Markdown" | "HTML";
    disable_notification?: boolean;
    reply_to_message_id?: number;
}

interface SendMediaResponse {
    ok: boolean;
    result: {
        message_id: number;
        chat: {
            id: number;
            type: string;
            title?: string;
            username?: string;
        };
        date: number;
        media?: any; // Media-specific data (e.g., photo, video, etc.)
        caption?: string;
    };
}

interface CreatePollArgs {
    chat_id: string; // Target chat or channel ID
    question: string; // Poll question
    options: string[]; // Array of answer options (2-10)
    is_anonymous?: boolean; // Whether the poll is anonymous
    type?: "regular" | "quiz"; // Poll type
    allows_multiple_answers?: boolean; // Allow multiple answers
    correct_option_id?: number; // For quiz polls: index of the correct answer
    explanation?: string; // For quiz polls: explanation for the correct answer
    explanation_parse_mode?: "Markdown" | "HTML"; // Format for explanation
    open_period?: number; // Duration in seconds for which the poll will be active
    close_date?: number; // Unix time when the poll will close
    disable_notification?: boolean; // Send silently
    reply_to_message_id?: number; // ID of the message to reply to
}

interface CreatePollResponse {
    ok: boolean;
    result: {
        message_id: number;
        chat: {
            id: number;
            type: string;
            title?: string;
            username?: string;
        };
        date: number;
        poll: {
            id: string;
            question: string;
            options: { text: string; voter_count: number }[];
            total_voter_count: number;
            is_anonymous: boolean;
            type: string;
            allows_multiple_answers: boolean;
        };
    };
}

interface UpdatePinnedMessageArgs {
    chat_id: string;
    message_id?: number;
    disable_notification?: boolean;
}


interface DeleteMessagesArgs {
    chat_id: string; // Target chat or channel ID
    message_ids: number[]; // Array of message IDs to delete
}

interface WebhookResponseDTO {
    chatId: string;
    text: string;
}

class TelegramClient {
    private baseURL: string;

    constructor(botToken: string) {
        this.baseURL = `https://api.telegram.org/bot${botToken}`;
    }

    /**
  * Send a message to a chat or channel.
  * @param args Parameters for the sendMessage method
  * @returns The API response with the message details
  */
    public async sendMessage(args: SendMessageArgs): Promise<SendMessageResponse> {
        const url = `${this.baseURL}/sendMessage`;
        return apiRequest<SendMessageResponse>({
            method: "post",
            url,
            data: args,
        });
    }

    /**
     * Send a media message to a chat.
     * @param args Parameters for sending media
     * @returns The API response with message details
     */
    public async sendMedia(args: SendMediaArgs): Promise<SendMediaResponse> {
        const url = `${this.baseURL}/send${args.media_type.charAt(0).toUpperCase() + args.media_type.slice(1)}`;
        const payload = {
            chat_id: args.chat_id,
            caption: args.caption,
            parse_mode: args.parse_mode,
            disable_notification: args.disable_notification,
            reply_to_message_id: args.reply_to_message_id,
            [args.media_type]: args.media, // Dynamic media field
        };
        return apiRequest<SendMediaResponse>({
            method: "post",
            url,
            data: payload,
        });
    }

    /**
     * Create a poll in a chat or channel.
     * @param args Parameters for the createPoll method
     * @returns The API response with poll details
     */
    public async createPoll(args: CreatePollArgs): Promise<CreatePollResponse> {
        const url = `${this.baseURL}/sendPoll`;
        return apiRequest<CreatePollResponse>({
            method: "post",
            url,
            data: args,
        });
    }

    /**
     * Update the pinned message in a chat.
     * This can pin a new message or unpin the current one.
     * @param args Parameters for updating the pinned message
     * @returns API response indicating success or failure
     */
    public async updatePinnedMessage(args: UpdatePinnedMessageArgs): Promise<any> {
        // Pin a new message
        const url = `${this.baseURL}/pinChatMessage`;
        return apiRequest({
            method: "post",
            url,
            data: {
                chat_id: args.chat_id,
                message_id: args.message_id,
                disable_notification: args.disable_notification,
            },
        });
    }

    /**
   * Delete multiple messages from a chat.
   * @param args Parameters for deleting messages
   * @returns Promise resolving with results for each message
   */
    public async deleteMessages(args: DeleteMessagesArgs): Promise<{ [messageId: number]: boolean }> {
        const url = `${this.baseURL}/deleteMessage`;
        const results: { [messageId: number]: boolean } = {};

        for (const messageId of args.message_ids) {
            try {
                const response: any = await apiRequest({
                    method: "post",
                    url,
                    data: {
                        chat_id: args.chat_id,
                        message_id: messageId,
                    },
                });
                console.log(`Deleted message ${messageId}:`, response);
                results[messageId] = response.ok;
            } catch (error) {
                results[messageId] = false;
                console.error(`Failed to delete message ${messageId}:`, error);
            }
        }
        return results;
    }


    public async webhook(request: any): Promise<WebhookResponseDTO> {
        const message = request.message;
        console.log("Received webhook message:", message);
        if (message && message.text) {
            // Sending a reply back to the user
            const chatId = message.chat.id;
            const reply = `You said: "${message.text}"`;

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