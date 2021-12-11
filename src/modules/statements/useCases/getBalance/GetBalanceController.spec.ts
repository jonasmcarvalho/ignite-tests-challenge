import createConnection from "../../../../database"
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid"
import { hash } from "bcryptjs"
import request from "supertest"
import { app } from "../../../../app"


let connection: Connection

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const passwordHash = await hash("admin", 8)

    connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${passwordHash}', 'now()', 'now()')
      `
    )
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Get Balance Statement", async () => {
    const user = {
      email: "admin@finapi.com.br",
      password: "admin"
    }

    const userCreated = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 103,
        description: "Test Create Statement Controller DEPOSIT"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 17.50,
        description: "Test Create Statement Controller WITHDRAW"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    const responseBalance = await request(app)
      .get("/api/v1/statements/balance")
      .send().set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    expect(responseBalance.status).toBe(200)
    expect(responseBalance.body).toHaveProperty("balance")
    expect(responseBalance.body).toHaveProperty("statement")
    expect(responseBalance.body.balance).toEqual(85.5)
  })

})
