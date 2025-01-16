// index.js

const { client } = require('./client');  // Importiere den Bot-Client aus client.js
const fs = require('node:fs');
const path = require('node:path');

// Importiere notwendige Funktionen
const functions = require('./functions.js');

// Importiere die notwendigen discord.js Klassen
const { REST, Routes, Events, Collection } = require('discord.js');

// .env Variablen laden
require('dotenv').config();

// Datenbankimport (Supabase)
const { supabase } = require('./database');

// Liste für die Slash-Commands
const commands = [];
client.commands = new Collection();

// Lese die Befehl-Ordner und füge die Befehle zur Collection hinzu
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Füge die Befehle zur Collection hinzu
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            functions.logWithTimestamp(`[WARNUNG] Befehl bei ${filePath} hat keine "data" oder "execute" property!`);
        }
    }
}

// Erstelle eine neue Instanz des REST-Moduls
const rest = new REST().setToken(process.env.CLIENT_TOKEN);

// Befehl-Deployment
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

                    // Lösche alle bestehenden Guild-Befehle und füge die neuen hinzu
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
        console.error(error);
    }
})();

// Lese und registriere die Events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    client.on(event.name, (...args) => event.execute(...args));
}

// Wenn der Bot bereit ist, gebe eine Nachricht aus
client.once(Events.ClientReady, readyClient => {

    let ascii = `            
    ███╗   ███╗███████╗ ██████╗ ██╗    ██╗ ██████╗ 
    ████╗ ████║██╔════╝██╔═══██╗██║    ██║██╔═══██╗
    ██╔████╔██║█████╗  ██║   ██║██║ █╗ ██║██║   ██║
    ██║╚██╔╝██║██╔══╝  ██║   ██║██║███╗██║██║   ██║
    ██║ ╚═╝ ██║███████╗╚██████╔╝╚███╔███╔╝╚██████╔╝
    ╚═╝     ╚═╝╚══════╝ ╚═════╝  ╚══╝╚══╝  ╚═════╝       
    
 +-+ +-+-+-+-+-+-+-+ +-+-+-+ +-+-+ +-+-+-+-+ +-+-+-+ +-+-+-+-+-+-+
 |a| |d|i|s|c|o|r|d| |b|o|t| |b|y| |D|e|m|i| |a|n|d| |T|o|f|f|e|l|
 +-+ +-+-+-+-+-+-+-+ +-+-+-+ +-+-+ +-+-+-+-+ +-+-+-+ +-+-+-+-+-+-+
    `;
    console.log(ascii);
    functions.logWithTimestamp(`${readyClient.user.username} ist jetzt online!`);
});

// Logge den Bot ein
client.login(process.env.CLIENT_TOKEN);
