var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
let GroupExample = class GroupExample {
    async add(x, y, interaction) {
        await interaction.reply(String(x + y));
    }
    async multiply(x, y, interaction) {
        await interaction.reply(String(x * y));
    }
    async root(text, interaction) {
        await interaction.reply(text);
    }
};
__decorate([
    Slash({ description: "add" }),
    SlashGroup("maths", "testing"),
    __param(0, SlashOption({
        description: "x value",
        name: "x",
        required: true,
        type: ApplicationCommandOptionType.Number,
    })),
    __param(1, SlashOption({
        description: "y value",
        name: "y",
        required: true,
        type: ApplicationCommandOptionType.Number,
    }))
], GroupExample.prototype, "add", null);
__decorate([
    Slash({ description: "multiply" }),
    SlashGroup("maths", "testing"),
    __param(0, SlashOption({
        description: "x value",
        name: "x",
        required: true,
        type: ApplicationCommandOptionType.Number,
    })),
    __param(1, SlashOption({
        description: "y value",
        name: "y",
        required: true,
        type: ApplicationCommandOptionType.Number,
    }))
], GroupExample.prototype, "multiply", null);
__decorate([
    Slash({ description: "root" }),
    SlashGroup("testing"),
    __param(0, SlashOption({
        description: "text",
        name: "text",
        required: true,
        type: ApplicationCommandOptionType.String,
    }))
], GroupExample.prototype, "root", null);
GroupExample = __decorate([
    Discord(),
    SlashGroup({ description: "testing", name: "testing" }),
    SlashGroup({ description: "maths", name: "maths", root: "testing" })
], GroupExample);
export { GroupExample };
