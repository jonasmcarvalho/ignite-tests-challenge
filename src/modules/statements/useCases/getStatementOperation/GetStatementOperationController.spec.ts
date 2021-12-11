import createConnection from "../../../../database"
import { Connection } from "typeorm"
import { v4 as uuid } from "uuid"
import { hash } from "bcryptjs"
import request from "supertest"
import { app } from "../../../../app"


let connection: Connection

describe("Get Statement Operation Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations()

    const id = uuid();
    let passwordHash = await hash("admin", 8)

    connection.query(
      `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
      values('${id}', 'admin', 'admin@finapi.com.br', '${passwordHash}', 'now()', 'now()')
      `
    );
  })

  afterAll(async () => {
    await connection.dropDatabase()
    await connection.close()
  })

  it("Should be abe to get a specific statement", async () => {
    const user = {
      email: "admin@finapi.com.br",
      password: "admin"
    }

    const userCreated = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })

    const depositStatement = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 103,
        description: "Test Create Statement Controller DEPOSIT"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    const withdrawStatement = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 17.5,
        description: "Test Create Statement Controller WITHDRAW"
      }).set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    const { id: statement_id } = withdrawStatement.body;

    const getStatement = await request(app)
      .get(`/api/v1/statements/${statement_id}`)
      .send()
      .set({
        Authorization: `Bearer ${userCreated.body.token}`
      })

    expect(getStatement.status).toBe(200)
    expect(getStatement.body.id).toEqual(withdrawStatement.body.id)
    expect(getStatement.body).toHaveProperty("description")
    expect(getStatement.body).toHaveProperty("amount")
    expect(getStatement.body.amount).toEqual("17.50")
  })
})
