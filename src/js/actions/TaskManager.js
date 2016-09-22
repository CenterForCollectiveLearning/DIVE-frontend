export default class TaskManager {
  constructor() {
    this.currentTasks = [];
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

  addTask(taskId, taskType) {
    var tasks = this.currentTasks;

    const otherTaskIds = tasks
      .filter((task) => ((task.id != taskId) && (task.type == taskType)))
      .map((task) => task.id);

    if (tasks.find((oldTask) => (oldTask.id == taskId)) == undefined) {
       tasks.push({ id: taskId, type: taskType });
    }

    this.setTasks(tasks);
    // console.log('Adding task of type', taskType, taskId, tasks);
    return otherTaskIds;
  }

  removeTask(taskId) {
    var remainingTasks = this.currentTasks.filter((task) => task.id != taskId);
    // console.log('Removing task', taskId, remainingTasks);
    this.setTasks(remainingTasks);
  }

  removeTasks(taskIds) {
    var remainingTasks = this.currentTasks.filter((task) => taskIds.indexOf(task.id) == -1);
    // console.log('Removing TASKS', taskIds, remainingTasks);
    this.setTasks(remainingTasks);
  }
}
