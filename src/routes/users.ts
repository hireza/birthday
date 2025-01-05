import express, { Router, Request, Response } from "express";
import { UserHandler } from "../handlers/users";
import {
  errorHandler,
  errorNotFoundHandler,
} from "../middlewares/errorHandler";

export class UserRoute {
  private readonly router: Router;

  constructor(private readonly userHandler: UserHandler) {
    this.userHandler = userHandler;
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    const router = express.Router();

    this.router.use(express.json());

    this.router.get("/users/:id", (req: Request, res: Response) => {
      this.userHandler.getUser(req, res);
    });

    this.router.post("/users", (req: Request, res: Response) => {
      this.userHandler.createUser(req, res);
    });

    this.router.delete("/users/:id", (req: Request, res: Response) => {
      this.userHandler.deleteUser(req, res);
    });

    this.router.put("/users/:id", (req: Request, res: Response) => {
      this.userHandler.updateUser(req, res);
    });

    this.router.use(errorNotFoundHandler);
    this.router.use(errorHandler);
  }

  public getRouter(): Router {
    return this.router;
  }
}
