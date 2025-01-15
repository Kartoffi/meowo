const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('hello')
	.setDescription('Ein Testbefehl.')
	.addUserOption(option=> option.setName("member").setDescription("User").setRequired(false)),
	execute(interaction) {

        var discordMember = interaction.options.getMember("member");

        if (!interaction.options.getMember("member")) {
            
            discordMember = interaction.member;
        }
            
        return interaction.reply({ content: `Hallo, ${discordMember}!` });
	},
};