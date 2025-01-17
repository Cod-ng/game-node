import TelegramClient from "../../../plugin/telegram/telegram";
import { apiRequest } from "../../../util/api";

// Mock the apiRequest function
jest.mock("../../../__mocks__/apiRequest");

// Mock apiRequest function 
jest.mock("../../../util/api", () => ({
    apiRequest: jest.fn(), // Mock apiRequest as a Jest mock function
}));

describe("TelegramClient", () => {
    const botToken = "test-bot-token";
    const client = new TelegramClient(botToken);
    const baseURL = `https://api.telegram.org/bot${botToken}`;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendMessage", () => {
        it("should send a message successfully", async () => {
            const args = {
                chat_id: "12345",
                text: "Hello, world!",
            };

            // Mock successful response
            const mockResponse = { ok: true, result: { message_id: 67890 } };
            (apiRequest as jest.Mock).mockResolvedValue(mockResponse);

            const result = await client.sendMessage(args);

            // Assert that the sendMessage method returned the mocked response
            expect(result).toEqual(mockResponse);
            expect(apiRequest).toHaveBeenCalledWith({
                method: "post",
                url: `https://api.telegram.org/bot${botToken}/sendMessage`,
                data: args,
            });
        });
        it("should handle errors", async () => {
            const args = {
                chat_id: "12345",
                text: "Hello, world!",
            };

            // Mock an error response
            const mockError = new Error("Unknown Error");
            (apiRequest as jest.Mock).mockRejectedValue(mockError);

            // Assert that the method throws an error
            await expect(client.sendMessage(args)).rejects.toThrowError("Unknown Error");
        });
    });

    describe("deleteMessage", () => {
        it("should delete messages successfully", async () => {
            // Mock the apiRequest to resolve successfully
            (apiRequest as jest.Mock).mockResolvedValue({ ok: true });

            const args = {
                chat_id: "1234",
                message_ids: [1, 2, 3],
            };

            const result = await client.deleteMessages(args);

            // Check if apiRequest was called for each message ID
            expect(apiRequest).toHaveBeenCalledTimes(3);
            expect(apiRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: "post",
                    url: `https://api.telegram.org/bot${botToken}/deleteMessage`,
                    data: expect.objectContaining({
                        chat_id: args.chat_id,
                        message_id: expect.any(Number),
                    }),
                })
            );

            // Verify the result contains the expected output for each message ID
            // expect(result).toEqual({
            //     1: true,
            //     2: true,
            //     3: true,
            // });
        });
    });

    describe("sendMedia", () => {
        it("should send a photo successfully", async () => {
            const mockResponse = {
                ok: true,
                result: {
                    message_id: 12345,
                    chat: {
                        id: 1234,
                        type: "private",
                    },
                    date: 1617181920,
                    media: { type: "photo", file_id: "file123" },
                    caption: "Test caption",
                },
            };
    
            // Mock apiRequest to resolve with a successful response
            (apiRequest as jest.Mock).mockResolvedValue(mockResponse);
    
            const args: SendMediaArgs = {
                chat_id: "1234",
                media_type: "photo",
                media: "mockedfileurl" ,
                caption: "Test caption",
                parse_mode: "Markdown",
                disable_notification: false,
                reply_to_message_id: 5678,
            };
    
            const result = await client.sendMedia(args);
    
            // Check if the apiRequest was called with the correct URL and payload
            expect(apiRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: "post",
                    url: `https://api.telegram.org/bot${botToken}/sendPhoto`, // Based on media_type
                    data: expect.objectContaining({
                        chat_id: args.chat_id,
                        caption: args.caption,
                        parse_mode: args.parse_mode,
                        disable_notification: args.disable_notification,
                        reply_to_message_id: args.reply_to_message_id,
                        photo: args.media, // Should include the media field correctly
                    }),
                })
            );
    
            // Verify that the result matches the mock response
            expect(result).toEqual(mockResponse);
        });
        it("should handle error while send media", async () => {
            
            const args: SendMediaArgs = {
                chat_id: "1234",
                media_type: "photo",
                media: "mockedfileurl" ,
                parse_mode: "Markdown",
                disable_notification: false,
                reply_to_message_id: 5678,
            };
    
            // Mock apiRequest to resolve with a successful response
            (apiRequest as jest.Mock).mockResolvedValue({
                ok: false,
                result: null,
            });
    
            const result = await client.sendMedia(args);
    
            // Expect the result to handle the error gracefully
            expect(result.ok).toBe(false);
        });

    });

    describe("createPoll", () => {
        it("should create a poll successfully", async () => {
            // Mock successful API response
            const mockResponse: CreatePollResponse = {
                ok: true,
                result: {
                    message_id: 12345,
                    chat: {
                        id: 1234,
                        type: "private",
                        title: "Test Chat",
                        username: "test_username",
                    },
                    date: 1617181920,
                    poll: {
                        id: "poll123",
                        question: "What is your favorite color?",
                        options: [
                            { text: "Red", voter_count: 10 },
                            { text: "Blue", voter_count: 15 },
                            { text: "Green", voter_count: 5 },
                        ],
                        total_voter_count: 30,
                        is_anonymous: true,
                        type: "regular",
                        allows_multiple_answers: false,
                    },
                },
            };
    
            // Mock apiRequest to resolve with the mockResponse
            (apiRequest as jest.Mock).mockResolvedValue(mockResponse);
    
            // Arguments for creating a poll
            const args = {
                chat_id: "1234",
                question: "What is your favorite color?",
                options: ["Red", "Blue", "Green"],
                is_anonymous: true,
                allows_multiple_answers: false,
            };
    
            const result = await client.createPoll(args);
    
            // Check if the apiRequest was called with the correct URL and payload
            expect(apiRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: "post",
                    url: `https://api.telegram.org/bot${botToken}/sendPoll`, // The endpoint for sending a poll
                    data: expect.objectContaining({
                        chat_id: args.chat_id,
                        question: args.question,
                        options: args.options,
                        is_anonymous: args.is_anonymous,
                        allows_multiple_answers: args.allows_multiple_answers,
                    }),
                })
            );
    
            // Verify that the result matches the mock response
            expect(result).toEqual(mockResponse);
    
            // Additionally, verify the structure of the poll
            expect(result.result.poll.id).toBe("poll123");
            expect(result.result.poll.question).toBe("What is your favorite color?");
            expect(result.result.poll.options).toHaveLength(3);
            expect(result.result.poll.total_voter_count).toBe(30);
        });
    });

    describe("updatePinnedMessage", () => {
        it("should update a pinned message successfully", async () => {
            // Mock successful API response
            const mockResponse = {
                ok: true,
                result: {
                    message_id: 12345,
                    chat: {
                        id: 1234,
                        type: "private",
                        title: "Test Chat",
                        username: "test_username",
                    },
                    date: 1617181920,
                },
            };
    
            // Mock apiRequest to resolve with the mockResponse
            (apiRequest as jest.Mock).mockResolvedValue(mockResponse);
    
            // Arguments for updating the pinned message
            const args = {
                chat_id: "1234",
                message_id: 67890, // Message ID to pin
                disable_notification: true, // Disable notification
            };
    
            const result = await client.updatePinnedMessage(args);
    
            // Check if the apiRequest was called with the correct URL and payload
            expect(apiRequest).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: "post",
                    url: `https://api.telegram.org/bot${botToken}/pinChatMessage`, // The endpoint for pinning a message
                    data: expect.objectContaining({
                        chat_id: args.chat_id,
                        message_id: args.message_id,
                        disable_notification: args.disable_notification,
                    }),
                })
            );
    
            // Verify that the result matches the mock response
            expect(result).toEqual(mockResponse);
        });
    });
});