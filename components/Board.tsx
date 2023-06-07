"use client";

import { useBoardStore } from "@/store/BoardStore";
import { Board, ColumnType, TypedColumn } from "@/types";
import { NextPage } from "next";
import { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

interface BoardProps {}

const TodoBoard: NextPage<BoardProps> = () => {
  const [getBoard, board, setBoardState, updateTodoInDB] = useBoardStore(
    (state) => [
      state.getBoard,
      state.board as Board,
      state.setBoardState,
      state.updateTodoInDB,
    ]
  );

  useEffect(() => {
    // Get Board Data
    getBoard();
  }, [getBoard]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If there is no destination, do nothing
    if (!destination) return;

    // If the destination is the same as the source, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // If the type is column
    if (type === "column") {
      // Get the column entries
      const entries = Array.from(board.columns.entries());

      // Remove the column from the original position
      const [removed] = entries.splice(source.index, 1);

      // Add the column to the new position
      entries.splice(destination.index, 0, removed);

      // Create a new board
      const newBoard = {
        columns: new Map(entries),
      };

      // Update the board
      setBoardState(newBoard);

      // Update the board in the database (not implemented yet)

      return;
    }

    // If the type is todos-card
    // Indexes are stored as numbers, so we need to convert them

    // Copy the source column and destination column
    const columns = Array.from(board.columns);
    const sourceColumn = columns[Number(source.droppableId)];
    const destinationColumn = columns[Number(destination.droppableId)];

    // Rebuild Source Column
    const newSourceColumn: ColumnType = {
      id: sourceColumn[0],
      todos: sourceColumn[1].todos,
    };

    // Rebuild Destination Column
    const newDestinationColumn: ColumnType = {
      id: destinationColumn[0],
      todos: destinationColumn[1].todos,
    };

    // If not source column or destination column do nothing
    if (!newSourceColumn || !newDestinationColumn) return;

    // If source index is the same as destination index and source column is the same as destination column do nothing
    if (
      source.index === destination.index &&
      newSourceColumn === newDestinationColumn
    )
      return;

    // Drag and Drop logic for Todos
    const newTodos = newSourceColumn.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    // Dragging in the same column (todos)
    if (newSourceColumn.id === newDestinationColumn.id) {
      // Same column
      newTodos.splice(destination.index, 0, todoMoved);

      const newColumn = {
        id: newSourceColumn.id,
        todos: newTodos,
      };

      const newColumns: Map<TypedColumn, ColumnType> = new Map(board.columns);

      newColumns.set(newSourceColumn.id, newColumn);

      // Update the board
      setBoardState({
        ...board,
        columns: newColumns,
      });
    } else {
      // Different column (todos)

      // Add the todo to the new destination column
      const finsihsedTodos = Array.from(newDestinationColumn.todos);
      finsihsedTodos.splice(destination.index, 0, todoMoved);

      // Copy Destination Column
      const newColumn = {
        id: newSourceColumn.id,
        todos: newTodos,
      };
      const newColumns: Map<TypedColumn, ColumnType> = new Map(board.columns);

      newColumns.set(newSourceColumn.id, newColumn);
      newColumns.set(newDestinationColumn.id, {
        id: newDestinationColumn.id,
        todos: finsihsedTodos,
      });

      console.log("newColumns", newColumns);

      // Update the board
      setBoardState({
        ...board,
        columns: newColumns,
      });

      // Update the board in the database (not implemented yet)
      updateTodoInDB(todoMoved, newDestinationColumn.id);
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 gap-5 mx-auto md:grid-cols-3 max-w-7xl"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TodoBoard;
