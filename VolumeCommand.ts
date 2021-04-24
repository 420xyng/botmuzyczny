import { BaseCommand } from "../structures/BaseCommand";
import { IMessage } from "../../typings";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isUserInTheVoiceChannel, isMusicPlaying, isSameVoiceChannel } from "../utils/decorators/MusicHelper";
import { createEmbed } from "../utils/createEmbed";

@DefineCommand({
    aliases: ["vol"],
    name: "volume",
    description: "Show or change the music player's volume",
    usage: "{prefix}volume [new volume]"
})
export class VolumeCommand extends BaseCommand {
    @isUserInTheVoiceChannel()
    @isMusicPlaying()
    @isSameVoiceChannel()
    public execute(message: IMessage, args: string[]): any {
        let volume = Number(args[0]);

        if (isNaN(volume)) return message.channel.send(createEmbed("info", `🔊 **|** Aktualny poziom głośności **\`${message.guild!.queue!.volume.toString()}\`**`));

        if (volume < 0) volume = 0;
        if (volume === 0) return message.channel.send(createEmbed("error", "Zatrzymaj muzykę przed zmianą głośności **\`0\`**"));
        if (Number(args[0]) > this.client.config.maxVolume) {
            return message.channel.send(
                createEmbed("error", `Nie można ustawić głośności powyżej **\`${this.client.config.maxVolume}\`**`)
            );
        }

        message.guild!.queue!.volume = Number(args[0]);
        message.guild!.queue!.connection?.dispatcher.setVolume(Number(args[0]) / this.client.config.maxVolume);
        message.channel.send(createEmbed("info", `🔊 **|** Poziom głośnośći zmieniony na **\`${args[0]}\`**`)).catch(console.error);
    }
}
