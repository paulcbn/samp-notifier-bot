let container = {};

const addNotification = (id, timestamp, recordedState) => {
  container[id] = { timestamp, recordedState };
};

const getLastNotificationForChannel = (id) => {
  if (container[id] === undefined) return {};
  return container[id];
};

export default { addNotification, getLastNotificationForChannel };