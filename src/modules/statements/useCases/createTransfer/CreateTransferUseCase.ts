import { inject, injectable } from "tsyringe";
import { validate } from "uuid";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateTransferError } from "./CreateTransferError";
import { ICreateTransferDTO } from "./ICreateTransferDTO";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = "transfer",
}

@injectable()
class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) { }

  async execute({
    user_id,
    receiver_id,
    amount,
    description
  }: ICreateTransferDTO) {

    const validateSenderId = validate(user_id)
    const validateReceiverId = validate(receiver_id)

    if (!validateSenderId || !validateReceiverId) {
      throw new CreateTransferError.invalidUuid()
    }

    const sender = await this.usersRepository.findById(user_id);
    const receiver = await this.usersRepository.findById(receiver_id)

    if (!sender) {
      throw new CreateTransferError.SenderNotFound();
    }

    if (!receiver) {
      throw new CreateTransferError.receiverNotFound()
    }

    const balance = await this.statementsRepository.getUserBalance({ user_id, with_statement: true })

    if (amount > balance.balance) {
      throw new CreateTransferError.InsufficientFunds()
    }

    const transferOperation = await this.statementsRepository.create({
      user_id,
      receiver_id,
      type: OperationType.TRANSFER,
      amount,
      description,
    });

    return transferOperation;
  }
}

export { CreateTransferUseCase }

