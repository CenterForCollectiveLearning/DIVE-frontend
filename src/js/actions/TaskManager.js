export class Task {
  constructor(taskId, taskMode, taskType) {
    const creationTime = Date.now();
    this.id = taskId;
    this.mode = taskMode;
    this.type = taskType;
    this.creationTime = creationTime;
    this.lastPollTime = creationTime;
  }

  updatePollTime() {
    this.lastPollTime = Date.now();
  }
}

export default class TaskManager {
  constructor() {
    this.currentTasks = [];
  }

  outputStateAsTable() {
    console.table(this.currentTasks);
  }

  getTask(taskId) {
    return this.currentTasks.find((task) => task.id == taskId);
  }

  updateTask(taskId) {
    const task = this.currentTasks.find((task) => task.id == taskId);
    if (task) {
      task.updatePollTime();
    }
    return task;
  }

  isActiveTask(taskId) {
    return (this.currentTasks.findIndex((task) => task.id == taskId) > -1);
  }

  getAllTasks() {
    return this.currentTasks;
  }

  setTasks(tasks) {
    this.currentTasks = tasks;
  }

  getTasksByID(taskIds) {
    var tasks = this.currentTasks;

    if (taskIds.length > 0) {
      tasks = tasks.filter((task) => (taskIds.indexOf(task.id) != -1));
    }

    return tasks.map((task) => task.id);
  }

  addTask(taskId, taskMode, taskType) {
    var existingTasks = this.currentTasks.slice();
    var newTask = new Task(taskId, taskMode, taskType);

    const tasksOfDifferentMode = existingTasks
      .filter((task) => (task.mode != taskMode))
      .map((task) => task.id);

    const otherTaskIdsOfSameType = existingTasks
      .filter((task) => ((task.id != taskId) && (task.type == taskType) && (task.creationTime < newTask.creationTime)))
      .map((task) => task.id);

    if (existingTasks.find((t) => (t.id == taskId)) == undefined) {
       this.setTasks([...existingTasks, newTask]);
    }

    return {
      differentMode: tasksOfDifferentMode,
      sameType: otherTaskIdsOfSameType
    }
  }

  removeTask(taskId) {
    var remainingTasks = this.currentTasks.filter((task) => task.id != taskId);
    this.setTasks(remainingTasks);
  }

  removeTasks(taskIds) {
    var remainingTasks = this.currentTasks.filter((task) => taskIds.indexOf(task.id) == -1);
    this.setTasks(remainingTasks);
  }
}
