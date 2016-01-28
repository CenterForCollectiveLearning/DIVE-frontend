export default class TaskManager {
  constructor() {
    this.state = {
      currentTasks: []
    };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  getTasks(taskIds) {
    var tasks = this.state.currentTasks;

    if (taskIds) {
      tasks = tasks.filter((task) => (taskIds.indexOf(task.id) != -1));
    }

    return tasks.map((task) => task.id);
  }

  addTasks(taskIds, taskType) {
    var tasks = this.state.currentTasks.slice();
    const otherTasks = tasks
      .filter((task) => ((taskIds.indexOf(task.id) == -1) && (task.type == taskType)))
      .map((task) => task.id);

    taskIds.forEach((newTaskId) => {
      if (tasks.find((oldTask) => (oldTask.id == newTaskId)) == undefined) {
        tasks.push({ id: newTaskId, type: taskType });
      }
    });

    this.setState({ currentTasks: tasks });
    return otherTasks;
  }

  removeTasks(taskIds) {
    var tasks = this.state.currentTasks.slice();
    tasks = tasks.filter((task) => taskIds.indexOf(task.id) == -1);
    this.setState({ currentTasks: tasks });
  }
}
