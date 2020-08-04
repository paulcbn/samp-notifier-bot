import watchChannelRepository from '../repos/watchChannelRepository.js';


const execute = (callerMessage, args) => {
  try {
    const channelId = callerMessage.channel.id;
    watchChannelRepository.removeWatchId(channelId);
    console.log(`I've started watching the channel ${ callerMessage.channel.name }.`);
    callerMessage.channel.send(`I've stopped watching the channel ${ callerMessage.channel.name }.`);
  } catch (e) {
    console.log(`Could not watch channel ${ callerMessage.channel }`);
    callerMessage.channel.send('Could not stop watching channel.');
  }
};

export default {
  help: 'Use me to set the channel im gonna spam you in.',
  execute,
};