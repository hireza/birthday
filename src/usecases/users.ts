import { UserRepository } from "../repositories/users";
import { User } from "../models/users";
import { BirthdayWorkflow } from "../workflows/birthdayWorkflow";
import logger from "../utils/logger";

export class UserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly birthdayWorkflow: BirthdayWorkflow,
  ) {}

  async createUser(user: Omit<User, "id">): Promise<User> {
    try {
      logger.info("Creating new user:", user);
      const userCreated = await this.userRepository.create(user);
      logger.info("User created successfully:", userCreated);
      await this.birthdayWorkflow.addBirthdayWorkflow(userCreated);

      return userCreated;
    } catch (error) {
      logger.error("Failed to create user:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      logger.info(`Deleting user with ID: ${id}`);
      const userDeleted = await this.userRepository.deleteById(id);
      logger.info("User deleted successfully:", userDeleted);
      await this.birthdayWorkflow.deleteBirthdayWorkflow(userDeleted);
    } catch (error) {
      logger.error("Failed to delete user:", error);
      throw error;
    }
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    try {
      logger.info(`Updating user with ID: ${id}`, user);
      const userUpdated = await this.userRepository.update(id, user);
      logger.info("User updated successfully:", userUpdated);
      await this.birthdayWorkflow.deleteBirthdayWorkflow(userUpdated);
      await this.birthdayWorkflow.addBirthdayWorkflow(userUpdated);

      return userUpdated;
    } catch (error) {
      logger.error("Failed to update user:", error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      logger.info(`Getting user with ID: ${id}`);
      const user = await this.userRepository.findById(id);
      logger.info("User retrieved successfully:", user);

      return user;
    } catch (error) {
      logger.error("Failed to get user:", error);
      throw error;
    }
  }
}
