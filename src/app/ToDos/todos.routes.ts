import express, { type Request, type Response } from "express";
import { client } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
import catchAsync from "../../utils/catchAsync.js";
import ApiError from "../../errors/ApiError.js";
import { TodoValidation } from "./todos.validation.js";
import validateRequest from "../../middlewares/validateRequest.js";

export interface ITodo {
  title: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

// Helper function to calculate Levenshtein Distance for fuzzy matching
function getLevenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i]![0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0]![j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost =
        a.charAt(i - 1).toLowerCase() === b.charAt(j - 1).toLowerCase() ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1, // deletion
        matrix[i]![j - 1]! + 1, // insertion
        matrix[i - 1]![j - 1]! + cost, // substitution
      );
    }
  }
  return matrix[a.length]![b.length]!;
}

// Helper function to find a todo using fuzzy matching
function findFuzzyTodo(todos: ITodo[], targetTitle: string): ITodo | null {
  let closestTodo: ITodo | null = null;
  let minDistance = Infinity;

  for (const todo of todos) {
    // 1. Direct or case-insensitive partial match
    if (todo.title.toLowerCase().includes(targetTitle.toLowerCase())) {
      return todo;
    }

    // 2. Levenshtein Distance for typos
    const distance = getLevenshteinDistance(todo.title, targetTitle);
    if (distance < minDistance) {
      minDistance = distance;
      closestTodo = todo;
    }
  }

  // Threshold of 3 typos max
  return minDistance <= 3 ? closestTodo : null;
}

export const todosRouter = express.Router();

todosRouter.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const search = req.query.search as string;

    const db = client.db("tododb");
    const collection = db.collection("todos");

    // Fetch all todos from DB
    const allTodos = (await collection
      .find({})
      .toArray()) as unknown as ITodo[];

    // If search query is provided, use fuzzy search
    if (search) {
      const matchedTodo = findFuzzyTodo(allTodos, search);

      if (!matchedTodo) {
        throw new ApiError(404, "Data not found!");
      }

      res.status(200).json({
        message: "Todo searched successfully!",
        data: [matchedTodo],
      });
      return;
    }

    // If no search query, return all
    res.status(200).json({
      message: "Todos fetched successfully!",
      data: allTodos,
    });
  }),
);

todosRouter.post(
  "/create-todo",
  validateRequest(TodoValidation.createTodoZodSchema),
  catchAsync(async (req: Request, res: Response) => {
    // We don't need manual validation for title anymore, Zod handles it!
    const { title, description, priority, isCompleted } = req.body;

    const db = client.db("tododb");
    const collection = db.collection("todos");

    const result = await collection.insertOne({
      title,
      description: description || "ami ekhane",
      priority: priority || "low",
      isCompleted: isCompleted || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    res.status(201).json({
      message: "Todo created successfully!",
      data: {
        _id: result.insertedId,
      },
    });
  }),
);

todosRouter.get(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format!");
    }

    const db = client.db("tododb");
    const collection = db.collection("todos");

    const todo = await collection.findOne({ _id: new ObjectId(id) });

    if (!todo) {
      throw new ApiError(404, "Todo not found!");
    }

    res.status(200).json({
      message: "Todo fetched successfully!",
      data: todo,
    });
  }),
);

todosRouter.patch(
  "/update-todo/:id",
  validateRequest(TodoValidation.updateTodoZodSchema),
  catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const updateData = req.body;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format!");
    }

    const db = client.db("tododb");
    const collection = db.collection("todos");

    // Remove _id from updateData if the user accidentally sent it
    if (updateData._id) {
      delete updateData._id;
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date().toISOString(),
        },
      },
      { returnDocument: "after" },
    );

    if (!result) {
      throw new ApiError(404, "Todo not found!");
    }

    res.status(200).json({
      message: `Todo '${result.title}' updated successfully!`,
      data: result,
    });
  }),
);

todosRouter.delete(
  "/delete-todo/:id",
  catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid ID format!");
    }

    const db = client.db("tododb");
    const collection = db.collection("todos");

    const result = await collection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!result) {
      throw new ApiError(404, "Todo not found!");
    }

    res.status(200).json({
      message: `Todo '${result.title}' deleted successfully!`,
      data: result,
    });
  }),
);
