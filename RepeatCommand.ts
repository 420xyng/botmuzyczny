/* eslint-disable sort-keys */
import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicPlaying, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["loop", "music-repeat", "music-loop"],
    name: "repeat",
    description: "Repeat current music or the queue",
    usage: "{prefix}repeat [all | one | disable]"
})
export class RepeatCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage, args: string[]): any {
        const modes: Record<any, 0 | 1 | 2> = {
            // Repeat All Music in Queue
            all: 2,
            queue: 2,
            "*": 2,
            2: 2,
            // Repeat current music
            current: 1,
            this: 1,
            one: 1,
            music: 1,
            1: 1,
            // Disable repeat
            disable: 0,
            none: 0,
            off: 0,
            0: 0
        };
        const modeTypes = ["OFF", "ONE", "ALL"];
        const modeEmoji = ["▶", "🔂", "🔁"];
        const mode = args[0] as string | undefined;
        if (mode === undefined) {
            message.channel.send(createEmbed("info", `${modeEmoji[message.guild!.queue!.loopMode]} **|** Aktualny tryb powtarzania muzyki jest ustawiony na **\`${modeTypes[message.guild!.queue!.loopMode]}\`**`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        } else if (Object.keys(modes).includes(mode)) {
            message.guild!.queue!.loopMode = modes[mode];
            message.channel.send(createEmbed("info", `${modeEmoji[message.guild!.queue!.loopMode]} **|** Tryb powtarzania muzyki został ustawiony na **\`${modeTypes[message.guild!.queue!.loopMode]}\`**`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        } else {
            message.channel.send(createEmbed("error", `Niepoprawne użycie, użyj **\`${this.client.config.prefix}help ${this.meta.name}\`** dla większej ilości informacji`))
                .catch(e => this.client.logger.error("REPEAT_CMD_ERR:", e));
        }
    }
}
