// client.js
const { Client, GatewayIntentBits } = require('discord.js');

// Erstelle den Client und initialisiere die benötigten Intents
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageReactions, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
});

// Exportiere den Client, damit er in anderen Dateien verwendet werden kann
module.exports = { client };

// Hier musst du den Bot mit deinem Token einloggen, es wird in index.js gemacht.
