import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to create a new user", async () => {
    const user = {
      name: "Jonas Carvalho",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email)

    expect(userCreated).toHaveProperty('email')
    expect(userCreated).toHaveProperty('name')
    expect(userCreated).toHaveProperty('password')
    expect(userCreated?.name).toEqual("Jonas Carvalho")
  })

  it("Should not be able to create a new user with email already exists", async () => {
    const user = {
      name: "Jonas Carvalho",
      email: "jonas@jonas.com.br",
      password: "1234"
    }

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    await expect(createUserUseCase.execute(user)).rejects.toEqual(new CreateUserError())
  })
})


