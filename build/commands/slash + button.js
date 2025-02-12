var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ActionRowBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, GuildMember, } from "discord.js";
import { ButtonComponent, Discord, Slash, SlashOption } from "discordx";
let Example = class Example {
    async hello(user, interaction) {
        if (!user) {
            return;
        }
        await interaction.deferReply();
        const helloBtn = new ButtonBuilder()
            .setLabel("Hello")
            .setEmoji("👋")
            .setStyle(ButtonStyle.Primary)
            .setCustomId("hello-btn");
        const row = new ActionRowBuilder().addComponents(helloBtn);
        await interaction.editReply({
            components: [row],
            content: `${user.toString()}, Say hello to bot`,
        });
    }
    async helloBtn(interaction) {
        if (!(interaction.member instanceof GuildMember)) {
            return;
        }
        await interaction.reply(`👋 ${interaction.member.toString()}`);
    }
};
__decorate([
    Slash({ description: "hello", name: "hello-btn" }),
    __param(0, SlashOption({
        description: "user",
        name: "user",
        required: true,
        type: ApplicationCommandOptionType.User,
    }))
], Example.prototype, "hello", null);
__decorate([
    ButtonComponent({ id: "hello-btn" })
], Example.prototype, "helloBtn", null);
Example = __decorate([
    Discord()
], Example);
export { Example };
