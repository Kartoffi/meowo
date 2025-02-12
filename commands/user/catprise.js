const { SlashCommandBuilder } = require("@discordjs/builders");
const { fetch } = require("undici");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catprise")
    .setDescription("Lade ein zufälliges Katzenbild")
    .addStringOption((option) =>
      option
        .setName("dateityp")
        .setDescription("Wähle den gewünschten Dateityp aus")
        .setRequired(true)
        .addChoices(
          { name: "Bild", value: "img" },
          { name: "GIF", value: "gif" }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();

    let url = null;
    let fileName = null;
    const dataType = interaction.options.getString("dateityp");

    switch (dataType) {
      case "gif":
        url = "https://cataas.com/cat/gif";
        fileName = "cat.gif";
        break;
      default: //img
        url = "https://cataas.com/cat";
        fileName = "cat.jpg";
        break;
    }

    const result = await fetch(url);
    const buffer = await result.arrayBuffer();
    const file = Buffer.from(buffer);
    interaction.editReply({
      content: "# *Here is your pussy*",
      files: [
        {
          attachment: file,
          name: fileName,
        },
      ],
    });
  },
};
