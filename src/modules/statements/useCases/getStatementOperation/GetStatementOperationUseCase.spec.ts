import exp from "constants";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

describe("Get Statement Operation Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,
      inMemoryStatementRepository)

    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository,
      inMemoryStatementRepository)
  })

  it("Should be abe to get a specific statement operation", async () => {
    const userData = {
      name: "Jonas Carvalho",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    const userCreated = await createUserUseCase.execute(userData)

    const statementDepositData: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.DEPOSIT,
      amount: 103,
      description: "Deposit Statement"
    }

    const statementWithdrawData: ICreateStatementDTO = {
      user_id: userCreated.id,
      type: OperationType.WITHDRAW,
      amount: 17.31,
      description: "Withdraw Statement"
    }

    const depositStatementCreated = await createStatementUseCase.execute(statementDepositData)
    const withdrawStatementCreated = await createStatementUseCase.execute(statementWithdrawData)

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: depositStatementCreated.user_id,
      statement_id: depositStatementCreated.id,
    })

    expect(statementOperation).toHaveProperty("amount")
    expect(statementOperation.amount).toEqual(103)
    expect(statementOperation.user_id).toEqual(userCreated.id)
    expect(statementOperation.id).toEqual(depositStatementCreated.id)
  })
})
