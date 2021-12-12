import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../../../users/useCases/createUser/CreateUserError";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}


describe("Create Statement Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)

    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
  })

  it("Should be able to create a new statement", async () => {
    const userData = {
      name: "Jonas Carvalho",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(userData)

    const depositStatement: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test"
    }

    const withdrawStatement: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.WITHDRAW,
      amount: 87,
      description: "test"
    }

    const depositStatementCreated = await createStatementUseCase.execute(depositStatement)
    const withdrawStatementCreated = await createStatementUseCase.execute(withdrawStatement)

    expect(depositStatementCreated).toHaveProperty("amount")
    expect(depositStatementCreated.amount).toEqual(100)
    expect(withdrawStatementCreated.user_id).toEqual(userCreated.id)
    expect(withdrawStatementCreated.amount).toEqual(87)
  })

  it("Should not be able to create a new withdraw for an insufficient funds", async () => {
    const userData = {
      name: "Jonas Carvalho",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(userData)

    const withdrawStatement: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "withdraw"
    }

    await expect(
      createStatementUseCase.execute(withdrawStatement)
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds())
  })

  it("Should not be able to create a new withdraw for an non-existing user", async () => {

    const withdrawStatement: ICreateStatementDTO = {
      user_id: "userCreated.id",
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "withdraw"
    }

    await expect(
      createStatementUseCase.execute(withdrawStatement)
    ).rejects.toEqual(new CreateStatementError.UserNotFound())
  })
})
