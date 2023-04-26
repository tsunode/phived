import type { PropsWithChildren } from "react";
import { useCallback, useMemo, useState, useRef } from "react";
import { incentives } from "src/content";
import { TasksContext } from "src/contexts/TasksContext/TasksContext";
import type { Task } from "src/contexts/TasksContext/TasksContext.types";
import { useLocalStorage } from "src/hooks/useLocalStorage";

export const TasksContextProvider = ({ children }: PropsWithChildren) => {
  const [tasks, setTasks] = useLocalStorage("persistentTasks", Array<string>(5).fill(""));
  const [message, setMessage] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<undefined | NodeJS.Timeout>(undefined);

  const previousTasks = useRef<string[]>([]);

  const getRandomIncentive = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  console.log("oi");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const incentive = useMemo(() => getRandomIncentive(incentives), [tasks]);

  const displayMessage = useCallback(
    (message: string) => {
      setMessage(message);
      clearTimeout(timeoutId);
      const newTimeoutId = setTimeout(() => {
        setMessage("");
      }, 3500);

      setTimeoutId(newTimeoutId);
    },
    [timeoutId]
  );

  const changeTask = useCallback(
    (taskIndex: number, newValue: Task) => {
      console.log("new value");
      const taskCopy = [...tasks];
      taskCopy[taskIndex] = newValue;

      setTasks(taskCopy);
    },
    [tasks, setTasks]
  );

  const completeTask = useCallback(
    (index: number) => {
      if (!tasks[index]) return;

      const ongoingTasks = tasks.filter((_, idx) => idx !== index);
      setTasks([...ongoingTasks, ""]);
      previousTasks.current = tasks;
      displayMessage(incentive);
    },
    [displayMessage, incentive, tasks, setTasks]
  );

  const undoneTask = useCallback(() => {
    setTasks(previousTasks.current);
  }, [previousTasks, setTasks]);

  const clearTasks = useCallback(() => {
    setTasks(Array(5).fill(""));
    displayMessage("tasks cleared!");
  }, [displayMessage, setTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        completeTask,
        changeTask,
        clearTasks,
        displayMessage,
        message,
        setMessage,
        undoneTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
