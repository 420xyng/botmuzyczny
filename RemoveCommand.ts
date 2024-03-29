import { IMessage } from "../../typings";
import { BaseCommand } from "../structures/BaseCommand";
import { createEmbed } from "../utils/createEmbed";
import { DefineCommand } from "../utils/decorators/DefineCommand";
import { isMusicPlaying, isSameVoiceChannel, isUserInTheVoiceChannel } from "../utils/decorators/MusicHelper";

@DefineCommand({
    aliases: ["rm", "delete"],
    name: "remove",
    description: "Remove a song from the current queue",
    usage: "{prefix}remove <Song number>"
})
export class RemoveCommand extends BaseCommand {
    @isMusicPlaying()
    @isUserInTheVoiceChannel()
    @isSameVoiceChannel()
    public execute(message: IMessage, args: string[]): any {
        if (isNaN(Number(args[0]))) return message.channel.send(createEmbed("error", `Niepoprawne użycie, użyj **\`${this.client.config.prefix}help ${this.meta.name}\`** dla większej ilości informacji`));

        const songs = message.guild!.queue!.songs.map(s => s);
        const currentSong = message.guild!.queue!.songs.first()!;
        const song = songs[Number(args[0]) - 1];

        if (currentSong.id === song.id) {
            message.guild!.queue!.playing = true;
            message.guild?.queue?.connection?.dispatcher.once("speaking", () => message.guild?.queue?.connection?.dispatcher.end());
            message.guild!.queue?.connection?.dispatcher.resume();
        } else {
            message.guild?.queue?.songs.delete(message.guild.queue.songs.findKey(x => x.id === song.id)!);
        }

        message.channel.send(
            createEmbed("info", `✅ Usunięto **[${song.title}](${song.url}})**`)
                .setThumbnail(song.thumbnail)
        ).catch(e => this.client.logger.error("REMOVE_COMMAND_ERR:", e));
    }
}
