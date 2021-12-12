import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


let authenticateUserUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;


describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to authenticate user data", async () => {

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

  it("Should not be able to authenticate a non-exists user data", async () => {

    const userData = {
      name: "Jonas",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await expect(authenticateUserUseCase.execute(userData))
      .rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it("Should not be able to authenticate a non-exists user data", async () => {

    const userData = {
      name: "Jonas",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await expect(authenticateUserUseCase.execute(userData))
      .rejects.toEqual(new IncorrectEmailOrPasswordError())
  })

  it("Should not be able to authenticate user with incorrect password", async () => {

    const userData = {
      name: "Jonas",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await createUserUseCase.execute(userData)

    await expect(authenticateUserUseCase.execute({
      email: userData.email,
      password: "4321"
    }))
      .rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})

