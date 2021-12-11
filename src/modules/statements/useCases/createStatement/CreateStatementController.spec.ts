import createConnection from "../../../../database";
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid";
import { hash } from "bcryptjs";
import request from "supertest";

import { app } from "../../../../app";

let connection: Connection;

describe("Create Statement Controller", () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()

    const id = uuid();
    const passwordHash = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${passwordHash}', 'now()', 'now()')
      `
    );
  })

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  })

  it("Should be able to create a new DEPOSIT statement", async () => {

    const user = {
      email: "admin@finapi.com.br",
      password: "admin"
    }

    const userCreated = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })

    const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 103,
        description: "Test Create Statement Controller DEPOSIT"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    expect(responseDeposit.status).toBe(201)
    expect(responseDeposit.body).toHaveProperty("id")
    expect(responseDeposit.body.amount).toEqual(103)
    expect(responseDeposit.body.description).toEqual("Test Create Statement Controller DEPOSIT")
  })

  it("Should be able to create a new  WITHDRAW statement", async () => {

    const user = {
      email: "admin@finapi.com.br",
      password: "admin"
    }

    const userCreated = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 17.50,
        description: "Test Create Statement Controller WITHDRAW"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    expect(response.status).toBe(201)
    expect(response.body.description).toEqual("Test Create Statement Controller WITHDRAW")
    expect(response.body).toHaveProperty("amount")
    expect(response.body.amount).toEqual(17.50)
  })
})
