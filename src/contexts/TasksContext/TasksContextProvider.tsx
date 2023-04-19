import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { incentives } from "src/content";
import { TasksContext } from "src/contexts/TasksContext/TasksContext";
import type { Task } from "src/contexts/TasksContext/TasksContext.types";
import { useLocalStorage } from "src/hooks/useLocalStorage";
import { usePrevious } from "src/hooks/usePrevious";

export const TasksContextProvider = ({ children }: PropsWithChildren) => {
  const [storedTasks, setStoredTasks] = useLocalStorage(
    "persistentTasks",
    Array<string>(5).fill("")
  );
  // const [tasks, setTasks] = useState(storedTasks);
  const [message, setMessage] = useState<string>("");
  const [timeoutId, setTimeoutId] = useState<undefined | NodeJS.Timeout>(undefined);

  // const memoizedTasks = useMemo(() => tasks, [tasks]);
  const previousTasks = usePrevious<string[]>(storedTasks);

  const getRandomIncentive = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const incentive = useMemo(() => getRandomIncentive(incentives), [storedTasks]);

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
      const taskCopy = [...storedTasks];
      taskCopy[taskIndex] = newValue;

      setStoredTasks(taskCopy);
    },
    [storedTasks, setStoredTasks]
  );

  const completeTask = useCallback(
    (index: number) => {
      if (!storedTasks[index]) return;

      const ongoingTasks = storedTasks.filter((_, idx) => idx !== index);
      setStoredTasks([...ongoingTasks, ""]);
      displayMessage(incentive);
    },
    [displayMessage, incentive, storedTasks, setStoredTasks]
  );

  const undoneTask = useCallback(() => {
    previousTasks && setStoredTasks(previousTasks);
  }, [previousTasks, setStoredTasks]);

  const clearTasks = useCallback(() => {
    setStoredTasks(Array(5).fill(""));
    displayMessage("tasks cleared!");
  }, [displayMessage, setStoredTasks]);

  return (
    <TasksContext.Provider
      value={{
        tasks: storedTasks,
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
