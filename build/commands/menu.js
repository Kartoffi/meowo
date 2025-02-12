var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import { Discord, SelectMenuComponent, Slash } from "discordx";
const roles = [
    { label: "Principal", value: "principal" },
    { label: "Teacher", value: "teacher" },
    { label: "Student", value: "student" },
];
let Example = class Example {
    async handle(interaction) {
        await interaction.deferReply();
        // extract selected value by member
        const roleValue = interaction.values[0];
        // if value not found
        if (!roleValue) {
            await interaction.followUp("invalid role id, select again");
            return;
        }
        await interaction.followUp(`you have selected role: ${roles.find((r) => r.value === roleValue)?.label ?? "unknown"}`);
    }
    async myRoles(interaction) {
        await interaction.deferReply();
        // create menu for roles
        const menu = new StringSelectMenuBuilder()
            .addOptions(roles)
            .setCustomId("role-menu");
        // create a row for message actions
        const buttonRow = new ActionRowBuilder().addComponents(menu);
        // send it
        await interaction.editReply({
            components: [buttonRow],
            content: "select your role!",
        });
        return;
    }
};
__decorate([
    SelectMenuComponent({ id: "role-menu" })
], Example.prototype, "handle", null);
__decorate([
    Slash({ description: "roles menu", name: "my_roles" })
], Example.prototype, "myRoles", null);
Example = __decorate([
    Discord()
], Example);
export { Example };
