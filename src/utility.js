function getLocalStorageItem(key) {
  const storedItem = localStorage.getItem(key);
  return storedItem ? JSON.parse(storedItem) : [];
}

const tasks = getLocalStorageItem("tasks");
console.log(tasks);

export { tasks };
