import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const TOKEN = process.env.TOKEN;


client.on("messageCreate", (message) => {
    if(message.author.bot) return;
    message.reply({
        content: "Hi from bot",
    })
})


client.login(TOKEN);
