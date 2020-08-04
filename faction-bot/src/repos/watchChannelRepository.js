let container = new Set();

const addWatchId = (id) => {
  container.add(id);
};

const removeWatchId = (id) => {
  container.remove(id);
};

const getAll = () => Array.from(container);

export default { addWatchId, removeWatchId, getAll };