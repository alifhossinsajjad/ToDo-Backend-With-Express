import { Server } from "http";
import app from "./app.js";
import { client } from "./config/mongodb.js";

const port = 5000;

let server: Server;

async function bootstrap() {
  try {
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );

    server = app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

bootstrap();
