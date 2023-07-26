import { getTasksList } from './tasks.js';

const updateTaskStatus = (index) => {
  const tasksList = getTasksList();
  tasksList[index].completed = !tasksList[index].completed;
  localStorage.setItem('tasks: ', JSON.stringify(tasksList));
};

export default updateTaskStatus;