// discord-client
const { client } = require('./client');

// database
const { supabase } = require('./database');

function logWithTimestamp(message) {

    const time = new Date().toLocaleTimeString("de-DE");
    const day = new Date().toLocaleDateString("de-DE");
    const weekDay = new Date().getDay();
    const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    const timestamp = `[ ${dayNames[weekDay]}, ${day} | ${time} ]`;
    return console.log(timestamp + ' ' + message);
}

async function addGuild(guildId) {
    const guild = await client.guilds.fetch(guildId);

    const { data, error } = await supabase
        .from('guilds')
        .insert([{
            discord_id: guild.id,
            name: guild.name,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting new guild:', error);
        return;
    }

    logWithTimestamp(`Neue Guild '${guild.name}' (ID: ${guild.id}) hinzugefügt.`);
    return data;
}

async function getGuild(guildId) {
    const { data, error } = await supabase
        .from('guilds')
        .select()
        .eq('discord_id', guildId)
        .single(); // Wir gehen davon aus, dass die Guild-ID eindeutig ist

    if (error) {
        console.error('Error fetching guild:', error);
        return null; // Gibt null zurück, wenn ein Fehler auftritt
    }

    return data;
}

async function addUser(discordId) {
    const user = await client.users.fetch(discordId);

    const { data, error } = await supabase
        .from('users')
        .insert([{
            discord_id: user.id,
            username: user.username,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting new discord user:', error);
    }

    logWithTimestamp(`Neuen User '${user.username}' (ID: ${user.id}) hinzugefügt.`);
    return data;
}

async function getUser(discordId) {
    const { data, error } = await supabase
        .from('users')
        .select()
        .eq('discord_id', discordId)
        .single(); // Wir gehen davon aus, dass die Discord-ID eindeutig ist

    if (error) {
        console.error('Error fetching user:', error);
        return null; // Gibt null zurück, wenn ein Fehler auftritt
    }

    return data;
}

async function addMember(userId, guildId) {

    const { data, error } = await supabase
        .from('guildmembers')
        .insert([{
            guild_id: guildId,
            user_id: userId,
        }])
        .select()
        .single();

    if (error) {
        console.error('Error inserting new guild member:', error);
    }

    logWithTimestamp(`Neuen Member (User-ID: ${userId}) vom Server (Guild-ID: ${guildId}) hinzugefügt.`);
    return data;
}

async function getMember(guildId, userId) {
    const { data, error } = await supabase
        .from('guildmembers')
        .select()
        .eq('guild_id', guildId)
        .eq('user_id', userId)
        .single(); // Wir gehen davon aus, dass es nur ein Eintrag für jedes Mitglied in einer Guild gibt

    if (error) {
        console.error('Error fetching guild member:', error);
        return null; // Gibt null zurück, wenn ein Fehler auftritt
    }

    return data;
}

async function ensureUserAndGuild(discordUserId, guildId) {
    // Überprüfen, ob der Benutzer bereits existiert
    let user = await getUser(discordUserId);

    if (user === null) {
        user = await addUser(discordUserId); // Benutzer hinzufügen, wenn nicht vorhanden
    }

    // Überprüfen, ob die Guild bereits existiert
    let guild = await getGuild(guildId);

    if (guild == null) {
        guild = await addGuild(guildId); // Guild hinzufügen, wenn nicht vorhanden
    }

    // Überprüfen, ob das Mitglied bereits in der Guild ist
    let member = await getMember(guild.id, user.id);

    if (member == null) {
        await addMember(user.id, guild.id); // Mitglied hinzufügen, wenn nicht vorhanden
    }
}

module.exports = {
    logWithTimestamp,
    getGuild,
    addGuild,
    getUser,
    addUser,
    getMember,
    addMember,
    ensureUserAndGuild
};