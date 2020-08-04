import watchChannelRepository from '../repos/watchChannelRepository.js';


const execute = (callerMessage, args) => {
  watchChannelRepository.getAll().forEach(id => console.log(id));
};

export default {
  help: 'debug',
  execute,
};