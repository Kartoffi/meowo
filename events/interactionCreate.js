// to use global functions
const functions = require('../functions.js');

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(interaction) {

        const { client } = interaction;

        if(!interaction.isCommand()) return;

        // Überprüfung, ob Guild, Member und User in der Datenbank sind, bei Bedarf einfügen
        await functions.ensureUserAndGuild(interaction.user.id, interaction.guild.id);

        // Befehl holen
        const command = client.commands.get(interaction.commandName);

        // Befehl ausführen
        if(command) {
            try {
                await command.execute(interaction);
            } catch(error) {
                console.error(error);

                if(interaction.deferred || interaction.replied) {
                    interaction.editReply("⚠️ Es ist ein Fehler beim Ausführen des Befehls aufgetreten!");
                } else {
                    interaction.reply("⚠️ Es ist ein Fehler beim Ausführen des Befehls aufgetreten!");
                }
            }
        }
    }
}