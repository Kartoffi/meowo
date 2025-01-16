const { SlashCommandBuilder } = require('@discordjs/builders');

// database
const { supabase } = require('../../database.js');

// to use global functions
const functions = require('../../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('setcolor')
	.setDescription('Setze eine neue Farbe.')
	.addStringOption(option=> option.setName("hexcode").setDescription("Farbcode (Hex)").setRequired(true)),
	async execute(interaction) {

        let hexcode = interaction.options.getString("hexcode");
        const regEx = "^[A-Fa-f0-9]+$";

        if (hexcode.startsWith('#')) {
            hexcode = hexcode.slice(1);
        }

        if (hexcode.length != 6 || !hexcode.match(regEx)) {

            return interaction.reply({ content: `Deine Eingabe #${hexcode} ist kein gültiger Hex-Code.` });
        }

        const guild = await functions.getGuild(interaction.guild.id);
        const user = await functions.getUser(interaction.user.id);

        const { data: roleData, error: roleError } = await supabase
            .from('guildmembers')
            .select('color_role_id')
            .eq('guild_id', guild.id)
            .eq('user_id', user.id)
            .single();

        if (roleError) {
            console.error('Error fetching data:', roleError);
            return interaction.reply({ content: `Da ist ein Fehler passiert!` });
        }

        if (roleData.color_role_id == null) {
            // Wenn keine Rolle existiert, erstelle eine neue Rolle mit der gewünschten Farbe
            const role = await interaction.guild.roles.create({
                name: interaction.user.username,
                color: `#${hexcode}`,
                reason: `Farbe von ${interaction.user.username}`,
            });

            // Speichere die ID der erstellten Rolle in der Datenbank
            const { error: insertError } = await supabase
                .from('guildmembers')
                .update(
                    {
                        color_role_id: role.id,
                    }
                )
                .eq('guild_id', guild.id)
                .eq('user_id', user.id);

            if (insertError) {
                console.error('Error inserting data:', insertError);
                return interaction.reply({ content: `Da ist ein Fehler passiert, die Farbe konnte nicht gespeichert werden.` });
            }

            // Weise dem Benutzer die Rolle zu
            await interaction.member.roles.add(role);

            return interaction.reply({ content: `Deine neue Farbe #${hexcode} wurde gesetzt und die Rolle wurde zugewiesen!` });
        } else {
            // Wenn eine Rolle existiert, ändere nur die Farbe der bestehenden Rolle
            const existingRole = await interaction.guild.roles.fetch(roleData.color_role_id);

            try {
                // Ändere die Farbe der bestehenden Rolle
                await existingRole.edit({
                    color: hexcode
                });

                // Aktualisiere den Farbwert in der Datenbank, falls nötig
                const { error: updateError } = await supabase
                    .from('guildmembers')
                    .update({ color_role_id: existingRole.id })
                    .eq('guild_id', guild.id)
                    .eq('user_id', user.id);

                if (updateError) {
                    console.error('Error updating data:', updateError);
                    return interaction.reply({ content: `Da ist ein Fehler passiert, die Farbe konnte nicht gespeichert werden.` });
                }

                // Weise dem Benutzer die geänderte Rolle zu (falls nicht schon zugewiesen)
                if (!interaction.member.roles.cache.has(existingRole.id)) {
                    await interaction.member.roles.add(existingRole);
                }

                return interaction.reply({ content: `Deine neue Farbe #${hexcode} wurde gesetzt und die bestehende Rolle aktualisiert!` });
            } catch (error) {
                console.error('Error updating role color:', error);
                return interaction.reply({ content: `Es gab ein Problem beim Ändern der Farbe der Rolle.` });
            }
        }
	},
};