import type {
    CommandInteraction,
    User,
  } from "discord.js";
  import {
    ApplicationCommandOptionType,
    GuildMember,
  } from "discord.js";
  import { Discord, Slash, SlashOption } from "discordx";
  
  @Discord()
  export class Example {
    @Slash({ description: "Lege einem User eine Bananenschale hin", name: "banana" })
    async banana(
      @SlashOption({
        description: "user",
        name: "user",
        required: true,
        type: ApplicationCommandOptionType.User,
      })
      user: User | GuildMember | undefined,
      interaction: CommandInteraction,
    ): Promise<void> {
      if (!user) {
        return;
      }
  
      await interaction.reply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt.`,
      });

      await delay(800);

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt..`,
      });

      await delay(800);

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt...`,
      });

      await delay(800);

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt.`,
      });

      await delay(800);

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt..`,
      });

      await delay(800);

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt...`,
      });

      await delay(1200);

      const options: string[] = [
        `${user.toString()} ist darauf ausgerutscht! 🍌`,
        `${user.toString()} hat die Bananenschale rechtzeitig gesehen und ist ausgewichen!`,
      ];

      const randomIndex: number = Math.floor(Math.random() * options.length);
      const randomOption: string = options[randomIndex];

      await interaction.editReply({
        content: `Du hast für ${user.toString()} eine Bananenschale ausgelegt...\n${randomOption}`,
      });
    }
  }
  
  function delay(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }