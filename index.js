const fs = require('node:fs');
const path = require('node:path');

// to use global functions
const functions = require('./functions.js');

// Require the necessary discord.js classes
const { REST, Routes, Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// .env required variables
require('dotenv').config();

// database
const { supabase } = require('./database');

// Create a new client instance
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

const commands = [];
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
		} else {
			functions.logWithTimestamp(`[WARNUNG] Befehl bei ${filePath} hat keine benötigte "data" oder "execute" property!`);
		}
	}
}


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.CLIENT_TOKEN);

// and deploy your commands!
(async () => {
    try {
      const { data, error } = await supabase
        .from('guilds')
        .select('discord_id');
  
      if (error) {
        console.error('Fehler: ', error.message);
        return;
      }
  
      if (data) {

        const promises = data.map(async (guild) => {

          try {
            const fetchedGuild = await client.guilds.fetch(guild.discord_id);
  
            // Lösche alle bestehenden Guild-Befehle und füge dann die neuen hinzu
            await Promise.all([
              // Lösche alle bestehenden Befehle
              rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.discord_id), { body: [] }),
  
              // Füge die neuen Befehle hinzu
              rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guild.discord_id), { body: commands })
            ]);
  
            functions.logWithTimestamp(`Server '${fetchedGuild.name}': ${commands.length} Slash-Commands erfolgreich neu geladen.`);
          } catch (guildError) {
            console.error(`Fehler beim Aktualisieren von Befehlen für Guild ID ${guild.discord_id}:`, guildError);
          }
        });
  
        // Warten, dass alle Promises abgeschlossen sind
        await Promise.all(promises);
      }
  
    } catch (error) {
      // Fange unerwartete Fehler auf
      console.error(error);
    }
})();
  

// Events

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
    client.on(event.name, (...args) => event.execute(...args));
}

client.once(Events.ClientReady, readyClient => {

	functions.logWithTimestamp(`${readyClient.user.username} ist jetzt online!`);
});

// Log in to Discord with your client's token
client.login(process.env.CLIENT_TOKEN);