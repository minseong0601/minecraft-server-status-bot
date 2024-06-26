import Discord, { Guild } from 'discord.js';
import axios from 'axios';
import fs from 'fs';

const client = new Discord.Client({
    intents: [ 'Guilds' ]
});

setInterval(async () => {
    const { status, data } = await axios.get(`https://api.mcsrvstat.us/3/${JSON.parse(fs.readFileSync('./config.json', 'utf-8')).serverAddress}`);
    
    if ( status >= 200 && status < 300 ) {
        const onlineCount = client.channels.cache.find(channel => channel.id === '1255455700210024468') as Discord.VoiceChannel;

        data.online ? console.log(`Server is online ${data.players.online}`) : console.log("Server is offline");

        if (data.online === true) {
            await onlineCount.setName(`접속중인 유저 ${data.players.online} 명`);
            await client.user?.setActivity(`접속중인 유저 ${data.players.online} 명`);
        } else {
            await onlineCount.setName(`서버 오프라인`);
        }
    } else {
        console.log("Failed to get data");
    }
}, 30 * 1000);

client.on('interactionCreate', async interaction => {
    if (!interaction.inGuild) return

    if(interaction.isChatInputCommand()) {
        if(interaction.commandName === 'bind') {
            const address = interaction.options.getString('address', true);

            const addressVC = interaction.guild?.channels.cache.find(channel => channel.id === `1254247481521340507`) as Discord.VoiceChannel;

            fs.writeFileSync(`./config.json`, JSON.stringify({ serverAddress: address }));

            await interaction.guild?.channels.edit(addressVC, { name: `${address}` });
            await interaction.reply(`server address updated to ${address}`);
        }
    }
});

client.on('ready', () => console.log(`${client.user?.tag} is ready!`));

client.login("");
