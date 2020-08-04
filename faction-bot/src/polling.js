import * as Discord from 'discord.js';
import CONFIG from '../config/config.json';
import API from './api.js';
import notificationHistoryRepo from './repos/notificationHistoryRepo.js';
import watchChannelRepository from './repos/watchChannelRepository.js';

const { pollInterval, unchangedInterval } = CONFIG;

export const startPolling = (client) => {
  setInterval(() => poll(client), pollInterval * 1000);
};


const poll = async (client) => {
  console.log('Started polling.');

  const factionsState = await API.getFactionData();
  console.log(`Data fetched: ${ JSON.stringify(factionsState) }`);

  const channelIds = watchChannelRepository.getAll();
  console.log(`Channels to be notified: ${ JSON.stringify(channelIds) }`);

  channelIds.forEach(id => {
    const { timestamp, recordedState } = notificationHistoryRepo.getLastNotificationForChannel(id);

    if (enoughTimePassed(timestamp, unchangedInterval) || thereAreChanges(factionsState, recordedState)) {
      console.log(`Notifying channel: ${ id }`);
      notify(id, factionsState, client);
    } else {
      console.log(`Channel "${ id }" not eligible for notification.`);
    }
  });
};
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

const enoughTimePassed = (timestamp, unchangedInterval) => getCurrentTimestamp() - timestamp >= unchangedInterval;

const thereAreChanges = (factionsState, recordedState) => {
  if (factionsState === undefined) return false;
  if (recordedState === undefined) return true;
  if (factionsState.length !== recordedState.length) return false; //bad

  let changes = false;
  for (let i = 0; i < factionsState.length; i++) {
    if (factionsState[i].application_open !== recordedState[i].application_open) {
      changes = true;
      break;
    }
  }

  return changes;
};


const notify = async (id, factionsState, client) => {
  try {
    const channel = await client.channels.fetch(id);
    const discordMessage = createNotificationMessage(factionsState);
    channel.send(discordMessage);
    notificationHistoryRepo.addNotification(id, getCurrentTimestamp(), factionsState);
  } catch (e) {
    console.log('Could not fetch channel with id ' + id);
  }
};

const createNotificationMessage = (factionsState) => {
  const verboseTypeNames = {'peaceful': 'Factiuni pașnice', 'gang': 'Gangsteri', 'department': 'Departamente Politie', 'mixt': 'Mixt'}
  let fields = {};
  factionsState.forEach(({ name, faction_type, application_open, max_members, members_count, minimum_level }) => {
    if (application_open === true) {
      if (fields[faction_type] === undefined)
        fields[faction_type] = [];
      fields[faction_type].push(`${ name } [${ members_count }/${ max_members }] (min. level: ${ minimum_level })`);
    }
  });

  const discordFields = Object.entries(fields).map(([ key, value ]) => ({ name: verboseTypeNames[key], value: value.join('\n') }));
  return new Discord.MessageEmbed()
    .setColor('#ff6300')
    .setTitle('Aplicații deschise')
    .setURL('https://www.rpg2.b-zone.ro/factions/index')
    .addFields(discordFields)
    .setTimestamp()
    .setFooter('Created by paulcbn and CoLuiza.');
};

