import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able get user data", async () => {

    const userData = {
      name: "Jonas",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await createUserUseCase.execute(userData)

    const response = await authenticateUserUseCase.execute({
      email: userData.email,
      password: userData.password
    })

    expect(response).toHaveProperty("user")
    expect(response).toHaveProperty("token")
    expect(response.user).toHaveProperty("id")
    expect(response.user).toHaveProperty("email")
    expect(response.user).toHaveProperty("name")
  })
})

