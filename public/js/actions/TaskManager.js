export default class TaskManager {
  constructor() {
    this.state = {
      currentTasks: []
    };    
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
  }

  getTasks() {
    return this.state.currentTasks.map((task) => task.id);
  }

  addTask(taskId, taskType) {
    var tasks = this.state.currentTasks.slice();
    const otherTasks = tasks.find((task) => (task.type == taskType));
    if (tasks.find((task) => (task.id == taskId)) == undefined) {
      tasks.push({ id: taskId, type: taskType });
      this.setState({ currentTasks: tasks });
    }
    return otherTasks;
  }
}

