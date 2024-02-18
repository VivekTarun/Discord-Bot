import { Client, Events, GatewayIntentBits } from 'discord.js';
import 'dotenv/config'

const client = new Client({ // The term guild is used by the discord API in discord.js to refer to a discord server.
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});
const TOKEN = process.env.TOKEN;

client.once(Events.ClientReady, readyClient => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`); // readyClient.user.tag -> name of the bot
})





client.login(TOKEN);
