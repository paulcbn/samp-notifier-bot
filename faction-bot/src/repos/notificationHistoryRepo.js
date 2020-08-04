let container = {};

const addNotification = (id, timestamp, recordedState) => {
  container[id] = { timestamp, recordedState };
};

const getLastNotificationForChannel = (id) => {
  return container[id];
};

export default { addNotification, getLastNotificationForChannel };