import TelegramClient from 'virtuals-protocol/game/hosted_game/telegram/telegram';
const telegramClient = new TelegramClient("8078655624:AAG4-98xwcEsiDeAwU0xarVo9tMpdVxZdA4");
async function main() {
    try {
        telegramClient.setWebhook("https://webhook.site/eccd355a-247a-4778-b266-6642056cc87e");
        const webhookResponse: any = await telegramClient.webhook({
            "update_id": 904527685,
            "message": {
                "message_id": 10,
                "from": {
                    "id": 811200161,
                    "is_bot": false,
                    "first_name": "Jiazheng",
                    "last_name": "Chong",
                    "language_code": "en"
                },
                "chat": {
                    "id": 811200161,
                    "first_name": "Jiazheng",
                    "last_name": "Chong",
                    "type": "private"
                },
                "date": 1737039799,
                "text": "try"
            }
        })
        const sendMessageResponse = await telegramClient.sendMessage({
            chat_id: webhookResponse?.chatId,
            text: "Test Message"
        });

        console.log('sendMessageResponse:', sendMessageResponse);

        telegramClient.deleteMessages({
            chat_id: webhookResponse?.chatId,
            message_ids: [sendMessageResponse.result.message_id]
        });

    } catch (error) {
        // Handle any errors
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
}

// Call the main function to execute the example
main();
