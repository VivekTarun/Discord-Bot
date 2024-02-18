const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Replies with start!'),
    async execute(interaction) {
        await interaction.reply('yes start!');
    },
};