import { Models } from "appwrite";

interface Board {
  columns: Map<TypedColumn, ColumnType>;
}

type TypedColumn = "todo" | "inprogress" | "done";

interface ColumnType {
  id: TypedColumn;
  todos: Todo[];
}

interface Todo extends Models.Document {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumn;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
