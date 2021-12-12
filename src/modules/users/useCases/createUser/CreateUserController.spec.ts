import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { AppError } from "../../../../shared/errors/AppError";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to create a new user", async () => {

    const responseUserCreated = await request(app).post('/api/v1/users')
      .send({
        name: "Jonas Carvalho",
        email: "admin456@finapi.com.br",
        password: "password"
      })

    expect(responseUserCreated.status).toBe(201);

  })

  it("Should not be able to create a new user with an already exists email", async () => {

    const responseUserCreated = await request(app).post('/api/v1/users')
      .send({
        name: "Jonas Carvalho",
        email: "admin456@finapi.com.br",
        password: "password"
      })

    expect(responseUserCreated.status).toBe(400);
    expect(responseUserCreated.body.message).toEqual("User already exists")
  })
})
