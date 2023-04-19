import type { Dispatch, SetStateAction } from "react";

export type Task = string;

export type Tasks = Task[];

export type TaskContextType = {
  tasks: Tasks;
  message: string;
  setMessage: Dispatch<SetStateAction<TaskContextType["message"]>>;
  displayMessage: (incentive: string) => void;
  completeTask: (index: number) => void;
  clearTasks: () => void;
  changeTask: (taskIndex: number, newValue: Task) => void;
  undoneTask: () => void;
};
