# How to Create a New Bot in Telegram

Creating a bot in Telegram is straightforward using **BotFather**, a special bot provided by Telegram to manage and create bots. Follow these steps to set up your bot:

---

## Step 1: Open BotFather
1. Open the Telegram app or web client.
2. Search for **BotFather** in the search bar (it's an official bot, verified by Telegram).
3. Start a chat with BotFather by clicking **Start** or typing `/start`.

---

## Step 2: Create a New Bot
1. Type the command:

   ```
   /newbot
   ```

2. BotFather will prompt you to:
   - **Choose a name for your bot**: This is the display name for your bot (e.g., "MyAwesomeBot").
   - **Choose a username for your bot**: The username must be unique and must end with "bot" (e.g., "MyAwesomeBot" or "AwesomeBot123_bot").

3. Once you provide a valid name and username, BotFather will create your bot and provide a **bot token**.

   Example:
   ```
   Use this token to access the HTTP API:
   123456789:ABCDEF12345678xyz
   ```

   **Save this token securely!** It is required to connect your bot to Telegram’s API.
