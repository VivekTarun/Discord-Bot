const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('truefalse')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await interaction.reply('truefalse!');
    },
};