import express, { Express } from "express";
import morgan from "morgan";
import { Client as TemporalClient, Connection } from "@temporalio/client";
import { Client as PostgresClient } from "pg";

import { UserRoute } from "./routes/users";
import { UserHandler } from "./handlers/users";
import { UserUsecase } from "./usecases/users";
import { UserRepository } from "./repositories/users";
import { BirthdayWorkflow } from "./workflows/birthdayWorkflow";

import { config } from "./config";

const app: Express = express();
const port = process.env.PORT || 3000;

let resolveReady: () => void;
const waitReady = new Promise<void>(resolve => {
  resolveReady = resolve;
});

let server: any;

async function startServer() {
  try {
    const postgres = new PostgresClient(config.database);

    const temporal = new TemporalClient({
      connection: await Connection.connect(config.temporal),
    });

    const userRepository = new UserRepository(postgres);
    const birthdayWorkflow = new BirthdayWorkflow(temporal);
    const userUsecase = new UserUsecase(userRepository, birthdayWorkflow);
    const userHandler = new UserHandler(userUsecase);
    const userRoute = new UserRoute(userHandler);

    app.use(morgan("combined"));
    app.use("/", userRoute.getRouter());

    server = app.listen(port, onListening);
    server.on("error", onError);

    function onError(error: NodeJS.ErrnoException) {
      if (error.syscall !== "listen") {
        throw error;
      }

      const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
      switch (error.code) {
        case "EACCES":
          console.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case "EADDRINUSE":
          console.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    function onListening() {
      const addr = server.address();
      const bind =
        typeof addr === "string"
          ? `pipe ${addr}`
          : `port ${(addr as any).port}`;
      console.log(`Listening on ${bind}`);
      resolveReady();
    }
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

async function stopServer() {
  if (server) {
    console.log("Server stopped.");
    await new Promise<void>(resolve => {
      server.close(() => {
        resolve();
      });
    });
  }
}

startServer();

export { app, waitReady, stopServer };
