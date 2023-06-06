"use client";

import { useBoardStore } from "@/store/BoardStore";
import { NextPage } from "next";
import { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

interface BoardProps {}

const Board: NextPage<BoardProps> = () => {
  const getBoard = useBoardStore((state) => state.getBoard);

  useEffect(() => {
    // Get Board Data
    getBoard();
  }, [getBoard]);

  return (
    <h1>Hello</h1>
    // <DragDropContext>
    //   <Droppable droppableId="board" direction="horizontal" type="column">
    //     {(provided) => <div></div>}
    //   </Droppable>
    // </DragDropContext>
  );
};

export default Board;
