import request from "supertest";
import { app, waitReady, stopServer } from "../../src/index";

describe("GET /user API", () => {
  beforeAll(async () => {
    await waitReady;
  });

  afterAll(async () => {
    stopServer();
  });

  it("should not found", async () => {
    const response = await request(app).get(`/user`).expect(404);

    expect(response.body.title).toBe("NotFoundError");
    expect(response.body.message).toBe("Not Found");
  });
});
