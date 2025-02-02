const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const clientId = process.env['CLIENT_ID'];
const guildId = process.env['GUILD_ID'];

module.exports = (client) => {
  client.handleCommands = async (commandFolders, path) => {
    client.commandArray = [];
    for (folder of commandFolders) {
      const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const command = require(`.${path}/${folder}/${file}`);

        client.commands.set(command.data.name, command);
        client.commandArray.push(command.data.toJSON());

      }
    }

    const rest = new REST({ version: '9' }).setToken(process.env['DISCORD_TOKEN']);

    (async () => {
      try {
        console.log('Reloading application (/) commands.');

        await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          { body: client.commandArray },
        );

        console.log('Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error(error);
      }
    })();

  };
};
