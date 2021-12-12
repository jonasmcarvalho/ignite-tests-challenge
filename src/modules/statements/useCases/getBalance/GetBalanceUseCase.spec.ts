import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "../getStatementOperation/GetStatementOperationError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryStatementRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw'
}

describe("Get Balance Use Case Test", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository)
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository)
  })

  it("Should be abe get a balance", async () => {

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

    await createStatementUseCase.execute(statementDepositData)
    await createStatementUseCase.execute(statementWithdrawData)

    const getBalance = await getBalanceUseCase.execute({ user_id: userCreated.id })

    expect(getBalance.balance).toEqual(85.69)
    expect(getBalance).toHaveProperty("balance")
  })

  it("Should not be abe get a balance with an non-exists user", async () => {

    await expect(getBalanceUseCase.execute(
      { user_id: "userCreated.id" }
    )).rejects.toEqual(new GetStatementOperationError.UserNotFound())
  })
})
