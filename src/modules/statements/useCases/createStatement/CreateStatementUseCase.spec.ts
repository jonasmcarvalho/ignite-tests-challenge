import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
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

    console.log(userCreated)

    const statementData: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test"
    }

    const statementCreated = await createStatementUseCase.execute(statementData)

    console.log(statementCreated)

  })
})
