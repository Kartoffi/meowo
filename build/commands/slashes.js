var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Pagination } from "@discordx/pagination";
import { EmbedBuilder } from "discord.js";
import { Discord, MetadataStorage, Slash } from "discordx";
let SlashExample = class SlashExample {
    // example: pagination for all slash command
    async pages(interaction) {
        const commands = MetadataStorage.instance.applicationCommands.map((cmd) => {
            return { description: cmd.description, name: cmd.name };
        });
        const pages = commands.map((cmd, i) => {
            const embed = new EmbedBuilder()
                .setFooter({
                text: `Page ${String(i + 1)} of ${String(commands.length)}`,
            })
                .setTitle("**Slash command info**")
                .addFields({ name: "Name", value: cmd.name })
                .addFields({
                name: "Description",
                value: cmd.description,
            });
            return { embeds: [embed] };
        });
        const pagination = new Pagination(interaction, pages);
        await pagination.send();
    }
};
__decorate([
    Slash({
        description: "Pagination for all slash command",
        name: "all-commands",
    })
], SlashExample.prototype, "pages", null);
SlashExample = __decorate([
    Discord()
], SlashExample);
export { SlashExample };
