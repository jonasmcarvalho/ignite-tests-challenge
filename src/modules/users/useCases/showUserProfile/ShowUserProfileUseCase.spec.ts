import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUSeCase: ShowUserProfileUseCase
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile Use Case", () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    showUserProfileUSeCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
  })

  it("Should be able a show user profile", async () => {
    const user = {
      name: "Jonas Show",
      email: "jonas@jonasshow.com.br",
      password: "1234"
    }

    await createUserUseCase.execute(user)

    const userCreated = await inMemoryUsersRepository.findByEmail(user.email);

    const userProfile = await showUserProfileUSeCase.execute(userCreated?.id as string)

    expect(userProfile).toHaveProperty("id");
    expect(userProfile).toHaveProperty("name");
    expect(userProfile).toHaveProperty("email");
    expect(userProfile).toHaveProperty("password");
  })
})
