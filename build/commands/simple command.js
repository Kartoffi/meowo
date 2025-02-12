var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Discord, SimpleCommand, SimpleCommandOption, SimpleCommandOptionType, Slash, } from "discordx";
let Example = class Example {
    async hello(command) {
        const member = command.message.member;
        if (member) {
            await command.message.reply(`👋 ${member.toString()}`);
        }
        else {
            await command.message.reply("👋 hello");
        }
    }
    async sum(num1, num2, command) {
        if (!num1 || !num2) {
            await command.sendUsageSyntax();
            return;
        }
        await command.message.reply(`total = ${String(num1 + num2)}`);
    }
    // make single handler for simple and slash command
    async likeIt(command) {
        await command.reply("I like it, Thanks");
    }
    async simpleLikeIt(command) {
        await this.likeIt(command.message);
    }
    async slashLikeIt(command) {
        await this.likeIt(command);
    }
};
__decorate([
    SimpleCommand({ aliases: ["hi"] })
], Example.prototype, "hello", null);
__decorate([
    SimpleCommand({ argSplitter: "+" }),
    __param(0, SimpleCommandOption({ name: "num1", type: SimpleCommandOptionType.Number })),
    __param(1, SimpleCommandOption({ name: "num2", type: SimpleCommandOptionType.Number }))
], Example.prototype, "sum", null);
__decorate([
    SimpleCommand({ name: "like-it" })
], Example.prototype, "simpleLikeIt", null);
__decorate([
    Slash({ description: "like-ite", name: "like-it" })
], Example.prototype, "slashLikeIt", null);
Example = __decorate([
    Discord()
], Example);
export { Example };
