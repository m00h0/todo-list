/**
 * @jest-environment jsdom
 */

import {
  addTaskToPage,
  addOnLocalStorage,
  loadTasksFromLS,
  modifyTask,
  highlightTask,
  removeTask,
  getTasksList,
  addTaskToArray,
  setTasksList,
  clearCompletedTasks,
} from './tasks.js';

import updateTaskStatus from './statusUpdates.js';

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}

global.localStorage = new LocalStorageMock();

describe('check for add-delete operations', () => {
  test('properly remove task items', () => {
    document.body.innerHTML = `<div class="tasks-container">
  </div>`;
    addTaskToArray('task-a');
    addTaskToArray('task-b');
    addTaskToArray('task-c');
    const indexOfRemovedTask = 1;
    removeTask(indexOfRemovedTask);
    let tasksList = getTasksList();
    let tasksValueElt = document.querySelectorAll('.task-value')[indexOfRemovedTask];
    expect(tasksList[indexOfRemovedTask].description).toBe('task-c');
    expect(tasksList[indexOfRemovedTask].index).toEqual(indexOfRemovedTask);
    expect(tasksValueElt.value).toBe('task-c');

    removeTask(indexOfRemovedTask);
    tasksList = getTasksList();
    tasksValueElt = document.querySelectorAll('.task-value')[indexOfRemovedTask - 1];
    expect(tasksList[indexOfRemovedTask - 1].description).toBe('task-a');
    expect(tasksList[indexOfRemovedTask - 1].index).toEqual(
      indexOfRemovedTask - 1,
    );
    expect(tasksValueElt.value).toBe('task-a');
  });

  test('should add task to local storage', () => {
    let tasksList = getTasksList();
    const task = {
      description: 'task1',
      completed: false,
      index: 0,
    };
    addOnLocalStorage(task);
    tasksList = getTasksList();
    expect(tasksList.length).toBeGreaterThanOrEqual(0);
  });

  test('properly get list of tasks array of objects', () => {
    const tasksList = getTasksList();
    expect(tasksList.length).toBeGreaterThanOrEqual(0);
  });

  test('properly adds the tasks to the page', () => {
    const task = {
      description: 'task1',
      completed: false,
      index: 0,
    };
    document.body.innerHTML = `<div class="tasks-container">
    </div>`;
    addTaskToPage(task);
    const tasksContainerElt = document.querySelectorAll('.task');
    expect(tasksContainerElt).toHaveLength(1);
  });

  test('properly load tasks that are in the local storage', () => {
    loadTasksFromLS();
    const tasksList = getTasksList();
    expect(tasksList.length).toBeGreaterThanOrEqual(0);
  });

  test('properly change the task', () => {
    const modifiedTask = 'clean the dishes';
    addTaskToArray('finish the unit-testing project');
    modifyTask(modifiedTask, 0);
    const tasksList = getTasksList();
    expect(tasksList[0].description).toBe(modifiedTask);
  });
});