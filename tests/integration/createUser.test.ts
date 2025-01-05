import request from "supertest";
import { app, waitReady, stopServer } from "../../src/index";

describe("POST /users API", () => {
  let userId: string;

  const validUser = {
    email: "test@hireza.top",
    full_name: "Test User",
    birthday: "1990-01-01",
    timezone: "Asia/Jakarta",
  };

  const invalidUser = {
    email: "mr.mhd.reza@gmailcom",
    full_name: "RP",
    birthday: "2025-06-32",
    timezone: "",
  };

  const duplicateEmailUser = { ...validUser };

  beforeAll(async () => {
    await waitReady;
  });

  afterAll(async () => {
    if (userId) {
      await request(app).delete(`/users/${userId}`);
    }

    await stopServer();
  });

  it("should create a user successfully", async () => {
    const response = await request(app)
      .post("/users")
      .send(validUser)
      .expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body.full_name).toBe(validUser.full_name);
    expect(response.body.birthday).toBe(validUser.birthday);
    expect(response.body.timezone).toBe(validUser.timezone);

    userId = response.body.id;
  });

  it("should fail to create a user with a duplicate email", async () => {
    const response = await request(app)
      .post("/users")
      .send(duplicateEmailUser)
      .expect(409);

    expect(response.body.error).toBe("Email already exists");
  });

  it("should fail to create a user with invalid input", async () => {
    const response = await request(app)
      .post("/users")
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
});
