# ToDo Backend Application (Express + TypeScript + MongoDB)

This is a robust and scalable backend application for managing ToDos, built with Express.js, TypeScript, and MongoDB.

## 🚀 What has been built? (কি কি করা হয়েছে?)

1.  **RESTful API for ToDos**: Complete CRUD operations (Create, Read, Update, Delete) for ToDo items.
2.  **Advanced Search Functionality**: Implemented a custom **Fuzzy Search** algorithm (Levenshtein Distance) to allow users to search for ToDos even with typos (up to 3 character mistakes).
3.  **Data Validation**: Integrated **Zod** for strict request body validation (ensuring required fields like `title` are present and correct).
4.  **Error Handling Architecture**: Implemented a structured `ApiError` class, a `catchAsync` utility to avoid `try-catch` blocks in controllers, and a global error handling middleware.
5.  **Native MongoDB Driver**: Used the native MongoDB Node.js driver for direct database interaction instead of an ODM like Mongoose.
6.  **TypeScript Integration**: Fully typed codebase for better developer experience and compile-time error checking.

## 🤔 Why it was built this way? (কেন করা হয়েছে?)

-   **TypeScript**: Provides type safety, reduces runtime errors, and improves code autocompletion and readability.
-   **Zod**: A modern schema validation library that plays perfectly with TypeScript, keeping invalid data from ever hitting the database.
-   **Native MongoDB Driver**: Offers maximum performance and flexibility. It avoids the overhead of Mongoose for a simple application while teaching core MongoDB queries.
-   **Fuzzy Search (Levenshtein Distance)**: Enhances user experience by finding relevant ToDos even if the user slightly misspells the title.
-   **Modular Architecture**: Separating routes, validations, errors, and utils makes the application scalable. If we add a "Users" module later, it won't clutter the "ToDos" module.

## 🔍 How Levenshtein Distance Algorithm Works Here (লেভেনশটেইন ডিস্টেন্স অ্যালগরিদম)

We implemented the **Levenshtein Distance Algorithm** manually in `todos.routes.ts` to create a Fuzzy Search. 
- **What it does**: It calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to change the user's search query into the actual ToDo title.
- **Why use it**: If a user types "graceries" instead of "groceries", standard search will fail. Our algorithm calculates the "distance" (which is 1 typo here) and since we set a threshold of `3` typos, it successfully returns the correct ToDo.
- **Implementation**: It uses a dynamic programming matrix to compare strings efficiently before querying the database, making the API much more forgiving and user-friendly.

## 🏗️ Architecture & Flow (আর্কিটেকচার ফ্লো)

The application follows a **Modular MVC-like Architecture** (Controller logic is currently inside routes, but perfectly scoped).

1.  **Request Flow**:
    `Client Request` -> `Express App` -> `Global Middlewares (CORS, JSON parse)` -> `Router (/todos)`
2.  **Validation (Middleware)**:
    Before a request reaches the main logic (e.g., creating a ToDo), it passes through the `validateRequest` middleware which uses `Zod` to check if the data is valid.
3.  **Controller / Route Handler**:
    Wrapped in `catchAsync` to automatically forward any asynchronous errors to the Global Error Handler. It processes the request, interacts with the MongoDB collection, and formats the response.
4.  **Database Interaction**:
    Connects directly via `client.db("tododb").collection("todos")`.
5.  **Error Handling Flow**:
    If an error occurs (e.g., invalid ID, not found), an `ApiError` is thrown. The `catchAsync` catches it and sends it to `globalErrorHandler.ts`, which formats a consistent error response for the client.

## 📂 Project Structure

```
src/
├── app/
│   └── ToDos/
│       ├── todos.routes.ts      # API endpoints & controller logic & Fuzzy Search
│       └── todos.validation.ts  # Zod validation schemas
├── config/
│   └── mongodb.ts               # MongoDB connection setup
├── errors/
│   └── ApiError.ts              # Custom Error Class
├── middlewares/
│   ├── globalErrorHandler.ts    # Centralized error formatting
│   └── validateRequest.ts       # Higher-order function for Zod validation
├── utils/
│   └── catchAsync.ts            # Wrapper to catch promise rejections
├── app.ts                       # Express App setup & routing
└── server.ts                    # Entry point & DB connection initialization
```

## 🔌 API Endpoints

### ToDos (`/todos`)

-   **`GET /todos`**: Fetch all ToDos.
    -   *Query params*: `?search=keyword` (Supports fuzzy search for typos).
-   **`GET /todos/:id`**: Fetch a single ToDo by its MongoDB ObjectId.
-   **`POST /todos/create-todo`**: Create a new ToDo.
    -   *Body*: `{ "title": "Buy groceries", "description": "Milk, Eggs", "priority": "high", "isCompleted": false }`
-   **`PATCH /todos/update-todo/:id`**: Update an existing ToDo.
    -   *Body*: Any valid field to update.
-   **`DELETE /todos/delete-todo/:id`**: Delete a ToDo by ID.

## 🛠️ Tech Stack

-   **Node.js & Express.js**: Server and API Framework.
-   **TypeScript**: Programming Language.
-   **MongoDB**: NoSQL Database (Native Node Driver).
-   **Zod**: Schema Validation.
-   **Cors & Dotenv**: Utility middlewares.

## 🏃‍♂️ How to Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables (if any, like DB URI in a `.env` file).
3. Start the development server:
   ```bash
   npm run dev
   ```
