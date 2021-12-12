import request from "supertest";
import { app } from "../../../../app";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";

let connection: Connection;

describe("Authenticate User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid()
    const passwordHash = await hash('finapi', 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${passwordHash}', 'now()', 'now()')
      `
    )
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to authenticate and get a user data", async () => {
    const user = {
      email: 'admin@finapi.com.br',
      password: 'finapi'
    }

    const response = await request(app).post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      })

    expect(response.status).toEqual(200)
    expect(response.body.user.name).toEqual("admin")
    expect(response.body.user).toHaveProperty("id")
    expect(response.body).toHaveProperty("token")
  })

  it("Should not be able to authenticate and get a user data with incorrect password", async () => {
    const user = {
      email: 'admin@finapi.com.br',
      password: 'finapu'
    }

    const response = await request(app).post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      })

    expect(response.status).toEqual(401)
  })

  it("Should not be able to authenticate and get a user data with incorrect e-mail", async () => {
    const user = {
      email: 'admin20@finapi.com.br',
      password: 'finapi'
    }

    const response = await request(app).post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      })

    expect(response.status).toEqual(401)
    expect(response.body.message).toEqual("Incorrect email or password")
  })

})
