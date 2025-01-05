import request from "supertest";
import { app, waitReady, stopServer } from "../../src/index";

describe("PUT /users/:id API", () => {
  let userId: string;

  const validUser = {
    email: "test@hireza.top",
    full_name: "Test User",
    birthday: "1990-01-01",
    timezone: "Asia/Jakarta",
  };

  const updatedUser = {
    full_name: "Updated User",
    birthday: "1991-01-02",
    timezone: "Asia/Bangkok",
  };

  const invalidUser = {
    email: "mr.mhd.reza@gmailcom",
    full_name: "RP",
    birthday: "2025-06-32",
    timezone: "",
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

  it("should update a user successfully", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send(updatedUser)
      .expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body.full_name).toBe(updatedUser.full_name);
    expect(response.body.birthday).toBe(updatedUser.birthday);
    expect(response.body.timezone).toBe(updatedUser.timezone);
  });

  it("should fail to create a user with invalid input", async () => {
    const response = await request(app)
      .put(`/users/${userId}`)
      .send(invalidUser)
      .expect(400);

    expect(response.body.error).toBe("Validation failed");

    const expectedDetails = [
      '"email" must be a valid email',
      '"full_name" length must be at least 3 characters long',
      '"birthday" contains an invalid value',
      '"timezone" is not allowed to be empty',
    ];

    expectedDetails.forEach((detail, i) => {
      expect(response.body.details[i]).toContain(detail);
    });
  });

  it("should return 400 for a non valid id", async () => {
    const response = await request(app)
      .put(`/users/invalid-id`)
      .send(updatedUser)
      .expect(400);

    expect(response.body.error).toBe("Invalid user ID");
  });

  it("should return 500 for a not found id", async () => {
    const response = await request(app)
      .put(`/users/539164a3-36cb-4b69-b2c0-0c15b6cc3227`)
      .send(updatedUser)
      .expect(500);

    expect(response.body.error).toBe("Failed to update user");
  });
});
