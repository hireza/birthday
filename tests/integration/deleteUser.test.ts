import request from "supertest";
import { app, waitReady, stopServer } from "../../src/index";

describe("DELETE /users/:id API", () => {
  let userId: string;

  const validUser = {
    email: "test@hireza.top",
    full_name: "Test User",
    birthday: "1990-01-01",
    timezone: "Asia/Jakarta",
  };

  beforeAll(async () => {
    await waitReady;

    const response = await request(app)
      .post("/users")
      .send(validUser)
      .expect(201);
    userId = response.body.id;
  });

  afterAll(async () => {
    await stopServer();
  });

  it("should delete a user successfully", async () => {
    const response = await request(app).delete(`/users/${userId}`).expect(200);

    expect(response.body.message).toContain("deleted");
  });

  it("should return 400 for a non valid id", async () => {
    const response = await request(app).delete(`/users/invalid-id`).expect(400);

    expect(response.body.error).toBe("Invalid user ID");
  });

  it("should return 500 for a not found id", async () => {
    const response = await request(app)
      .delete(`/users/539164a3-36cb-4b69-b2c0-0c15b6cc3227`)
      .expect(500);

    expect(response.body.error).toBe("Failed to delete user");
  });
});
