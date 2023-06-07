import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { Board, ColumnType, Todo, TypedColumn } from "@/types";
import { create } from "zustand";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { databases } from "@/appwrite";

interface BoardState {
  board: Board | null;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;

  searchString: string;
  setSearchString: (searchString: string) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, ColumnType>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_COLLECTION_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
        ...(todo.image && { image: JSON.stringify(todo.image) }),
      }
    );
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),
}));

mountStoreDevtool("BoardStore", useBoardStore);
