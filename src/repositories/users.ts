import { Client } from "pg";
import { User } from "../models/users";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

export class UserRepository {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
    this.client.connect();
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const text =
      "INSERT INTO users (id, email, full_name, birthday, timezone) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [
      uuidv4(),
      user.email,
      user.full_name,
      user.birthday,
      user.timezone,
    ];

    try {
      logger.info("Creating new user:", user);
      const result = await this.client.query(text, values);
      logger.info("User created successfully:", result.rows[0]);
      return result.rows[0] as User;
    } catch (error) {
      logger.error("Error creating user:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const result = await this.client.query(
        "SELECT * FROM users WHERE id = $1",
        [id],
      );

      if (result.rows.length === 0) {
        throw new Error("User not found");
      }

      logger.info("User retrieved successfully:", result.rows[0]);
      return result.rows[0] as User;
    } catch (error) {
      logger.error("Error finding user:", error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<User> {
    const result = await this.client.query(
      "SELECT email FROM users WHERE id = $1",
      [id],
    );

    if (result.rows.length === 0) {
      throw new Error("User not found");
    }

    try {
      logger.info(`Deleting user with ID: ${id}`);
      await this.client.query("DELETE FROM users WHERE id = $1", [id]);
      logger.info("User deleted successfully:", result.rows[0]);
      return result.rows[0] as User;
    } catch (error) {
      logger.error("Error deleting user:", error);
      throw error;
    }
  }

  async update(id: string, user: Partial<User>): Promise<User> {
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    let i = 1;

    if (user.full_name) {
      updateFields.push(`full_name = $${i++}`);
      updateValues.push(user.full_name);
    }
    if (user.birthday) {
      updateFields.push(`birthday = $${i++}`);
      updateValues.push(user.birthday);
    }
    if (user.timezone) {
      updateFields.push(`timezone = $${i++}`);
      updateValues.push(user.timezone);
    }

    updateFields.push(`updated_at = $${i++}`);
    updateValues.push(new Date());

    let updateStatement = `UPDATE users SET ${updateFields.join(", ")}`;

    updateStatement += ` WHERE id = $${i++}`;
    updateValues.push(id);

    try {
      logger.info(`Updating user with ID: ${id}`, user);
      await this.client.query(updateStatement, updateValues);
      const result = await this.findById(id);
      logger.info("User updated successfully:", result);
      return result;
    } catch (error) {
      logger.error("Error updating user:", error);
      throw error;
    }
  }
}
