import express, {} from "express";
import cors from "cors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import { todosRouter } from "./app/ToDos/todos.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
const userRouter = express.Router();
app.use("/todos", todosRouter);
app.use("/users", userRouter);
app.get("/", (req, res) => {
    res.send("Welcome to the ToDo App!");
});
// Global Error Handler
app.use(globalErrorHandler);
export default app;
// Trigger nodemon restart
