import { useEffect, useMemo, useState } from "react";
import { placeholders } from "src/content";
import { useTasksContext } from "src/contexts";

interface IInputProps {
  index: number;
  initialValue: string;
  isFirstElement: boolean;
  isLastElement: boolean;
  hasTask: boolean;
}

export function Input({
  index,
  initialValue,
  isFirstElement,
  isLastElement,
  hasTask,
}: IInputProps) {
  const { changeTask } = useTasksContext();
  const [value, setValue] = useState(initialValue || "");
  const isEmptyValue = value.trim() === "";

  const getRandomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  const placeholder = useMemo(() => getRandomElement(placeholders), []);

  useEffect(() => {
    const handleUnload = () => changeTask(index, value);

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [index, value, changeTask]);

  return (
    <input
      type="text"
      autoFocus={isFirstElement}
      value={value}
      // onKeyDown={(event) => handleKeyDown(event, idx)}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => changeTask(index, value)}
      autoComplete="off"
      placeholder={`${isFirstElement ? placeholder : `task-${index + 1}`}`}
      className={`peer w-full ${!isEmptyValue && hasTask && "group-hover:pr-2"} ${
        isFirstElement
          ? `rounded-t-2xl ${!isEmptyValue && "focus:rounded-tr-none lg:rounded-tr-none"}`
          : "placeholder:text-lighterWhite dark:placeholder:text-darkBlack"
      } ${
        isLastElement
          ? `rounded-b-2xl ${!isEmptyValue && "focus:rounded-br-none lg:rounded-br-none"}`
          : "border-b"
      } bg-lighterWhite py-4 px-5 text-darkerBlack placeholder:select-none focus:outline-none dark:bg-darkBlack dark:text-lighterWhite xs:text-lg`}
    />
  );
}
