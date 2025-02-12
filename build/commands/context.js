var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ApplicationCommandType } from "discord.js";
import { ContextMenu, Discord } from "discordx";
let Example = class Example {
    async messageHandler(interaction) {
        await interaction.reply("I am user context handler");
    }
    async userHandler(interaction) {
        await interaction.reply("I am user context handler");
    }
};
__decorate([
    ContextMenu({
        name: "message context",
        type: ApplicationCommandType.Message,
    })
], Example.prototype, "messageHandler", null);
__decorate([
    ContextMenu({ name: "user context", type: ApplicationCommandType.User })
], Example.prototype, "userHandler", null);
Example = __decorate([
    Discord()
], Example);
export { Example };
