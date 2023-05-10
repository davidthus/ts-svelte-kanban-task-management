export interface IBoard {
  name: string;
  columns: IColumn[];
}

export interface IColumn {
  name: string;
  tasks: ITask[];
}

export interface ITask {
  title: string;
  description: string;
  status: string;
  subtasks: ISubtask[];
}

export interface ISubtask {
  title: string;
  isCompleted: string;
}