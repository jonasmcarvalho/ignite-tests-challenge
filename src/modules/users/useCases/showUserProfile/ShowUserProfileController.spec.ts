import createConnection from "../../../../database"
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid"
import { hash } from "bcryptjs"
import { app } from "../../../../app"
import request from "supertest";
import { response } from "express"

let connection: Connection

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid()
    const passwordHash = await hash("admin", 8)

    await connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${passwordHash}', 'now()', 'now()')
      `
    );
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be able a show user profile", async () => {

    const userCreated = await request(app).post("/api/v1/sessions").send({
      email: "admin@finapi.com.br",
      password: "admin"
    })

    const responseProfile = await request(app)
      .get("/api/v1/profile")
      .send({

      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    expect(responseProfile.status).toBe(200)
    expect(responseProfile.body.name).toEqual("admin")
    expect(responseProfile.body).toHaveProperty("created_at")
    expect(userCreated.body).toHaveProperty("token")
  })
})
