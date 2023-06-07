"use client";

import { Todo, TypedColumn } from "@/types";
import { NextPage } from "next";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useBoardStore } from "@/store/BoardStore";

interface ColumnProps {
  id: TypedColumn;
  todos: Todo[];
  index: number;
}

const idToColumnText: {
  [key in TypedColumn]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column: NextPage<ColumnProps> = ({ id, todos, index }) => {
  const [searchString] = useBoardStore((state) => [state.searchString]);

  return (
    // This will be the main Columns : Todo, In Progress, Done
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* This will be the todo list which will be draggable */}
          <Droppable droppableId={index.toString()} type="todos-card">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`p-2 rounded-2xl shadow-sm ${
                  snapshot.isDraggingOver ? "bg-green-200" : "bg-white"
                }`}
              >
                <h2 className="flex items-center justify-between p-2 text-xl font-bold">
                  {idToColumnText[id]}
                  <span className="self-center px-2 py-1 text-sm font-normal bg-gray-200 rounded-full">
                    (
                    {!searchString
                      ? todos.length
                      : todos.filter((todo) => {
                          return todo.title
                            .toLowerCase()
                            .includes(searchString.toLowerCase());
                        }).length}
                    )
                  </span>
                </h2>

                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (
                      searchString &&
                      !todo.title
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    ) {
                      return null;
                    }

                    return (
                      <Draggable
                        key={todo.$id}
                        draggableId={todo.$id}
                        index={index}
                      >
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={todo.$id as TypedColumn}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}

                  <div className="flex items-end justify-end p-2">
                    <button className="text-green-500 hover:text-green-600">
                      <PlusCircleIcon className="w-10 h-10 " />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
