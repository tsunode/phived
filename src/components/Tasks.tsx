import { useState } from "react";
import { useTasksContext } from "src/contexts";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DragIcon } from "src/components/icons/DragIcon";
import { Input } from "src/components/Input";

export function Tasks() {
  const { tasks, completeTask, setTasks } = useTasksContext();
  const tasksLength = tasks.filter((t) => t.trim() !== "").length;
  const [dragging, setDragging] = useState(false);

  const handleDone = (i: number) => {
    completeTask(i);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, i: number) => {
    switch (event.key) {
      case "Enter":
        if (event.ctrlKey) {
          event.preventDefault();
          return handleDone(i);
        }
        if (event.shiftKey) {
          event.preventDefault();
          return document.querySelectorAll("input")[i - 1]?.focus();
        }
        if (!event.ctrlKey) {
          event.preventDefault();
          return document.querySelectorAll("input")[i + 1]?.focus();
        }
    }
  };

  function handleDragEnd(result: DropResult) {
    const destinationIndex = result.destination?.index;

    if (destinationIndex || destinationIndex === 0) {
      setTasks((prev) => {
        const actualTasks = [...prev];
        const draggedTask = actualTasks.splice(result.source.index, 1)[0];
        actualTasks.splice(destinationIndex, 0, draggedTask);

        const filledTasks = actualTasks.filter((t) => t !== "");
        const newTasksArray = Array(5).fill("");
        newTasksArray.splice(0, filledTasks.length, ...filledTasks);

        return newTasksArray;
      });
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setDragging(false);
  }

  const tasksMap = tasks.map((task, idx) => {
    const isFirstTask = idx === 0;
    const isLastTask = idx === tasks.length - 1;
    const isEmptyTask = task.trim() === "";

    return (
      <Draggable draggableId={idx.toString()} index={idx} key={idx}>
        {(provided, snapshot) => {
          const draggingTask = snapshot.isDragging;
          return (
            <div
              key={idx}
              className={`group flex w-full ${draggingTask && "cursor-grabbing"}`}
              {...provided.draggableProps}
              ref={provided.innerRef}
            >
              <Input
                index={idx}
                initialValue={task}
                isFirstElement={isFirstTask}
                isLastElement={isLastTask}
                hasTask={tasksLength > 1}
              />
              <span
                /* rbd hardcodes dragHandle tabIndex to 0 by default, hence why this line doesn't work
                https://github.com/atlassian/react-beautiful-dnd/issues/1827 */
                tabIndex={-1}
                className={`${!isLastTask && "border-b"} ${
                  isEmptyTask || tasksLength <= 1 || (!draggingTask && dragging)
                    ? "hidden"
                    : "max-lg:active:flex max-lg:peer-focus:flex lg:group-hover:flex"
                } ${
                  !draggingTask && "hidden"
                } flex items-center justify-center bg-lighterWhite pr-2 text-darkerBlack placeholder:select-none hover:cursor-grab dark:bg-darkBlack dark:text-lighterWhite xs:text-lg`}
                {...provided.dragHandleProps}
              >
                <DragIcon />
              </span>
              <button
                onClick={() => handleDone(idx)}
                className={`${isFirstTask && "rounded-tr-2xl"} ${isLastTask && "rounded-br-2xl"} ${
                  isEmptyTask || (!draggingTask && dragging)
                    ? "hidden"
                    : "max-lg:active:flex max-lg:peer-focus:flex lg:group-hover:flex"
                } ${
                  !draggingTask && "hidden"
                } w-36 cursor-pointer items-center justify-center border-l border-b bg-berryBlue text-base dark:bg-purpleRain dark:text-lighterWhite xs:text-lg`}
              >
                done?
              </button>
            </div>
          );
        }}
      </Draggable>
    );
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-72 overflow-hidden rounded-2xl border shadow-brutalist-dark dark:border-lighterWhite dark:shadow-brutalist-light tiny:w-80 xs:w-96"
    >
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setDragging(true)}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tasksMap}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </form>
  );
}
