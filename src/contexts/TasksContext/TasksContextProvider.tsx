import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { incentives } from "src/content";
import { TasksContext } from "src/contexts/TasksContext/TasksContext";
import type { Task } from "src/contexts/TasksContext/TasksContext.types";
import { useLocalStorage } from "src/hooks/useLocalStorage";

export const TasksContextProvider = ({ children }: PropsWithChildren) => {
  const [storedTasks, setStoredTasks] = useLocalStorage(
    "persistentTasks",
    Array<string>(5).fill("")
  );
  const [tasks, setTasks] = useState(storedTasks);
  const [message, setMessage] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<undefined | NodeJS.Timeout>(undefined);

  const memoizedTasks = useMemo(() => tasks, [tasks]);
  const previousTasks = useRef<string[]>([]);

  const getRandomIncentive = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

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
  }, [previousTasks]);

  const clearTasks = useCallback(() => {
    setTasks(Array(5).fill(""));
    displayMessage("tasks cleared!");
  }, [displayMessage, setTasks]);

  useEffect(() => {
    setStoredTasks(tasks);
  }, [tasks, setStoredTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks: memoizedTasks,
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
