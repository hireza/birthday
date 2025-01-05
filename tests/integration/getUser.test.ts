import request from "supertest";
import { app, waitReady, stopServer } from "../../src/index";

describe("GET /users/:id API", () => {
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
    if (userId) {
      await request(app).delete(`/users/${userId}`);
    }

    await stopServer();
  });

  it("should retrieve user details successfully", async () => {
    const response = await request(app).get(`/users/${userId}`).expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.full_name).toBe(validUser.full_name);
    expect(response.body.birthday).toBe(validUser.birthday);
    expect(response.body.timezone).toBe(validUser.timezone);
  });

  it("should return 400 for a non valid id", async () => {
    const response = await request(app).get(`/users/invalid-id`).expect(400);

    expect(response.body.error).toBe("Invalid user ID");
  });

  it("should return 500 for a not found id", async () => {
    const response = await request(app)
      .get(`/users/539164a3-36cb-4b69-b2c0-0c15b6cc3227`)
      .expect(500);

    expect(response.body.error).toBe("Failed to get user");
  });
});
