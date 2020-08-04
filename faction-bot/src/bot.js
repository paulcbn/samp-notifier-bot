import CONFIG from '../config/config.json';
import Discord from 'discord.js';
import addWatchCommand from './commands/addWatch.js';
import removeWatchCommand from './commands/removeWatch.js';
import debugCommand from './commands/debug.js';
import { startPolling } from './polling.js';

const { token, prefix } = CONFIG;
const client = new Discord.Client();


client.on('ready', () => {
  console.log(`Logged in as ${ client.user.tag }!`);
  startPolling(client);
  // client.channels.fetch('729423718568427562')
  //   .then(channel => console.log(channel.name))
  //   .catch(console.error);
});

const COMMANDS = {
  'watch': addWatchCommand,
  'unwatch': removeWatchCommand,
  'debug': debugCommand,
};


client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = COMMANDS[commandName];

  if (command === undefined) {
    message.reply('unknown command!');
    return;
  }

  command.execute(message, args);
});

client.login(token);


