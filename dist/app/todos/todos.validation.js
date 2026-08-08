import { z } from "zod";
/**
 * Zod schema for validating the creation of a new Todo.
 */
const createTodoZodSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required!"),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        isCompleted: z.boolean().optional(),
    }),
});
/**
 * Zod schema for validating the update of an existing Todo.
 */
const updateTodoZodSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
        isCompleted: z.boolean().optional(),
    }),
});
export const TodoValidation = {
    createTodoZodSchema,
    updateTodoZodSchema,
};
