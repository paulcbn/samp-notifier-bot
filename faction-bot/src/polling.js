import API from './api.js';
import CONFIG from '../config/config.json';
import notificationHistoryRepo from './repos/notificationHistoryRepo.js';
import watchChannelRepository from './repos/watchChannelRepository.js';

const { pollInterval, unchangedInterval } = CONFIG;

export const startPolling = (client) => {
  setInterval(() => poll(client), pollInterval*1000);
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

const enoughTimePassed = (timestamp, unchangedInterval) => true; //TODO later

const thereAreChanges = (factionsState, recordedState) => {
  if (factionsState === undefined) return false;
  if (recordedState === undefined) return true;
  if (factionsState.length !== recordedState.length) return false; //bad

  let changes = false;
  for (let i = 0; i < factionsState.length; i++) {
    if (factionsState[i].application_open !== factionsState[i].application_open) {
      changes = true;
      break;
    }
  }

  return changes;
};

const notify = async (id, factionsState, client) => {
  try {
    const channel = await client.channels.fetch(id);
    channel.send(JSON.stringify(factionsState));
    notificationHistoryRepo.addNotification(id, 0, factionsState);
  } catch (e) {
    console.log('Could not fetch channel with id ' + id);
  }
};

