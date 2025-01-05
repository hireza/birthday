import { Request, Response } from "express";
import { UserUsecase } from "../usecases/users";
import Joi from "joi";
import logger from "../utils/logger";

export class UserHandler {
  constructor(private readonly userUsecase: UserUsecase) {}

  private userSchema = (emailMandatory: boolean) =>
    Joi.object({
      email: Joi.string().email().when(Joi.ref("emailMandatory"), {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
      }),
      full_name: Joi.string().min(3).max(100).required(),
      birthday: Joi.string()
        .length(10)
        .required()
        .custom((value, helpers) => {
          const date = new Date(value);

          if (date.getDate() !== new Date(value).getDate()) {
            return helpers.error("any.invalid", {
              message: "Invalid date: day exceeds days in the month",
            });
          }

          return value;
        }, "Custom date validation"),
      timezone: Joi.string().required(),
    });

  private idSchema = Joi.string().uuid().required();

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = this.userSchema(true).validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        res.status(400).json({
          error: "Validation failed",
          details: error.details.map(d => d.message),
        });
        return;
      }

      logger.info("Creating new user", value);

      const user = await this.userUsecase.createUser(value);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof Error && (error as any).code === "23505") {
        res.status(409).json({ error: "Email already exists" });
      } else {
        logger.error("Failed to create user", error);
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { error } = this.idSchema.validate(req.params.id);
      if (error) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      logger.info(`Deleting user with ID: ${req.params.id}`);

      const userId = req.params.id;
      await this.userUsecase.deleteUser(userId);
      res.status(200).json({ message: `User with ID ${userId} deleted` });
    } catch (error) {
      logger.error("Failed to delete user", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { error: errorId } = this.idSchema.validate(req.params.id);
      if (errorId) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      const { error, value } = this.userSchema(false).validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        res.status(400).json({
          error: "Validation failed",
          details: error.details.map(d => d.message),
        });
        return;
      }

      logger.info(`Updating user with ID: ${req.params.id}`, value);

      const userId = req.params.id;
      const updatedUser = await this.userUsecase.updateUser(userId, value);

      res.json(updatedUser);
    } catch (error) {
      logger.error("Failed to update user", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { error } = this.idSchema.validate(req.params.id);
      if (error) {
        res.status(400).json({ error: "Invalid user ID" });
        return;
      }

      logger.info(`Getting user with ID: ${req.params.id}`);

      const userId = req.params.id;
      const user = await this.userUsecase.getUser(userId);
      res.status(200).json(user);
    } catch (error) {
      logger.error("Failed to get user", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  }
}
